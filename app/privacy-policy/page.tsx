import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | WRHWFOUR Private Limited",
  description: "Read the Privacy Policy of WRHWFOUR Private Limited. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://wrhwfour.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <span className="current">Privacy Policy</span>
          </div>
          <h1>Privacy Policy</h1>
          <p className="page-subtitle">Your privacy matters to us. This policy explains how we handle your information.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="legal-content">
          <p className="last-updated">Last Updated: March 22, 2026</p>

          <h2>1. Information We Collect</h2>
          <p>WRHWFOUR Private Limited (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;) collects information to provide better services to our clients. We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, company name, and job title provided through our inquiry forms or direct communication.</li>
            <li><strong>Business Information:</strong> Company details, IT infrastructure requirements, service preferences, and project specifications.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and browser type.</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and analyze website traffic.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>To respond to your inquiries and provide IT service quotations</li>
            <li>To deliver and maintain our IT services and support</li>
            <li>To send relevant service updates and promotional communications (with consent)</li>
            <li>To improve our website, services, and customer experience</li>
            <li>To comply with legal obligations and protect our rights</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our website and services (under strict confidentiality agreements)</li>
            <li><strong>Legal Requirements:</strong> When required by law, legal process, or government request</li>
            <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of company assets</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include SSL encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt-out of marketing communications at any time</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h2>6. Cookies Policy</h2>
          <p>Our website uses cookies to improve your experience. You can control cookie settings through your browser preferences. Disabling cookies may affect certain functionalities of our website.</p>

          <h2>7. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

          <h2>10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p><strong>WRHWFOUR Private Limited</strong><br />8th Floor, World Trade Centre, Unit No.801, Kharadi, Pune, Maharashtra 411014<br />Email: <a href="mailto:contact@wrhwfour.com" style={{ color: "var(--tertiary)" }}>contact@wrhwfour.com</a><br />Phone: <a href="tel:+91XXXXXXXXXX" style={{ color: "var(--tertiary)" }}>+91-XXXXXXXXXX</a></p>
        </div>
      </section>
    </SiteShell>
  );
}
