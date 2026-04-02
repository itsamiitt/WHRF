import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "About Us | WRHWFOUR Private Limited — Trusted IT Partner Since Day One",
  description: "Learn about WRHWFOUR Private Limited — a trusted Pan-India IT Sales & Services company headquartered in Pune. Discover our mission, values, team, and commitment to corporate IT excellence.",
  alternates: { canonical: "https://wrhwfour.com/about" },
};

export default function AboutPage() {
  return (
    <SiteShell variant="about" includePageStyles={true}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <span className="current">About Us</span>
          </div>
          <h1>About WRHWFOUR<br />Private Limited</h1>
          <p className="page-subtitle">Building reliable technology ecosystems for corporate India. Learn about our mission, our journey, and the team that makes it all possible.</p>
        </div>
      </section>

      <section className="content-section" id="story">
        <div className="container">
          <div className="about-content-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div className="fade-in-left">
              <span className="label-md">Our Story</span>
              <h2>A Commitment to Corporate IT Excellence</h2>
              <p>WRHWFOUR Private Limited was founded with a singular vision: to be the most reliable IT infrastructure partner for businesses across India. Headquartered at the prestigious World Trade Centre in Pune, we have grown from a focused hardware services provider into a comprehensive IT solutions company serving corporations nationwide.</p>
              <p>Our journey has been driven by a relentless pursuit of technical excellence, customer satisfaction, and the belief that every business deserves world-class IT infrastructure. Today, we serve over 500 corporate clients across 28+ cities, providing everything from server installations and CCTV surveillance to annual maintenance contracts and complete network setups.</p>
              <p>What started as a hardware support company has evolved into a full-spectrum IT services enterprise — equipped with certified engineers, modern diagnostic tools, and a logistics network that ensures rapid on-site response anywhere in India.</p>
            </div>
            <div className="fade-in-right">
              <div className="about-card-main">
                <Image src="/assets/images/hero-bg.png" alt="WRHWFOUR Office — World Trade Centre, Pune" width={600} height={450} style={{ borderRadius: "var(--radius-lg)", width: "100%", aspectRatio: "4/3", objectFit: "cover" }} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="mission">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">What Drives Us</span>
            <h2 className="headline-md">Our Mission &amp; Vision</h2>
          </div>
          <div className="mission-vision-grid">
            <div className="mv-card fade-in">
              <div className="mv-icon"><span className="material-icons-outlined">flag</span></div>
              <h3>Our Mission</h3>
              <p>To deliver enterprise-grade IT infrastructure services that empower businesses to operate without technology disruptions. We aim to be the single trusted point of contact for all corporate IT needs — from procurement and installation to ongoing support and strategic technology planning.</p>
            </div>
            <div className="mv-card fade-in">
              <div className="mv-icon"><span className="material-icons-outlined">visibility</span></div>
              <h3>Our Vision</h3>
              <p>To become India&apos;s most trusted and responsive IT infrastructure partner, recognized for our engineering excellence, nationwide service reach, and unwavering commitment to client success. We envision a future where every business has access to reliable, secure, and scalable technology solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="values">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">Our Foundation</span>
            <h2 className="headline-md">Core Values That Guide Us</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: "verified", title: "Reliability", desc: "We deliver on every commitment. Our SLAs are not just documents — they are promises we keep." },
              { icon: "engineering", title: "Technical Excellence", desc: "Our engineers are continuously trained on the latest technologies to provide cutting-edge solutions." },
              { icon: "groups", title: "Client Partnership", desc: "We don't just serve clients — we partner with them to build long-term technology success." },
              { icon: "speed", title: "Rapid Response", desc: "Every minute of downtime costs money. We guarantee industry-leading response times." },
              { icon: "security", title: "Integrity", desc: "Transparent pricing, honest assessments, and ethical practices in every engagement." },
              { icon: "trending_up", title: "Innovation", desc: "We continuously evolve our service offerings to stay ahead of technology trends." },
            ].map(v => (
              <div className="value-card fade-in" key={v.title}>
                <div className="value-icon"><span className="material-icons-outlined">{v.icon}</span></div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="journey">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">Our Journey</span>
            <h2 className="headline-md">Key Milestones</h2>
          </div>
          <div className="timeline fade-in">
            {[
              { year: "2015", title: "Company Founded", desc: "WRHWFOUR Private Limited incorporated in Pune with a focus on computer hardware sales and repair services." },
              { year: "2017", title: "Expanded to Networking & CCTV", desc: "Added networking solutions and CCTV installation services, expanding the corporate service portfolio." },
              { year: "2019", title: "Pan-India Operations", desc: "Established field engineer network across 15+ cities, enabling nationwide on-site support capabilities." },
              { year: "2021", title: "World Trade Centre Office", desc: "Moved headquarters to World Trade Centre, Kharadi, Pune — reflecting our growth and corporate positioning." },
              { year: "2023", title: "500+ Corporate Clients", desc: "Crossed the 500-client milestone with presence in 28+ cities and comprehensive AMC services." },
              { year: "2025", title: "Next-Gen IT Solutions", desc: "Launched advanced server management, biometric systems, and AI-driven monitoring solutions for enterprise clients." },
            ].map(m => (
              <div className="timeline-item" key={m.year}>
                <div className="timeline-year">{m.year}</div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="team">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">Our People</span>
            <h2 className="headline-md">Leadership Team</h2>
            <p>The experienced professionals driving WRHWFOUR&apos;s mission to transform corporate IT across India.</p>
          </div>
          <div className="team-grid">
            {[
              { initials: "VP", name: "Vikram Patil", role: "Founder & CEO", desc: "Visionary leader with 15+ years in IT infrastructure, driving WRHWFOUR's strategic expansion across India." },
              { initials: "SA", name: "Sneha Agarwal", role: "Head of Operations", desc: "Operations expert ensuring seamless service delivery and client satisfaction across all engagements." },
              { initials: "RD", name: "Ravi Desai", role: "Chief Technology Officer", desc: "Technology architect with deep expertise in enterprise systems, networking, and security infrastructure." },
              { initials: "PS", name: "Priyanka Singh", role: "Head of Sales", desc: "Corporate sales leader building long-term partnerships with enterprises across India's major business hubs." },
            ].map(m => (
              <div className="team-card fade-in" key={m.name}>
                <div className="team-avatar">{m.initials}</div>
                <h4>{m.name}</h4>
                <div className="team-role">{m.role}</div>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="stats">
        <div className="container">
          <div className="section-header fade-in">
            <span className="label-md">By the Numbers</span>
            <h2 className="headline-md">WRHWFOUR at a Glance</h2>
          </div>
          <div className="stats-grid fade-in">
            {[
              { value: "500+", label: "Corporate Clients" },
              { value: "28+", label: "Cities Covered" },
              { value: "10+", label: "Years of Experience" },
              { value: "150+", label: "Active AMC Contracts" },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Partner with WRHWFOUR?</h2>
          <p>Let&apos;s discuss your IT infrastructure needs and build a solution that fits your business.</p>
          <div className="btn-group">
            <Link href="/contact" className="btn btn-primary btn-lg">
              <span className="material-icons-outlined btn-icon">headset_mic</span>
              Get in Touch
            </Link>
            <Link href="/services" className="btn btn-secondary btn-lg">View Our Services</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
