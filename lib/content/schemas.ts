import { PageType } from "@prisma/client";
import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const seoSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  keywords: z.array(z.string().trim()).default([]),
  canonicalUrl: nonEmptyString,
  ogImage: z.string().trim().default(""),
  ogTitle: z.string().trim().default(""),
  ogDescription: z.string().trim().default(""),
  twitterTitle: z.string().trim().default(""),
  twitterDescription: z.string().trim().default("")
});

const ctaSchema = z.object({
  text: nonEmptyString,
  link: nonEmptyString,
  icon: z.string().trim().default("")
});

const statSchema = z.object({
  number: z.number().int().nonnegative(),
  suffix: z.string().trim().default(""),
  label: nonEmptyString
});

const iconTextSchema = z.object({
  icon: nonEmptyString,
  text: nonEmptyString
});

const serviceSchema = z.object({
  id: nonEmptyString,
  icon: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
  page: nonEmptyString
});

const testimonialSchema = z.object({
  text: nonEmptyString,
  author: nonEmptyString,
  role: nonEmptyString,
  initials: nonEmptyString,
  rating: z.number().int().min(1).max(5)
});

const featureSchema = z.object({
  icon: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString
});

export const homeSiteConfigSchema = z.object({
  branding: z.object({
    companyName: nonEmptyString,
    companyFullName: nonEmptyString,
    tagline: nonEmptyString,
    logoPath: nonEmptyString,
    faviconPath: nonEmptyString,
    primaryColor: nonEmptyString,
    fontFamily: nonEmptyString
  }),
  contact: z.object({
    address: z.object({
      street: nonEmptyString,
      city: nonEmptyString,
      state: nonEmptyString,
      pincode: nonEmptyString,
      country: nonEmptyString
    }),
    phones: z.array(nonEmptyString),
    emails: z.array(nonEmptyString),
    mapEmbedUrl: z.string().trim().default(""),
    businessHours: nonEmptyString
  }),
  social: z.object({
    linkedin: z.string().trim().default("#"),
    instagram: z.string().trim().default("#"),
    facebook: z.string().trim().default("#"),
    google: z.string().trim().default("#"),
    whatsappNumber: z.string().trim().default("")
  }),
  hero: z.object({
    badgeText: nonEmptyString,
    headline: nonEmptyString,
    accentText: z.string().trim().default(""),
    subtitle: nonEmptyString,
    primaryCTA: ctaSchema,
    secondaryCTA: ctaSchema,
    stats: z.array(statSchema)
  }),
  about: z.object({
    label: nonEmptyString,
    headline: nonEmptyString,
    paragraphs: z.array(nonEmptyString),
    highlights: z.array(iconTextSchema),
    yearsExperience: z.number().int().nonnegative()
  }),
  services: z.array(serviceSchema),
  whyUs: z.object({
    label: nonEmptyString,
    headline: nonEmptyString,
    subtitle: nonEmptyString,
    features: z.array(featureSchema)
  }),
  testimonials: z.array(testimonialSchema),
  clientLogos: z.array(nonEmptyString),
  seo: z.object({
    title: nonEmptyString,
    description: nonEmptyString,
    keywords: nonEmptyString,
    canonicalUrl: nonEmptyString,
    ogImage: z.string().trim().default("")
  }),
  footer: z.object({
    copyrightText: nonEmptyString,
    privacyPolicyUrl: nonEmptyString,
    termsUrl: nonEmptyString
  })
});

export const homePagePayloadSchema = z.object({
  seo: seoSchema,
  siteConfig: homeSiteConfigSchema,
  bodyHtml: nonEmptyString
});

export const contentPagePayloadSchema = z.object({
  seo: seoSchema,
  bodyHtml: nonEmptyString
});

export type HomePagePayload = z.infer<typeof homePagePayloadSchema>;
export type ContentPagePayload = z.infer<typeof contentPagePayloadSchema>;

export function parsePayloadByPageType(pageType: PageType, payload: unknown) {
  if (pageType === PageType.HOME) {
    return homePagePayloadSchema.parse(payload);
  }

  return contentPagePayloadSchema.parse(payload);
}

export function splitKeywords(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
