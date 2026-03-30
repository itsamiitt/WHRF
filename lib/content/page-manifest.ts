import { PageType } from "@prisma/client";

export type StaticPageSource = {
  slug: string;
  filePath: string;
  pageType: PageType;
  title: string;
};

export const staticPageManifest: StaticPageSource[] = [
  { slug: "/", filePath: "index.html", pageType: PageType.HOME, title: "Home" },
  { slug: "/about", filePath: "about.html", pageType: PageType.ABOUT, title: "About" },
  { slug: "/contact", filePath: "contact.html", pageType: PageType.CONTACT, title: "Contact" },
  {
    slug: "/services",
    filePath: "services.html",
    pageType: PageType.SERVICES_INDEX,
    title: "Services"
  },
  {
    slug: "/services/cctv-installation",
    filePath: "services/cctv-installation.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "CCTV Installation & Maintenance"
  },
  {
    slug: "/services/computer-sales-repair",
    filePath: "services/computer-sales-repair.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Computer / CPU Sales & Repair"
  },
  {
    slug: "/services/server-installation",
    filePath: "services/server-installation.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Server Installation & Maintenance"
  },
  {
    slug: "/services/biometric-attendance",
    filePath: "services/biometric-attendance.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Biometric Attendance Machines"
  },
  {
    slug: "/services/corporate-it-amc",
    filePath: "services/corporate-it-amc.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Corporate IT AMC"
  },
  {
    slug: "/services/networking-solutions",
    filePath: "services/networking-solutions.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Networking Solutions"
  },
  {
    slug: "/services/hardware-support",
    filePath: "services/hardware-support.html",
    pageType: PageType.SERVICE_DETAIL,
    title: "Hardware Support for Companies"
  },
  {
    slug: "/privacy-policy",
    filePath: "privacy-policy.html",
    pageType: PageType.PRIVACY_POLICY,
    title: "Privacy Policy"
  },
  {
    slug: "/terms-of-service",
    filePath: "terms-of-service.html",
    pageType: PageType.TERMS_OF_SERVICE,
    title: "Terms of Service"
  }
];

export const staticPageManifestBySlug = new Map(
  staticPageManifest.map((page) => [page.slug, page])
);

export function getStaticPageSource(slug: string) {
  return staticPageManifestBySlug.get(slug);
}
