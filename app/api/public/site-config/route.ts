import { PageType, RevisionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import siteConfigFallback from "@/data/site-config.json";
import { parsePayloadByPageType, type HomePagePayload } from "@/lib/content/schemas";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getPublishedSiteConfig() {
  if (!process.env.DATABASE_URL) {
    return siteConfigFallback;
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: {
        revisions: {
          orderBy: {
            revisionNumber: "desc"
          }
        }
      }
    });

    if (!page || page.pageType !== PageType.HOME) {
      return siteConfigFallback;
    }

    const revision =
      page.revisions.find((item) => item.id === page.publishedRevId) ??
      page.revisions.find((item) => item.status === RevisionStatus.PUBLISHED) ??
      page.revisions.find((item) => item.id === page.currentDraftId) ??
      page.revisions[0];

    if (!revision) {
      return siteConfigFallback;
    }

    const payload = parsePayloadByPageType(page.pageType, revision.payload) as HomePagePayload;
    return payload.siteConfig;
  } catch {
    return siteConfigFallback;
  }
}

export async function GET() {
  const siteConfig = await getPublishedSiteConfig();

  return NextResponse.json(siteConfig, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
