"use server";

import { randomUUID } from "crypto";

import { LeadStatus, PageType, RevisionStatus, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeHref } from "@/lib/content/legacy-source";
import {
  contentPagePayloadSchema,
  homePagePayloadSchema,
  splitKeywords,
  type HomePagePayload
} from "@/lib/content/schemas";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function stringField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalStringField(formData: FormData, key: string) {
  const value = stringField(formData, key);
  return value || "";
}

function numberField(formData: FormData, key: string, fallback = 0) {
  const raw = stringField(formData, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function jsonField<T>(formData: FormData, key: string, fallback: T) {
  const raw = stringField(formData, key);

  if (!raw) {
    return fallback;
  }

  return JSON.parse(raw) as T;
}

function buildSeoPayload(formData: FormData) {
  const title = stringField(formData, "seoTitle");
  const description = stringField(formData, "seoDescription");

  return {
    title,
    description,
    keywords: splitKeywords(stringField(formData, "seoKeywords")),
    canonicalUrl: stringField(formData, "canonicalUrl"),
    ogImage: optionalStringField(formData, "ogImage"),
    ogTitle: optionalStringField(formData, "ogTitle") || title,
    ogDescription: optionalStringField(formData, "ogDescription") || description,
    twitterTitle: optionalStringField(formData, "twitterTitle") || title,
    twitterDescription:
      optionalStringField(formData, "twitterDescription") || description
  };
}

function buildHomePayload(formData: FormData) {
  const seo = buildSeoPayload(formData);
  const contactPhones = jsonField<string[]>(formData, "contactPhones", []);
  const contactEmails = jsonField<string[]>(formData, "contactEmails", []);
  const heroStats = jsonField<HomePagePayload["siteConfig"]["hero"]["stats"]>(
    formData,
    "heroStats",
    []
  );
  const aboutParagraphs = jsonField<string[]>(formData, "aboutParagraphs", []);
  const aboutHighlights = jsonField<HomePagePayload["siteConfig"]["about"]["highlights"]>(
    formData,
    "aboutHighlights",
    []
  );
  const services = jsonField<HomePagePayload["siteConfig"]["services"]>(
    formData,
    "servicesItems",
    []
  ).map((service) => ({
    ...service,
    page: normalizeHref(service.page)
  }));
  const whyUsFeatures = jsonField<HomePagePayload["siteConfig"]["whyUs"]["features"]>(
    formData,
    "whyUsFeatures",
    []
  );
  const testimonials = jsonField<HomePagePayload["siteConfig"]["testimonials"]>(
    formData,
    "testimonialsItems",
    []
  );
  const clientLogos = jsonField<string[]>(formData, "clientLogos", []);

  return homePagePayloadSchema.parse({
    seo,
    bodyHtml: stringField(formData, "bodyHtml"),
    siteConfig: {
      branding: {
        companyName: stringField(formData, "brandingCompanyName"),
        companyFullName: stringField(formData, "brandingCompanyFullName"),
        tagline: stringField(formData, "brandingTagline"),
        logoPath: normalizeHref(stringField(formData, "brandingLogoPath")),
        faviconPath: normalizeHref(stringField(formData, "brandingFaviconPath")),
        primaryColor: stringField(formData, "brandingPrimaryColor"),
        fontFamily: stringField(formData, "brandingFontFamily")
      },
      contact: {
        address: {
          street: stringField(formData, "contactStreet"),
          city: stringField(formData, "contactCity"),
          state: stringField(formData, "contactState"),
          pincode: stringField(formData, "contactPincode"),
          country: stringField(formData, "contactCountry")
        },
        phones: contactPhones,
        emails: contactEmails,
        mapEmbedUrl: optionalStringField(formData, "contactMapEmbedUrl"),
        businessHours: stringField(formData, "contactBusinessHours")
      },
      social: {
        linkedin: optionalStringField(formData, "socialLinkedin"),
        instagram: optionalStringField(formData, "socialInstagram"),
        facebook: optionalStringField(formData, "socialFacebook"),
        google: optionalStringField(formData, "socialGoogle"),
        whatsappNumber: optionalStringField(formData, "socialWhatsappNumber")
      },
      hero: {
        badgeText: stringField(formData, "heroBadgeText"),
        headline: stringField(formData, "heroHeadline"),
        accentText: optionalStringField(formData, "heroAccentText"),
        subtitle: stringField(formData, "heroSubtitle"),
        primaryCTA: {
          text: stringField(formData, "heroPrimaryCtaText"),
          link: normalizeHref(stringField(formData, "heroPrimaryCtaLink")),
          icon: optionalStringField(formData, "heroPrimaryCtaIcon") || "headset_mic"
        },
        secondaryCTA: {
          text: stringField(formData, "heroSecondaryCtaText"),
          link: normalizeHref(stringField(formData, "heroSecondaryCtaLink")),
          icon: optionalStringField(formData, "heroSecondaryCtaIcon")
        },
        stats: heroStats
      },
      about: {
        label: stringField(formData, "aboutLabel"),
        headline: stringField(formData, "aboutHeadline"),
        paragraphs: aboutParagraphs,
        highlights: aboutHighlights,
        yearsExperience: numberField(formData, "aboutYearsExperience")
      },
      services,
      whyUs: {
        label: stringField(formData, "whyUsLabel"),
        headline: stringField(formData, "whyUsHeadline"),
        subtitle: stringField(formData, "whyUsSubtitle"),
        features: whyUsFeatures
      },
      testimonials,
      clientLogos,
      seo: {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords.join(", "),
        canonicalUrl: seo.canonicalUrl,
        ogImage: seo.ogImage
      },
      footer: {
        copyrightText: stringField(formData, "footerCopyrightText"),
        privacyPolicyUrl: normalizeHref(stringField(formData, "footerPrivacyPolicyUrl")),
        termsUrl: normalizeHref(stringField(formData, "footerTermsUrl"))
      }
    }
  });
}

function buildContentPayload(formData: FormData) {
  return contentPagePayloadSchema.parse({
    seo: buildSeoPayload(formData),
    bodyHtml: stringField(formData, "bodyHtml")
  });
}

export async function savePageDraftAction(formData: FormData) {
  const session = await requireRole([Role.ADMIN, Role.EDITOR]);
  const pageId = stringField(formData, "pageId");
  const displayTitle = stringField(formData, "displayTitle");

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: {
      revisions: {
        orderBy: {
          revisionNumber: "desc"
        }
      }
    }
  });

  if (!page) {
    redirect("/admin/content");
  }

  const payload =
    page.pageType === PageType.HOME ? buildHomePayload(formData) : buildContentPayload(formData);

  const revisionNumber = (page.revisions[0]?.revisionNumber ?? 0) + 1;

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      revisionNumber,
      status: RevisionStatus.DRAFT,
      title: displayTitle,
      seoTitle: payload.seo.title,
      seoDescription: payload.seo.description,
      canonicalUrl: payload.seo.canonicalUrl,
      socialImageUrl: payload.seo.ogImage,
      keywords: payload.seo.keywords,
      payload,
      previewToken: randomUUID(),
      createdById: session.user.id
    }
  });

  await prisma.page.update({
    where: {
      id: page.id
    },
    data: {
      title: displayTitle,
      currentDraftId: revision.id
    }
  });

  revalidatePath(page.slug);
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${page.id}`);
  redirect(`/admin/content/${page.id}?saved=1`);
}

export async function publishRevisionAction(formData: FormData) {
  await requireRole([Role.ADMIN, Role.EDITOR]);

  const pageId = stringField(formData, "pageId");
  const revisionId = stringField(formData, "revisionId");

  const page = await prisma.page.findUnique({
    where: { id: pageId }
  });

  if (!page) {
    redirect("/admin/content");
  }

  await prisma.pageRevision.updateMany({
    where: {
      pageId,
      status: RevisionStatus.PUBLISHED
    },
    data: {
      status: RevisionStatus.ARCHIVED
    }
  });

  await prisma.pageRevision.update({
    where: {
      id: revisionId
    },
    data: {
      status: RevisionStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.page.update({
    where: {
      id: pageId
    },
    data: {
      publishedRevId: revisionId
    }
  });

  revalidatePath(page.slug);
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${page.id}`);
  redirect(`/admin/content/${page.id}?published=1`);
}

export async function updateLeadAction(formData: FormData) {
  const session = await requireRole([Role.ADMIN, Role.SALES]);
  const leadId = stringField(formData, "leadId");
  const status = stringField(formData, "status") as LeadStatus;
  const assignedToId = optionalStringField(formData, "assignedToId");
  const note = optionalStringField(formData, "note");

  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId
    },
    data: {
      status,
      assignedToId: assignedToId || null,
      notes: note || null
    }
  });

  await prisma.leadActivity.create({
    data: {
      leadId: updatedLead.id,
      authorId: session.user.id,
      type: "lead-update",
      summary: `Lead marked ${status.toLowerCase()}`,
      detail: note || null
    }
  });

  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export async function createUserAction(formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = stringField(formData, "name");
  const email = stringField(formData, "email").toLowerCase();
  const password = stringField(formData, "password");
  const role = stringField(formData, "role") as Role;

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hash(password, 10),
      role
    }
  });

  revalidatePath("/admin/team");
  redirect("/admin/team");
}
