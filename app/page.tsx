export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { getMetadataForSlug, PublicPageView } from "@/components/site/public-page-view";

export async function generateMetadata(): Promise<Metadata> {
  return getMetadataForSlug("/");
}

export default function HomePage() {
  return <PublicPageView slug="/" />;
}
