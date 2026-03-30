import Link from "next/link";
import { notFound } from "next/navigation";

import { PageType, RevisionStatus, Role } from "@prisma/client";

import { publishRevisionAction, savePageDraftAction } from "@/app/admin/actions";
import { requireRole } from "@/lib/auth/session";
import { buildStaticPayloadForSlug } from "@/lib/content/legacy-source";
import { getAdminPage } from "@/lib/content/pages";
import { type HomePagePayload, parsePayloadByPageType } from "@/lib/content/schemas";

type AdminContentEditorPageProps = {
  params: Promise<{
    pageId: string;
  }>;
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function pickEditableRevision(page: Awaited<ReturnType<typeof getAdminPage>>) {
  if (!page) {
    return null;
  }

  return (
    page.revisions.find((revision) => revision.id === page.currentDraftId) ??
    page.revisions.find((revision) => revision.id === page.publishedRevId) ??
    page.revisions[0] ??
    null
  );
}

export default async function AdminContentEditorPage({
  params
}: AdminContentEditorPageProps) {
  await requireRole([Role.ADMIN, Role.EDITOR]);
  const { pageId } = await params;
  const page = await getAdminPage(pageId);

  if (!page) {
    notFound();
  }

  const activeRevision = pickEditableRevision(page);
  const payload =
    activeRevision && activeRevision.payload
      ? parsePayloadByPageType(page.pageType, activeRevision.payload)
      : await buildStaticPayloadForSlug(page.slug);

  if (!payload) {
    notFound();
  }

  const resolvedPayload = payload;
  const homePayload =
    page.pageType === PageType.HOME ? (resolvedPayload as HomePagePayload) : null;

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>{page.title}</h1>
          <p>
            Editing <code>{page.slug}</code> ({page.pageType}).
          </p>
        </div>
        <div className="admin-actions">
          <Link className="admin-button-secondary" href={page.slug} target="_blank">
            Open Live Page
          </Link>
          <Link className="admin-button-secondary" href="/admin/content">
            Back to Content
          </Link>
        </div>
      </div>

      <div className="admin-grid" style={{ alignItems: "start" }}>
        <article className="admin-card" style={{ gridColumn: "span 2" }}>
          <h3>Draft Editor</h3>
          <form action={savePageDraftAction} className="admin-stack">
            <input name="pageId" type="hidden" value={page.id} />

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="displayTitle">Display Title</label>
                <input
                  defaultValue={page.title}
                  id="displayTitle"
                  name="displayTitle"
                  required
                  type="text"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="canonicalUrl">Canonical URL</label>
                <input
                  defaultValue={resolvedPayload.seo.canonicalUrl}
                  id="canonicalUrl"
                  name="canonicalUrl"
                  required
                  type="text"
                />
              </div>
              <div className="admin-field full">
                <label htmlFor="seoTitle">SEO Title</label>
                <input
                  defaultValue={resolvedPayload.seo.title}
                  id="seoTitle"
                  name="seoTitle"
                  required
                  type="text"
                />
              </div>
              <div className="admin-field full">
                <label htmlFor="seoDescription">SEO Description</label>
                <textarea
                  defaultValue={resolvedPayload.seo.description}
                  id="seoDescription"
                  name="seoDescription"
                  required
                  rows={3}
                />
              </div>
              <div className="admin-field full">
                <label htmlFor="seoKeywords">SEO Keywords</label>
                <input
                  defaultValue={resolvedPayload.seo.keywords.join(", ")}
                  id="seoKeywords"
                  name="seoKeywords"
                  type="text"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ogImage">Social Image</label>
                <input
                  defaultValue={resolvedPayload.seo.ogImage}
                  id="ogImage"
                  name="ogImage"
                  type="text"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ogTitle">OG Title</label>
                <input
                  defaultValue={resolvedPayload.seo.ogTitle}
                  id="ogTitle"
                  name="ogTitle"
                  type="text"
                />
              </div>
              <div className="admin-field full">
                <label htmlFor="ogDescription">OG Description</label>
                <textarea
                  defaultValue={resolvedPayload.seo.ogDescription}
                  id="ogDescription"
                  name="ogDescription"
                  rows={2}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="twitterTitle">Twitter Title</label>
                <input
                  defaultValue={resolvedPayload.seo.twitterTitle}
                  id="twitterTitle"
                  name="twitterTitle"
                  type="text"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="twitterDescription">Twitter Description</label>
                <textarea
                  defaultValue={resolvedPayload.seo.twitterDescription}
                  id="twitterDescription"
                  name="twitterDescription"
                  rows={2}
                />
              </div>
            </div>

            {page.pageType === PageType.HOME ? (
              <>
                <input name="bodyHtml" type="hidden" value={resolvedPayload.bodyHtml} />

                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="brandingCompanyName">Company Name</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.companyName}
                      id="brandingCompanyName"
                      name="brandingCompanyName"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="brandingCompanyFullName">Full Company Name</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.companyFullName}
                      id="brandingCompanyFullName"
                      name="brandingCompanyFullName"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="brandingTagline">Tagline</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.tagline}
                      id="brandingTagline"
                      name="brandingTagline"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="brandingLogoPath">Logo Path</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.logoPath}
                      id="brandingLogoPath"
                      name="brandingLogoPath"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="brandingFaviconPath">Favicon Path</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.faviconPath}
                      id="brandingFaviconPath"
                      name="brandingFaviconPath"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="brandingPrimaryColor">Primary Color</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.primaryColor}
                      id="brandingPrimaryColor"
                      name="brandingPrimaryColor"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="brandingFontFamily">Font Family</label>
                    <input
                      defaultValue={homePayload!.siteConfig.branding.fontFamily}
                      id="brandingFontFamily"
                      name="brandingFontFamily"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="contactStreet">Street Address</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.address.street}
                      id="contactStreet"
                      name="contactStreet"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="contactCity">City</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.address.city}
                      id="contactCity"
                      name="contactCity"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="contactState">State</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.address.state}
                      id="contactState"
                      name="contactState"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="contactPincode">Pincode</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.address.pincode}
                      id="contactPincode"
                      name="contactPincode"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="contactCountry">Country</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.address.country}
                      id="contactCountry"
                      name="contactCountry"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="contactPhones">Phones JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.contact.phones)}
                      id="contactPhones"
                      name="contactPhones"
                      rows={4}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="contactEmails">Emails JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.contact.emails)}
                      id="contactEmails"
                      name="contactEmails"
                      rows={4}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="contactMapEmbedUrl">Map Embed URL</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.contact.mapEmbedUrl}
                      id="contactMapEmbedUrl"
                      name="contactMapEmbedUrl"
                      rows={3}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="contactBusinessHours">Business Hours</label>
                    <input
                      defaultValue={homePayload!.siteConfig.contact.businessHours}
                      id="contactBusinessHours"
                      name="contactBusinessHours"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="socialLinkedin">LinkedIn URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.social.linkedin}
                      id="socialLinkedin"
                      name="socialLinkedin"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="socialInstagram">Instagram URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.social.instagram}
                      id="socialInstagram"
                      name="socialInstagram"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="socialFacebook">Facebook URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.social.facebook}
                      id="socialFacebook"
                      name="socialFacebook"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="socialGoogle">Google URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.social.google}
                      id="socialGoogle"
                      name="socialGoogle"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="socialWhatsappNumber">WhatsApp Number</label>
                    <input
                      defaultValue={homePayload!.siteConfig.social.whatsappNumber}
                      id="socialWhatsappNumber"
                      name="socialWhatsappNumber"
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="heroBadgeText">Hero Badge Text</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.badgeText}
                      id="heroBadgeText"
                      name="heroBadgeText"
                      required
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="heroHeadline">Hero Headline</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.hero.headline}
                      id="heroHeadline"
                      name="heroHeadline"
                      rows={3}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroAccentText">Hero Accent Text</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.accentText}
                      id="heroAccentText"
                      name="heroAccentText"
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="heroSubtitle">Hero Subtitle</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.hero.subtitle}
                      id="heroSubtitle"
                      name="heroSubtitle"
                      rows={3}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroPrimaryCtaText">Primary CTA Text</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.primaryCTA.text}
                      id="heroPrimaryCtaText"
                      name="heroPrimaryCtaText"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroPrimaryCtaLink">Primary CTA Link</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.primaryCTA.link}
                      id="heroPrimaryCtaLink"
                      name="heroPrimaryCtaLink"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroPrimaryCtaIcon">Primary CTA Icon</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.primaryCTA.icon}
                      id="heroPrimaryCtaIcon"
                      name="heroPrimaryCtaIcon"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroSecondaryCtaText">Secondary CTA Text</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.secondaryCTA.text}
                      id="heroSecondaryCtaText"
                      name="heroSecondaryCtaText"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroSecondaryCtaLink">Secondary CTA Link</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.secondaryCTA.link}
                      id="heroSecondaryCtaLink"
                      name="heroSecondaryCtaLink"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="heroSecondaryCtaIcon">Secondary CTA Icon</label>
                    <input
                      defaultValue={homePayload!.siteConfig.hero.secondaryCTA.icon}
                      id="heroSecondaryCtaIcon"
                      name="heroSecondaryCtaIcon"
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="heroStats">Hero Stats JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.hero.stats)}
                      id="heroStats"
                      name="heroStats"
                      rows={6}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="aboutLabel">About Label</label>
                    <input
                      defaultValue={homePayload!.siteConfig.about.label}
                      id="aboutLabel"
                      name="aboutLabel"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="aboutYearsExperience">Years Experience</label>
                    <input
                      defaultValue={homePayload!.siteConfig.about.yearsExperience}
                      id="aboutYearsExperience"
                      name="aboutYearsExperience"
                      type="number"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="aboutHeadline">About Headline</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.about.headline}
                      id="aboutHeadline"
                      name="aboutHeadline"
                      rows={2}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="aboutParagraphs">About Paragraphs JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.about.paragraphs)}
                      id="aboutParagraphs"
                      name="aboutParagraphs"
                      rows={6}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="aboutHighlights">About Highlights JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.about.highlights)}
                      id="aboutHighlights"
                      name="aboutHighlights"
                      rows={6}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="whyUsLabel">Why Us Label</label>
                    <input
                      defaultValue={homePayload!.siteConfig.whyUs.label}
                      id="whyUsLabel"
                      name="whyUsLabel"
                      type="text"
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="whyUsHeadline">Why Us Headline</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.whyUs.headline}
                      id="whyUsHeadline"
                      name="whyUsHeadline"
                      rows={2}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="whyUsSubtitle">Why Us Subtitle</label>
                    <textarea
                      defaultValue={homePayload!.siteConfig.whyUs.subtitle}
                      id="whyUsSubtitle"
                      name="whyUsSubtitle"
                      rows={2}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="whyUsFeatures">Why Us Features JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.whyUs.features)}
                      id="whyUsFeatures"
                      name="whyUsFeatures"
                      rows={8}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="servicesItems">Services JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.services)}
                      id="servicesItems"
                      name="servicesItems"
                      rows={10}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="testimonialsItems">Testimonials JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.testimonials)}
                      id="testimonialsItems"
                      name="testimonialsItems"
                      rows={10}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="clientLogos">Client Logos JSON</label>
                    <textarea
                      defaultValue={prettyJson(homePayload!.siteConfig.clientLogos)}
                      id="clientLogos"
                      name="clientLogos"
                      rows={4}
                    />
                  </div>
                  <div className="admin-field full">
                    <label htmlFor="footerCopyrightText">Footer Copyright</label>
                    <input
                      defaultValue={homePayload!.siteConfig.footer.copyrightText}
                      id="footerCopyrightText"
                      name="footerCopyrightText"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="footerPrivacyPolicyUrl">Privacy Policy URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.footer.privacyPolicyUrl}
                      id="footerPrivacyPolicyUrl"
                      name="footerPrivacyPolicyUrl"
                      type="text"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="footerTermsUrl">Terms URL</label>
                    <input
                      defaultValue={homePayload!.siteConfig.footer.termsUrl}
                      id="footerTermsUrl"
                      name="footerTermsUrl"
                      type="text"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-field full">
                <label htmlFor="bodyHtml">Page Body HTML</label>
                <textarea
                  defaultValue={resolvedPayload.bodyHtml}
                  id="bodyHtml"
                  name="bodyHtml"
                  rows={28}
                />
              </div>
            )}

            <div className="admin-actions">
              <button className="admin-button" type="submit">
                Save New Draft Revision
              </button>
            </div>
          </form>
        </article>

        <article className="admin-card">
          <h3>Revision History</h3>
          <div className="admin-stack">
            {page.revisions.map((revision) => (
              <div
                key={revision.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "16px"
                }}
              >
                <p style={{ marginTop: 0, fontWeight: 700 }}>
                  Revision {revision.revisionNumber}
                </p>
                <p className="admin-muted">
                  {revision.status} • {new Date(revision.createdAt).toLocaleString()}
                </p>
                <div className="admin-actions">
                  <Link
                    className="admin-button-secondary"
                    href={`/preview/${revision.id}`}
                    target="_blank"
                  >
                    Preview
                  </Link>
                  {revision.status !== RevisionStatus.PUBLISHED ? (
                    <form action={publishRevisionAction}>
                      <input name="pageId" type="hidden" value={page.id} />
                      <input name="revisionId" type="hidden" value={revision.id} />
                      <button className="admin-button" type="submit">
                        Publish
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <h3>Editing Notes</h3>
          {page.pageType === PageType.HOME ? (
            <p>
              The landing page layout stays locked to the current production markup. This editor
              changes the structured home content, SEO, and CTA wiring without changing the visual
              shell.
            </p>
          ) : (
            <p>
              Inner pages currently use a rich HTML body field so we can preserve the original page
              markup exactly while still versioning and publishing through the database.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
