import { promises as fs } from "fs";
import path from "path";

import { PageType } from "@prisma/client";

import { getStaticPageSource } from "@/lib/content/page-manifest";
import {
  contentPagePayloadSchema,
  type ContentPagePayload,
  homePagePayloadSchema,
  type HomePagePayload,
  splitKeywords
} from "@/lib/content/schemas";

const defaultSiteUrl = "https://wrhwfour.com";

const legacyDir = path.join(/* turbopackIgnore: true */ process.cwd(), "_legacy");

const projectFilePaths = {
  "index.html": path.join(legacyDir, "index.html"),
  "about.html": path.join(legacyDir, "about.html"),
  "contact.html": path.join(legacyDir, "contact.html"),
  "services.html": path.join(legacyDir, "services.html"),
  "privacy-policy.html": path.join(legacyDir, "privacy-policy.html"),
  "terms-of-service.html": path.join(legacyDir, "terms-of-service.html"),
  "services/cctv-installation.html": path.join(
    legacyDir,
    "services",
    "cctv-installation.html"
  ),
  "services/computer-sales-repair.html": path.join(
    legacyDir,
    "services",
    "computer-sales-repair.html"
  ),
  "services/server-installation.html": path.join(
    legacyDir,
    "services",
    "server-installation.html"
  ),
  "services/biometric-attendance.html": path.join(
    legacyDir,
    "services",
    "biometric-attendance.html"
  ),
  "services/corporate-it-amc.html": path.join(
    legacyDir,
    "services",
    "corporate-it-amc.html"
  ),
  "services/networking-solutions.html": path.join(
    legacyDir,
    "services",
    "networking-solutions.html"
  ),
  "services/hardware-support.html": path.join(
    legacyDir,
    "services",
    "hardware-support.html"
  ),
  "data/site-config.json": path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "site-config.json"
  )
} as const;

const textReplacementPairs: Array<[string, string]> = [
  ["â€”", " - "],
  ["â€“", " - "],
  ["â€º", ">"],
  ["â€™", "'"],
  ["â€œ", '"'],
  ["â€\u009d", '"'],
  ["â€", '"']
];

const htmlReplacementPairs: Array<[string, string]> = [
  ["â€”", "&mdash;"],
  ["â€“", "&ndash;"],
  ["â€º", "&rsaquo;"],
  ["âœ“", "&#10003;"],
  ["â˜…", "&#9733;"],
  ["â€™", "'"],
  ["â€œ", "&ldquo;"],
  ["â€\u009d", "&rdquo;"]
];

function repairString(value: string, mode: "text" | "html") {
  const pairs = mode === "html" ? htmlReplacementPairs : textReplacementPairs;

  return pairs.reduce((current, [needle, replacement]) => {
    return current.split(needle).join(replacement);
  }, value);
}

function repairJsonValue<T>(value: T): T {
  if (typeof value === "string") {
    return repairString(value, "text") as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => repairJsonValue(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairJsonValue(item)])
    ) as T;
  }

  return value;
}

function extractHeadValue(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function normalizeAssetPath(value: string) {
  let normalized = value.replace(/\\/g, "/").trim();

  while (normalized.startsWith("../")) {
    normalized = normalized.slice(3);
  }

  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }

  if (normalized.startsWith("assets/")) {
    return `/${normalized}`;
  }

  return normalized;
}

