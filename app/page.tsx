import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "WRHWFOUR Private Limited | Pan-India IT Sales, Support & Infrastructure Services",
  description: "WRHWFOUR Private Limited is a trusted Pan-India IT Sales & Services partner offering computer hardware support, CCTV installation, server maintenance, networking, biometric solutions, and Corporate IT AMC for businesses.",
  keywords: ["IT services India", "computer hardware service", "CCTV installation", "server maintenance", "biometric attendance", "networking solutions", "IT AMC", "IT support Pune", "corporate IT services"],
  alternates: { canonical: "https://wrhwfour.com/" },
};

export default function HomePage() {
  return (
    <>
      <SiteShell variant="home">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WhyUsSection />
        <CoverageSection />
        <TestimonialsSection />
        <InquirySection />
      </SiteShell>
      <Script src="/assets/site-config.js" strategy="afterInteractive" />
    </>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            <span>Trusted IT Partner — Serving Pan India</span>
          </div>
          <h1 className="display-lg">
            Pan-India IT Sales, Support &<br />
            <span className="accent">Infrastructure Services</span><br />
            for Businesses
          </h1>
          <p className="hero-subtitle">
            Expert corporate IT solutions, hardware maintenance, and end-to-end infrastructure support for growing companies nationwide. We build the backbone of your digital business.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary btn-lg" id="hero-cta-primary">
              <span className="material-icons-outlined btn-icon">headset_mic</span>
              Get a Free Consultation
            </a>
            <a href="https://wa.me/91XXXXXXXXXX?text=Hi%20WRHWFOUR%2C%20I%20need%20IT%20support" target="_blank" rel="noopener" className="btn btn-secondary btn-lg" id="hero-cta-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Talk on WhatsApp
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number counter-animate" data-count="500" data-suffix="+">0</div>
              <div className="stat-label">Clients Served</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number counter-animate" data-count="28" data-suffix="+">0</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number counter-animate" data-count="98" data-suffix="%">0</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="card-header">
              <div className="card-icon">
                <span className="material-icons-outlined">dns</span>
              </div>
              <div>
                <div className="card-title">Enterprise IT Services</div>
                <div className="card-subtitle">Comprehensive Solutions</div>
              </div>
            </div>
            <div className="hero-service-list">
              {["Server Installation & Maintenance", "CCTV & Surveillance Systems", "Corporate Hardware Support", "Networking & Firewall Setup", "Annual Maintenance Contracts"].map(s => (
                <div className="hero-service-item" key={s}>
                  <div className="service-check">✓</div>
                  <span className="service-text">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-content fade-in-left">
          <span className="label-md">About WRHWFOUR</span>
          <h2 className="headline-md">Your Partner in Professional<br />IT Infrastructure</h2>
          <p>WRHWFOUR Private Limited is a leading IT Sales &amp; Services and Computer Hardware Service Provider based out of Pune, India. With a steadfast commitment to reliability and technical excellence, we deliver comprehensive IT infrastructure solutions to corporate clients across the nation.</p>
          <p>From hardware procurement and server installations to CCTV surveillance and annual maintenance contracts, our certified engineers ensure that your business technology runs smoothly—anytime, anywhere in India.</p>
          <div className="about-highlights">
            {[
              { icon: "verified", text: "Certified IT Professionals" },
              { icon: "speed", text: "Fast Response Times" },
              { icon: "support_agent", text: "Dedicated Account Managers" },
              { icon: "public", text: "Pan-India Service Network" },
            ].map(h => (
              <div className="about-highlight" key={h.text}>
                <div className="highlight-icon"><span className="material-icons-outlined">{h.icon}</span></div>
                <span className="highlight-text">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual fade-in-right">
          <div className="about-card-main">
            <Image src="/assets/images/hero-bg.png" alt="WRHWFOUR IT Infrastructure Services - Server Room" width={600} height={400} loading="lazy" />
          </div>
          <div className="about-float-card">
            <div className="float-number counter-animate" data-count="10" data-suffix="+">0</div>
            <div className="float-text">Years of<br />IT Expertise</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { id: "cctv", icon: "videocam", title: "CCTV Installation & Maintenance", desc: "Advanced IP and Analog surveillance systems with remote monitoring capabilities, night vision cameras, and centralized video management.", href: "/services/cctv-installation" },
    { id: "cpu", icon: "computer", title: "Computer / CPU Sales & Repair", desc: "Workstation procurement from top brands and component-level repair services for desktops, laptops, and enterprise computing hardware.", href: "/services/computer-sales-repair" },
    { id: "server", icon: "dns", title: "Server Installation & Maintenance", desc: "Scalable rack and blade server solutions tailored for enterprise workloads with 24/7 uptime monitoring, backup systems, and disaster recovery.", href: "/services/server-installation" },
    { id: "biometric", icon: "fingerprint", title: "Biometric Attendance Machines", desc: "Precision fingerprint, facial recognition, and RFID attendance systems with cloud-based reporting for secure corporate environments.", href: "/services/biometric-attendance" },
    { id: "amc", icon: "handshake", title: "Corporate IT AMC", desc: "Annual Maintenance Contracts designed for zero downtime and predictable IT budgeting with clearly defined SLA, escalation paths, and periodic health checks.", href: "/services/corporate-it-amc" },
    { id: "networking", icon: "hub", title: "Networking Solutions", desc: "Complete LAN/WAN design and setup, fiber optics cabling, robust firewall implementations, VPN configuration, and wireless network optimization.", href: "/services/networking-solutions" },
    { id: "hardware", icon: "build", title: "Hardware Support for Companies", desc: "On-demand technical support for all peripheral and core IT infrastructure including printers, UPS systems, projectors, and office electronics.", href: "/services/hardware-support" },
  ];
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="section-header fade-in">
          <span className="label-md">Enterprise Grade Services</span>
          <h2 className="headline-md">Comprehensive IT Solutions for<br />Modern Businesses</h2>
          <p>From installation to maintenance, we cover every aspect of your corporate IT infrastructure with precision and reliability.</p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <div className="service-card fade-in" id={`service-${s.id}`} key={s.id}>
              <div className="service-icon"><span className="material-icons-outlined">{s.icon}</span></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <Link href={s.href} className="service-link">Learn More <span className="material-icons-outlined">arrow_forward</span></Link>
            </div>
          ))}
        </div>
        <div className="hero-actions fade-in" style={{ justifyContent: "center", marginTop: "var(--space-10)" }}>
          <Link href="/services" className="btn btn-secondary btn-lg">
            <span className="material-icons-outlined btn-icon">grid_view</span>
            View All Services
          </Link>
          <Link href="/contact" className="btn btn-primary btn-lg">
            <span className="material-icons-outlined btn-icon">headset_mic</span>
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const reasons = [
    { icon: "public", title: "Pan-India Service Support", desc: "Reliable logistics and on-site support across every major Indian city, ensuring your infrastructure is maintained wherever you operate." },
    { icon: "bolt", title: "Fast Response & Expert Technicians", desc: "Guaranteed on-site attendance within 4 hours for critical server failures, with highly certified engineers ready to solve complex issues." },
    { icon: "business", title: "Corporate-Focused IT Solutions", desc: "Solutions designed specifically for the rigorous demands of business environments, from startups to multinational corporations." },
    { icon: "settings_suggest", title: "End-to-End Installation & Maintenance", desc: "From initial consultation and procurement to deployment and ongoing support—we handle the complete IT lifecycle." },
    { icon: "assignment_turned_in", title: "Reliable Annual Maintenance Contracts", desc: "Transparent contracts with clearly defined SLAs and escalation paths, ensuring predictable IT budgets and zero downtime." },
    { icon: "security", title: "Modern, Secure & Scalable Tech", desc: "Integration of the latest monitoring, security protocols, and scalable solutions that grow with your business needs." },
  ];
  return (
    <section className="why-us section" id="why-us">
      <div className="container">
        <div className="section-header fade-in">
          <span className="label-md">The WRHWFOUR Advantage</span>
          <h2 className="headline-md">Why Businesses Choose Us as<br />Their IT Partner</h2>
          <p>We don&apos;t just fix hardware; we build resilient business ecosystems through elite engineering and strategic IT planning.</p>
        </div>
        <div className="why-grid">
          {reasons.map(r => (
            <div className="why-card fade-in" key={r.title}>
              <div className="why-icon"><span className="material-icons-outlined">{r.icon}</span></div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  return (
    <section className="coverage section" id="coverage">
      <div className="container">
        <div className="coverage-content fade-in-left">
          <span className="label-md">Nationwide Presence</span>
          <h2 className="headline-md">Serving Businesses Across India</h2>
          <p>With our strategic headquarters in Pune and a network of certified field engineers nationwide, we provide seamless IT support to multinational corporations and growing startups alike. Our centralized coordination ensures consistent service quality.</p>
          <div className="coverage-features">
            {[
              "24/7 Remote Desktop & Server Support",
              "Pan-India Hardware Logistics & Deployment",
              "Localized On-Site Emergency Response Teams",
              "Multi-City Office IT Setup & Migration",
              "Centralized IT Asset Management & Reporting",
            ].map(f => (
              <div className="coverage-feature" key={f}>
                <div className="feature-check">✓</div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="coverage-map fade-in-right">
          <Image src="/assets/images/india-map.png" alt="WRHWFOUR Service Coverage Map - Serving Businesses Across India" width={600} height={600} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { initials: "RK", name: "Rajesh Kumar", role: "IT Director, Manufacturing Corp", text: "WRHWFOUR transformed our office networking infrastructure. Their response time during a critical server crisis was exceptional. They had our systems back online within hours." },
    { initials: "PS", name: "Priya Sharma", role: "Operations Head, FinTech Solutions", text: "The AMC plan they provided saved us nearly 30% on yearly maintenance costs while drastically improving device longevity. Truly a strategic IT partner." },
    { initials: "AM", name: "Amit Mehta", role: "CTO, Logistics Group", text: "From biometric setup across 5 branches to complex enterprise firewall configurations, their team is knowledgeable, professional, and always available when needed." },
  ];
  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <div className="section-header fade-in">
          <span className="label-md">Trusted by Industry Leaders</span>
          <h2 className="headline-md">What Our Clients Say About Us</h2>
          <p>We pride ourselves on delivering results that speak for themselves. Here&apos;s what our corporate clients have to say.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card fade-in" key={t.name}>
              <div className="testimonial-quote">&ldquo;</div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => <span className="star" key={i}>★</span>)}
              </div>
              <p>{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div className="testimonial-info">
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="client-logos fade-in">
          <p>Trusted by leading organizations</p>
          <div className="logo-strip">
            {["TATA", "WIPRO", "INFOSYS", "HCL", "BAJAJ", "L&T"].map(c => (
              <span className="client-logo" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InquirySection() {
  return (
    <section className="inquiry section" id="contact">
      <div className="container">
        <div className="inquiry-content fade-in-left">
          <span className="label-md">Let&apos;s Connect</span>
          <h2 className="headline-md">Request a Quick<br />IT Consultation</h2>
          <p>Fill in the details and our solution architect will contact you within 2 business hours. Whether you need a quick repair or a comprehensive IT setup, we&apos;re here to help.</p>
          <div className="inquiry-benefits">
            {[
              { icon: "schedule", title: "Quick Turnaround", desc: "Response within 2 business hours for all inquiries" },
              { icon: "calculate", title: "Free Site Survey & Quotation", desc: "No-obligation assessment and transparent pricing" },
              { icon: "support", title: "Dedicated Support", desc: "Assigned account manager for your business" },
            ].map(b => (
              <div className="inquiry-benefit" key={b.title}>
                <div className="benefit-icon"><span className="material-icons-outlined">{b.icon}</span></div>
                <div className="benefit-text">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="inquiry-form-wrapper fade-in-right">
          <h3>Tell Us About Your Requirements</h3>
          <form id="inquiry-form" noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input type="text" id="company" name="company" placeholder="Company name" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" placeholder="you@company.com" required />
              </div>
              <div className="form-group full-width">
                <label htmlFor="service">Service Needed</label>
                <select id="service" name="service">
                  <option value="" disabled>Select a service</option>
                  <option value="cctv">CCTV Installation &amp; Maintenance</option>
                  <option value="computer">Computer / CPU Sales &amp; Repair</option>
                  <option value="server">Server Installation &amp; Maintenance</option>
                  <option value="biometric">Biometric Attendance Machines</option>
                  <option value="amc">Corporate IT AMC</option>
                  <option value="networking">Networking Solutions</option>
                  <option value="hardware">Hardware Support</option>
                  <option value="other">Other / Multiple Services</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">Message (Optional)</label>
                <textarea id="message" name="message" placeholder="Describe your requirements, number of devices, locations, etc." rows={4}></textarea>
              </div>
            </div>
            <div className="form-submit">
              <button type="submit" className="btn btn-primary btn-lg" id="form-submit-btn">
                <span className="material-icons-outlined btn-icon">send</span>
                Request a Quick IT Consultation
              </button>
            </div>
            <div className="form-note">
              <span className="material-icons-outlined note-icon" style={{ fontSize: "1rem" }}>lock</span>
              Your information is secure. Our team will get back to you shortly.
            </div>
          </form>
          <div className="form-success" id="form-success">
            <div className="success-icon"><span className="material-icons-outlined">check_circle</span></div>
            <h3>Thank You for Reaching Out!</h3>
            <p>Our solution architect will contact you within 2 business hours. We look forward to partnering with you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
