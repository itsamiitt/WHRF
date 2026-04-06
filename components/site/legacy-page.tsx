import Script from "next/script";

import { PageType } from "@prisma/client";

type LegacyPageProps = {
  pageType: PageType;
  bodyHtml: string;
};

export function LegacyPage({ pageType, bodyHtml }: LegacyPageProps) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {pageType === PageType.HOME ? (
        <Script src="/assets/site-config.js" strategy="afterInteractive" />
      ) : null}
      <Script src="/assets/script.js" strategy="afterInteractive" />
    </>
  );
}
