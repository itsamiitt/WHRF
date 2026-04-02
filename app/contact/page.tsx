import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "Contact Us | WRHWFOUR Private Limited — Get IT Support Today",
  description: "Contact WRHWFOUR Private Limited for IT infrastructure support, hardware services, and corporate IT solutions. Located at World Trade Centre, Pune.",
  alternates: { canonical: "https://wrhwfour.com/contact" },
};

export default function ContactPage() {
  return (
    <SiteShell variant="contact" includePageStyles={true}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <span className="current">Contact Us</span>
          </div>
          <h1>Get in Touch with<br />WRHWFOUR</h1>
          <p className="page-subtitle">Have an IT challenge? Need a quick repair or a comprehensive infrastructure setup? Reach out to our team and we&apos;ll respond within 2 business hours.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="contact-grid">
            <div className="fade-in-left">
              <span className="label-md">Contact Information</span>
              <h2 style={{ marginBottom: "var(--space-4)" }}>We&apos;re Here to Help</h2>
              <p style={{ marginBottom: "var(--space-8)", color: "var(--on-surface-variant)" }}>Whether it&apos;s a critical server issue or a new office setup, our team is ready to assist.</p>
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <div className="card-icon"><span className="material-icons-outlined">location_on</span></div>
                  <h4>Office Address</h4>
                  <p>8th Floor, World Trade Centre, Unit No.801, Dhole Patil Farms Road, EON Free Zone, Kharadi, Pune, Maharashtra 411014</p>
                </div>
                <div className="contact-info-card">
                  <div className="card-icon"><span className="material-icons-outlined">call</span></div>
                  <h4>Phone</h4>
                  <p><a href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a></p>
                  <p style={{ fontSize: "0.75rem", color: "var(--outline)", marginTop: "var(--space-1)" }}>Mon-Sat, 9 AM - 7 PM IST</p>
                </div>
                <div className="contact-info-card">
                  <div className="card-icon"><span className="material-icons-outlined">mail</span></div>
                  <h4>Email</h4>
                  <p><a href="mailto:contact@wrhwfour.com">contact@wrhwfour.com</a></p>
                  <p style={{ fontSize: "0.75rem", color: "var(--outline)", marginTop: "var(--space-1)" }}>Response within 2 business hours</p>
                </div>
                <div className="contact-info-card">
                  <div className="card-icon" style={{ color: "#25d366" }}><span className="material-icons-outlined">chat</span></div>
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener">Chat Now on WhatsApp</a></p>
                  <p style={{ fontSize: "0.75rem", color: "var(--outline)", marginTop: "var(--space-1)" }}>Instant response available</p>
                </div>
              </div>
              <h3 style={{ marginBottom: "var(--space-4)" }}>Find Us on the Map</h3>
              <div className="contact-map-large">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2547!2d73.9456!3d18.5537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c3c3c3c3c3c3%3A0x3c3c3c3c3c3c3c3c!2sWorld%20Trade%20Centre%2C%20Kharadi%2C%20Pune!5e0!3m2!1sen!2sin!4v1234567890" allowFullScreen loading="lazy" title="WRHWFOUR Office Location" />
              </div>
            </div>
            <div className="inquiry-form-wrapper fade-in-right">
              <h3>Send Us a Message</h3>
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
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" placeholder="Describe your requirements, number of devices, locations, timelines, etc." rows={5}></textarea>
                  </div>
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn btn-primary btn-lg" id="form-submit-btn">
                    <span className="material-icons-outlined btn-icon">send</span> Send Message
                  </button>
                </div>
                <div className="form-note">
                  <span className="material-icons-outlined note-icon" style={{ fontSize: "1rem" }}>lock</span>
                  Your information is secure. We&apos;ll respond within 2 business hours.
                </div>
              </form>
              <div className="form-success" id="form-success">
                <div className="success-icon"><span className="material-icons-outlined">check_circle</span></div>
                <h3>Message Sent Successfully!</h3>
                <p>Our team will get back to you within 2 business hours. Thank you for contacting WRHWFOUR.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
