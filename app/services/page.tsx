import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "IT Services | WRHWFOUR Private Limited — Comprehensive IT Solutions",
  description: "Explore WRHWFOUR's comprehensive IT services: CCTV installation, server management, networking solutions, biometric systems, computer repair, IT AMC, and hardware support across India.",
  alternates: { canonical: "https://wrhwfour.com/services" },
};

const services = [
  {
    id: "cctv", icon: "videocam", label: "Surveillance & Security",
    title: "CCTV Installation & Maintenance",
    desc: "Protect your business premises with advanced IP and analog surveillance systems. We design, install, and maintain CCTV networks that provide complete visibility and remote monitoring capabilities for offices, warehouses, and retail spaces.",
    features: ["HD & 4K IP Camera Systems", "Remote Monitoring via Mobile & Web", "NVR/DVR Setup & Cloud Storage", "Night Vision & Thermal Cameras", "Annual Maintenance & Support"],
    stats: [{ value: "1000+", label: "Cameras Installed" }, { value: "24/7", label: "Monitoring Support" }],
    href: "/services/cctv-installation",
  },
  {
    id: "computer", icon: "computer", label: "Hardware Solutions",
    title: "Computer / CPU Sales & Repair",
    desc: "Whether you need to procure new workstations for your team or repair existing hardware, our certified technicians handle everything from component-level diagnostics to enterprise-grade procurement from top OEM brands.",
    features: ["Desktop & Laptop Procurement", "Component-Level Repair & Diagnostics", "Warranty Management & Claims", "OS Installation & Data Recovery", "Bulk Corporate Orders"],
    stats: [{ value: "5000+", label: "Devices Serviced" }, { value: "4hr", label: "Avg Response Time" }],
    href: "/services/computer-sales-repair",
  },
  {
    id: "server", icon: "dns", label: "Enterprise Infrastructure",
    title: "Server Installation & Maintenance",
    desc: "Deploy and maintain enterprise-grade server infrastructure with our expert team. From rack servers to virtualization, we ensure maximum uptime, data protection, and scalable architecture for your business-critical applications.",
    features: ["Rack & Blade Server Installation", "Virtualization (VMware, Hyper-V)", "24/7 Uptime Monitoring", "Backup & Disaster Recovery", "Server Room Design & Setup"],
    stats: [{ value: "99.9%", label: "Uptime Guarantee" }, { value: "200+", label: "Servers Managed" }],
    href: "/services/server-installation",
  },
  {
    id: "biometric", icon: "fingerprint", label: "Access & Attendance",
    title: "Biometric Attendance Machines",
    desc: "Modernize your workforce management with precision biometric systems. Our solutions include fingerprint scanners, facial recognition, and RFID-based attendance systems with cloud reporting and multi-branch integration.",
    features: ["Fingerprint & Face Recognition", "RFID Card-Based Access Control", "Cloud-Based Attendance Reporting", "Multi-Branch Synchronization", "Integration with HR/Payroll Systems"],
    stats: [{ value: "300+", label: "Devices Deployed" }, { value: "50K+", label: "Users Managed" }],
    href: "/services/biometric-attendance",
  },
  {
    id: "amc", icon: "handshake", label: "Maintenance Contracts",
    title: "Corporate IT AMC",
    desc: "Reduce unexpected IT costs with our comprehensive Annual Maintenance Contracts. We provide predictable budgeting, guaranteed SLAs, periodic health checks, and priority support for all your IT assets.",
    features: ["All-Inclusive Hardware AMC", "Defined SLA & Escalation Matrix", "Quarterly Health Audits", "Priority Emergency Support", "Asset Lifecycle Management"],
    stats: [{ value: "150+", label: "Active Contracts" }, { value: "30%", label: "Cost Savings" }],
    href: "/services/corporate-it-amc",
  },
  {
    id: "networking", icon: "hub", label: "Connectivity Solutions",
    title: "Networking Solutions",
    desc: "Build a robust, secure, and high-performance network infrastructure with our expert team. From LAN/WAN design to firewall configuration, we ensure seamless connectivity across your entire organization.",
    features: ["LAN/WAN Design & Implementation", "Structured Cabling & Fiber Optics", "Firewall & VPN Configuration", "Wi-Fi Planning & Optimization", "Network Security & Monitoring"],
    stats: [{ value: "500+", label: "Networks Deployed" }, { value: "10Gbps", label: "Max Throughput" }],
    href: "/services/networking-solutions",
  },
  {
    id: "hardware", icon: "build", label: "On-Demand Support",
    title: "Hardware Support for Companies",
    desc: "On-demand IT hardware support for all your office technology needs. From printers and projectors to UPS systems and network peripherals, our technicians ensure your equipment operates at peak efficiency.",
    features: ["Printer & MFD Support", "UPS & Power Systems Maintenance", "Projector & AV Equipment Support", "Peripheral Device Troubleshooting", "On-Site & Remote Hardware Support"],
    stats: [{ value: "10K+", label: "Support Tickets" }, { value: "4hr", label: "On-Site Response" }],
    href: "/services/hardware-support",
  },
];

export default function ServicesPage() {
  return (
    <SiteShell variant="services">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">›</span>
            <span className="current">Services</span>
          </div>
          <h1>Enterprise IT Services &<br />Solutions</h1>
          <p className="page-subtitle">From CCTV surveillance and server management to networking and annual maintenance — we deliver end-to-end IT infrastructure services tailored for corporate India.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="services-list">
            {services.map(s => (
              <div className="service-detail fade-in" id={s.id} key={s.id}>
                <div className="service-detail-content">
                  <span className="label-md">{s.label}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul className="service-features-list">
                    {s.features.map(f => (
                      <li key={f}><span className="material-icons-outlined">check_circle</span> {f}</li>
                    ))}
                  </ul>
                  <Link href={s.href} className="btn btn-outline">Learn More <span className="material-icons-outlined btn-icon">arrow_forward</span></Link>
                </div>
                <div className="service-detail-visual">
                  <div className="detail-icon"><span className="material-icons-outlined">{s.icon}</span></div>
                  <div className="detail-stats">
                    {s.stats.map(st => (
                      <div className="detail-stat" key={st.label}>
                        <div className="stat-value">{st.value}</div>
                        <div className="stat-desc">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Need a Custom IT Solution?</h2>
          <p>Contact us for a free consultation and tailored quote for your business requirements.</p>
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
