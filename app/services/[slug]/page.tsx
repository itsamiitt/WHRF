import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { getServiceBySlug, servicesData } from "@/lib/services-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return servicesData.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `https://wrhwfour.com/services/${slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const titleLines = service.pageTitle.split("\n");

  return (
    <SiteShell variant="services">
      <section className="page-hero service-page-hero">
        <div className="container">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="separator">›</span>
              <Link href="/services">Services</Link>
              <span className="separator">›</span>
              <span className="current">{titleLines[0]}</span>
            </div>
            <h1>
              {titleLines[0]}<br />
              {titleLines[1]}
            </h1>
            <p className="page-subtitle">{service.heroSubtitle}</p>
            <div style={{ marginTop: "var(--space-8)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary btn-lg">
                <span className="material-icons-outlined btn-icon">headset_mic</span> Get a Free Consultation
              </Link>
              <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener" className="btn btn-secondary btn-lg">Talk on WhatsApp</a>
            </div>
          </div>
          <div className="service-detail-visual fade-in-right" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="detail-icon" style={{ background: "rgba(255,255,255,0.1)", color: "var(--on-primary)" }}>
              <span className="material-icons-outlined">{service.icon}</span>
            </div>
            <div className="detail-stats">
              <div className="detail-stat">
                <div className="stat-value" style={{ color: "var(--on-primary)" }}>{service.stat1Value}</div>
                <div className="stat-desc" style={{ color: "rgba(255,255,255,0.6)" }}>{service.stat1Label}</div>
              </div>
              <div className="detail-stat">
                <div className="stat-value" style={{ color: "var(--on-primary)" }}>{service.stat2Value}</div>
                <div className="stat-desc" style={{ color: "rgba(255,255,255,0.6)" }}>{service.stat2Label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <span className="label-md">Overview</span>
          <h2>{service.overviewTitle}</h2>
          {service.overview.map((p, i) => <p key={i}>{p}</p>)}
          <h3 style={{ marginTop: "var(--space-10)" }}>{service.featuresTitle}</h3>
          <ul className="service-features-list" style={{ marginTop: "var(--space-4)" }}>
            {service.features.map(f => (
              <li key={f}><span className="material-icons-outlined">check_circle</span> {f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">How It Works</span>
            <h2 className="headline-md">{service.processTitle}</h2>
            <p>{service.processSubtitle}</p>
          </div>
          <div className="process-steps">
            {service.process.map(step => (
              <div className="process-step fade-in" key={step.title}>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">Common Questions</span>
            <h2 className="headline-md">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {service.faqs.map(faq => (
              <div className="faq-item" key={faq.q}>
                <button className="faq-question">
                  {faq.q}
                  <span className="material-icons-outlined">expand_more</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>{service.ctaTitle}</h2>
          <p>{service.ctaDesc}</p>
          <div className="btn-group">
            <Link href="/contact" className="btn btn-primary btn-lg">
              <span className="material-icons-outlined btn-icon">headset_mic</span> Request a Quote
            </Link>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener" className="btn btn-secondary btn-lg">Talk on WhatsApp</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
