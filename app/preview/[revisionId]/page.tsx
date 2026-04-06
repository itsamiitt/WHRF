export const dynamic = "force-dynamic";

import { Role } from "@prisma/client";

import { PreviewPageView } from "@/components/site/public-page-view";
import { requireRole } from "@/lib/auth/session";

type PreviewPageProps = {
  params: Promise<{
    revisionId: string;
  }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  await requireRole([Role.ADMIN, Role.EDITOR]);
  const { revisionId } = await params;

  return <PreviewPageView revisionId={revisionId} />;
}
