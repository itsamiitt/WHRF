import type { Page, PageRevision } from "@prisma/client";
import { PageType, RevisionStatus } from "@prisma/client";

import { buildStaticPayloadForSlug } from "@/lib/content/legacy-source";
import { staticPageManifest } from "@/lib/content/page-manifest";
import {
  type ContentPagePayload,
  type HomePagePayload,
  parsePayloadByPageType
} from "@/lib/content/schemas";
import { prisma } from "@/lib/prisma";

export type PublicPageRecord = {
  id: string;
  slug: string;
  title: string;
  pageType: PageType;
  payload: HomePagePayload | ContentPagePayload;
  revisionId: string;
  revisionNumber: number;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
};

export type AdminPageRecord = Page & {
  revisions: PageRevision[];
};

function buildPublicPageRecord(
  page: Pick<Page, "id" | "slug" | "title" | "pageType">,
  revision: Pick<
    PageRevision,
    | "id"
    | "revisionNumber"
    | "seoTitle"
    | "seoDescription"
    | "canonicalUrl"
    | "socialImageUrl"
    | "keywords"
    | "payload"
  >
) {
  const payload = parsePayloadByPageType(page.pageType, revision.payload);

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    pageType: page.pageType,
    payload,
    revisionId: revision.id,
    revisionNumber: revision.revisionNumber,
    seoTitle: revision.seoTitle || payload.seo.title,
    seoDescription: revision.seoDescription || payload.seo.description,
    keywords: revision.keywords.length ? revision.keywords : payload.seo.keywords,
    canonicalUrl: revision.canonicalUrl || payload.seo.canonicalUrl,
    ogImage: revision.socialImageUrl || payload.seo.ogImage,
    ogTitle: payload.seo.ogTitle || revision.seoTitle || payload.seo.title,
    ogDescription:
      payload.seo.ogDescription || revision.seoDescription || payload.seo.description,
    twitterTitle: payload.seo.twitterTitle || revision.seoTitle || payload.seo.title,
    twitterDescription:
      payload.seo.twitterDescription || revision.seoDescription || payload.seo.description
  } satisfies PublicPageRecord;
}

async function getFallbackPublicPage(slug: string) {
  const payload = await buildStaticPayloadForSlug(slug);

  if (!payload) {
    return null;
  }

  return {
    id: `static:${slug}`,
    slug,
    title: payload.seo.title,
    pageType:
      slug === "/"
        ? PageType.HOME
        : staticPageManifest.find((page) => page.slug === slug)?.pageType ?? PageType.ABOUT,
    payload,
    revisionId: `static:${slug}`,
    revisionNumber: 1,
    seoTitle: payload.seo.title,
    seoDescription: payload.seo.description,
    keywords: payload.seo.keywords,
    canonicalUrl: payload.seo.canonicalUrl,
    ogImage: payload.seo.ogImage,
    ogTitle: payload.seo.ogTitle || payload.seo.title,
    ogDescription: payload.seo.ogDescription || payload.seo.description,
    twitterTitle: payload.seo.twitterTitle || payload.seo.title,
    twitterDescription: payload.seo.twitterDescription || payload.seo.description
  } satisfies PublicPageRecord;
}

function pickRevision(page: AdminPageRecord) {
  return (
    page.revisions.find((revision) => revision.id === page.publishedRevId) ??
    page.revisions.find((revision) => revision.status === RevisionStatus.PUBLISHED) ??
    page.revisions.find((revision) => revision.id === page.currentDraftId) ??
    page.revisions[0] ??
    null
  );
}

export async function getPublicPageBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return getFallbackPublicPage(slug);
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        revisions: {
          orderBy: {
            revisionNumber: "desc"
          }
        }
      }
    });

    if (!page) {
      return getFallbackPublicPage(slug);
    }

    const revision = pickRevision(page);

    if (!revision) {
      return getFallbackPublicPage(slug);
    }

    return buildPublicPageRecord(page, revision);
  } catch {
    return getFallbackPublicPage(slug);
  }
}

export async function getPreviewPageByRevisionId(revisionId: string) {
  const revision = await prisma.pageRevision.findUnique({
    where: { id: revisionId },
    include: { page: true }
  });

  if (!revision) {
    return null;
  }

  return buildPublicPageRecord(revision.page, revision);
}

export async function getPublishedSiteConfig() {
  const page = await getPublicPageBySlug("/");

  if (!page || page.pageType !== PageType.HOME) {
    return null;
  }

  const homePayload = page.payload as HomePagePayload;

  return homePayload.siteConfig;
}

export async function listAdminPages() {
  return prisma.page.findMany({
    include: {
      revisions: {
        orderBy: {
          revisionNumber: "desc"
        }
      }
    },
    orderBy: {
      slug: "asc"
    }
  });
}

export async function getAdminPage(pageId: string) {
  return prisma.page.findUnique({
    where: {
      id: pageId
    },
    include: {
      revisions: {
        orderBy: {
          revisionNumber: "desc"
        }
      }
    }
  });
}
