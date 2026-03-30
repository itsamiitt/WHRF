export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { getMetadataForSlug, PublicPageView } from "@/components/site/public-page-view";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getMetadataForSlug(`/services/${slug}`);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  return <PublicPageView slug={`/services/${slug}`} />;
}
