import type { Metadata } from "next";

import type { PublicPageRecord } from "@/lib/content/pages";

export function buildMetadata(page: PublicPageRecord): Metadata {
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.keywords,
    alternates: {
      canonical: page.canonicalUrl
    },
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      type: "website",
      url: page.canonicalUrl,
      images: page.ogImage ? [page.ogImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitterTitle,
      description: page.twitterDescription,
      images: page.ogImage ? [page.ogImage] : undefined
    }
  };
}
