import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyPage } from "@/components/site/legacy-page";
import { getPreviewPageByRevisionId, getPublicPageBySlug } from "@/lib/content/pages";
import { buildMetadata } from "@/lib/metadata";

export async function getMetadataForSlug(slug: string): Promise<Metadata> {
  const page = await getPublicPageBySlug(slug);

  if (!page) {
    return {};
  }

  return buildMetadata(page);
}

export async function PublicPageView({ slug }: { slug: string }) {
  const page = await getPublicPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const resolvedPage = page;

  return <LegacyPage pageType={resolvedPage.pageType} bodyHtml={resolvedPage.payload.bodyHtml} />;
}

export async function PreviewPageView({ revisionId }: { revisionId: string }) {
  const page = await getPreviewPageByRevisionId(revisionId);

  if (!page) {
    notFound();
  }

  const resolvedPage = page;

  return <LegacyPage pageType={resolvedPage.pageType} bodyHtml={resolvedPage.payload.bodyHtml} />;
}
