"use client";

import Link from "next/link";
import Image from "next/image";

type NavbarVariant = "home" | "about" | "services" | "contact" | "other";

interface SiteNavbarProps {
  active?: NavbarVariant;
  scrolled?: boolean;
}

const WA_LINK = "https://wa.me/91XXXXXXXXXX";

export function SiteNavbar({ active = "other", scrolled = true }: SiteNavbarProps) {
  const linkColor = (page: NavbarVariant) =>
    active === page ? "var(--primary)" : "var(--on-surface-variant)";

  return (
    <nav className={`navbar navbar--solid${scrolled ? " scrolled" : ""}`} id="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link href="/" className="nav-logo" aria-label="WRHWFOUR Home">
          <Image src="/assets/WRHW_logo.png" alt="WRHWFOUR Logo" width={160} height={48} priority />
        </Link>
        <div className="nav-links" id="nav-links">
          <Link href="/about" style={{ color: linkColor("about") }}>About</Link>
          <Link href="/services" style={{ color: linkColor("services") }}>Services</Link>
          <Link href="/#why-us" style={{ color: "var(--on-surface-variant)" }}>Why Us</Link>
          <Link href="/contact" style={{ color: linkColor("contact") }}>Contact</Link>
          <Link href="/contact" className="nav-cta">Get a Quote</Link>
        </div>
        <button className="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span style={{ background: "var(--on-surface)" }}></span>
          <span style={{ background: "var(--on-surface)" }}></span>
          <span style={{ background: "var(--on-surface)" }}></span>
        </button>
      </div>
    </nav>
  );
}

export function HomeNavbar() {
  return (
    <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <a href="#hero" className="nav-logo" aria-label="WRHWFOUR Home">
          <Image src="/assets/WRHW_logo_blue.png" alt="WRHWFOUR Logo" width={160} height={48} className="logo-dark" priority />
          <Image src="/assets/WRHW_logo.png" alt="WRHWFOUR Logo" width={160} height={48} className="logo-light" priority />
        </a>
        <div className="nav-links" id="nav-links">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <a href="#why-us">Why Us</a>
          <a href="#coverage">Coverage</a>
          <a href="#testimonials">Clients</a>
          <Link href="/contact" className="nav-cta">Get a Quote</Link>
        </div>
        <button className="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