export function normalizeHref(value: string) {
  const trimmed = value.trim();

  if (
    !trimmed ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  const hashIndex = trimmed.indexOf("#");
  const hashSuffix = hashIndex >= 0 ? trimmed.slice(hashIndex) : "";
  const pathOnly = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;

  let normalized = pathOnly.replace(/\\/g, "/");

  while (normalized.startsWith("../")) {
    normalized = normalized.slice(3);
  }

  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }

  if (normalized.startsWith("assets/")) {
    return `/${normalized}${hashSuffix}`;
  }

  if (normalized === "index.html") {
    return `/${hashSuffix}`;
  }

  if (normalized === "about.html") {
    return `/about${hashSuffix}`;
  }

  if (normalized === "contact.html") {
    return `/contact${hashSuffix}`;
  }

  if (normalized === "services.html") {
    return `/services${hashSuffix}`;
  }

  if (normalized === "privacy-policy.html") {
    return `/privacy-policy${hashSuffix}`;
  }

  if (normalized === "terms-of-service.html") {
    return `/terms-of-service${hashSuffix}`;
  }

  if (normalized === "data/site-config.json") {
    return "/api/public/site-config";
  }

  if (normalized.startsWith("services/") && normalized.endsWith(".html")) {
    const slug = normalized.replace(/^services\//, "").replace(/\.html$/, "");
    return `/services/${slug}${hashSuffix}`;
  }

  if (normalized.endsWith(".html")) {
    const slug = normalized.replace(/\.html$/, "");
    return `/services/${slug}${hashSuffix}`;
  }

  return normalized ? `/${normalized}${hashSuffix}` : hashSuffix || trimmed;
}

function normalizeLegacyBodyHtml(bodyHtml: string) {
  const withoutScripts = bodyHtml.replace(/<script\b[\s\S]*?<\/script>/gi, "");

  const normalizedLinks = withoutScripts.replace(
    /\b(href|src)=["']([^"']+)["']/gi,
    (_, attr: string, value: string) => `${attr}="${normalizeHref(value)}"`
  );

  return repairString(normalizedLinks, "html");
}

export function resolveProjectFilePath(relativePath: string) {
  const filePath = projectFilePaths[relativePath as keyof typeof projectFilePaths];

  if (!filePath) {
    throw new Error(`Unsupported legacy content file: ${relativePath}`);
  }

  return filePath;
}

async function readProjectFile(relativePath: string) {
  return fs.readFile(resolveProjectFilePath(relativePath), "utf8");
}

function parseSeo(html: string, slug: string) {
  const title = repairString(extractHeadValue(html, /<title>([\s\S]*?)<\/title>/i), "text");
  const description = repairString(
    extractHeadValue(html, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i),
    "text"
  );
  const keywords = splitKeywords(
    repairString(
      extractHeadValue(html, /<meta\s+name=["']keywords["']\s+content=["']([\s\S]*?)["']/i),
      "text"
    )
  );
  const canonicalUrl =
    repairString(
      extractHeadValue(html, /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i),
      "text"
    ) || `${defaultSiteUrl}${slug === "/" ? "/" : slug}`;
  const ogTitle = repairString(
    extractHeadValue(html, /<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i),
    "text"
  );
  const ogDescription = repairString(
    extractHeadValue(
      html,
      /<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i
    ),
    "text"
  );
  const ogImage = normalizeAssetPath(
    extractHeadValue(html, /<meta\s+property=["']og:image["']\s+content=["']([\s\S]*?)["']/i)
  );
  const twitterTitle = repairString(
    extractHeadValue(
      html,
      /<meta\s+name=["']twitter:title["']\s+content=["']([\s\S]*?)["']/i
    ),
    "text"
  );
  const twitterDescription = repairString(
    extractHeadValue(
      html,
      /<meta\s+name=["']twitter:description["']\s+content=["']([\s\S]*?)["']/i
    ),
    "text"
  );

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    twitterTitle: twitterTitle || title,
    twitterDescription: twitterDescription || description
  };
}

function extractBodyHtml(html: string) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match?.[1]?.trim() ?? "";
}

export async function buildStaticPayloadForSlug(
  slug: string
): Promise<HomePagePayload | ContentPagePayload | null> {
  const source = getStaticPageSource(slug);

  if (!source) {
    return null;
  }

  const html = await readProjectFile(source.filePath);
  const seo = parseSeo(html, slug);
  const bodyHtml = normalizeLegacyBodyHtml(extractBodyHtml(html));

  if (source.pageType === PageType.HOME) {
    const siteConfigRaw = JSON.parse(await readProjectFile("data/site-config.json"));
    const repairedConfig = repairJsonValue(siteConfigRaw) as HomePagePayload["siteConfig"];
    const normalizedConfig = {
      ...repairedConfig,
      branding: {
        ...repairedConfig.branding,
        logoPath: normalizeHref(repairedConfig.branding.logoPath),
        faviconPath: normalizeHref(repairedConfig.branding.faviconPath)
      },
      hero: {
        ...repairedConfig.hero,
        primaryCTA: {
          ...repairedConfig.hero.primaryCTA,
          link: normalizeHref(repairedConfig.hero.primaryCTA.link)
        },
        secondaryCTA: {
          ...repairedConfig.hero.secondaryCTA,
          link: normalizeHref(repairedConfig.hero.secondaryCTA.link)
        }
      },
      services: repairedConfig.services.map((service) => ({
        ...service,
        page: normalizeHref(service.page)
      })),
      footer: {
        ...repairedConfig.footer,
        privacyPolicyUrl: normalizeHref(repairedConfig.footer.privacyPolicyUrl),
        termsUrl: normalizeHref(repairedConfig.footer.termsUrl)
      },
      seo: {
        ...repairedConfig.seo,
        canonicalUrl: repairedConfig.seo.canonicalUrl || seo.canonicalUrl,
        ogImage: normalizeAssetPath(repairedConfig.seo.ogImage)
      }
    };

    return homePagePayloadSchema.parse({
      seo,
      siteConfig: normalizedConfig,
      bodyHtml
    });
  }

  return contentPagePayloadSchema.parse({
    seo,
    bodyHtml
  });
}
