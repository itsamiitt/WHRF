export type ServiceData = {
  slug: string;
  title: string;
  pageTitle: string;
  description: string;
  label: string;
  icon: string;
  heroSubtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  overviewTitle: string;
  overview: string[];
  featuresTitle: string;
  features: string[];
  processTitle: string;
  processSubtitle: string;
  process: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
};

export const servicesData: ServiceData[] = [
  {
    slug: "cctv-installation",
    title: "CCTV Installation & Maintenance Services | WRHWFOUR Private Limited",
    pageTitle: "CCTV Installation &\nMaintenance Services",
    description: "Professional CCTV installation and maintenance services by WRHWFOUR. IP cameras, NVR setup, remote monitoring, and 24/7 surveillance support across India.",
    label: "Surveillance & Security",
    icon: "videocam",
    heroSubtitle: "Advanced IP and analog surveillance systems with remote monitoring capabilities for offices, warehouses, and corporate premises across India.",
    stat1Value: "1000+", stat1Label: "Cameras Installed",
    stat2Value: "24/7", stat2Label: "Monitoring Support",
    overviewTitle: "CCTV Installation & Maintenance",
    overview: [
      "Protect your business premises with state-of-the-art CCTV surveillance systems. WRHWFOUR designs, installs, and maintains comprehensive video security networks that provide complete visibility and remote monitoring capabilities. Whether you need indoor monitoring for your office or outdoor surveillance for a manufacturing facility, our certified technicians deliver reliable solutions tailored to your security requirements.",
      "We work with leading camera brands including Hikvision, Dahua, CP Plus, and Bosch to offer HD, 4K, and AI-powered cameras. Our solutions include NVR/DVR recording, cloud storage integration, mobile app monitoring, and analytics-driven security alerts.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "HD, Full HD, and 4K IP Camera Systems",
      "NVR/DVR Setup with Cloud Backup",
      "Remote Monitoring via Mobile & Web Apps",
      "Night Vision and Thermal Cameras",
      "AI-Powered Motion Detection & Alerts",
      "Multi-Site Centralized Video Management",
      "Annual Maintenance & Priority Support",
    ],
    processTitle: "Our Process",
    processSubtitle: "A structured, transparent approach to delivering quality CCTV solutions.",
    process: [
      { title: "Site Assessment", desc: "Our security experts visit your premises to evaluate coverage requirements, camera positioning, and infrastructure needs." },
      { title: "Solution Design", desc: "We design a customized CCTV layout with optimal camera placement, recording capacity, and network architecture." },
      { title: "Installation", desc: "Professional installation of cameras, NVR/DVR, cabling, and power systems with minimal disruption to operations." },
      { title: "Configuration & Testing", desc: "Complete system configuration, remote access setup, mobile app installation, and thorough testing of all components." },
    ],
    faqs: [
      { q: "What types of CCTV cameras do you install?", a: "We install dome cameras, bullet cameras, PTZ cameras, fisheye cameras, and thermal cameras from brands like Hikvision, Dahua, CP Plus, and Bosch in HD, Full HD, and 4K resolutions." },
      { q: "Can I monitor my CCTV remotely?", a: "Yes, all our CCTV solutions include remote monitoring via mobile apps and web interfaces. You can view live feeds, playback recordings, and receive alerts from anywhere in the world." },
      { q: "Do you provide AMC for CCTV systems?", a: "Yes, we offer comprehensive Annual Maintenance Contracts that include periodic inspections, camera cleaning, firmware updates, DVR/NVR health checks, and priority breakdown support." },
    ],
    ctaTitle: "Ready to Secure Your Business?",
    ctaDesc: "Contact us today for a free site survey and customized CCTV quotation.",
  },
  {
    slug: "computer-sales-repair",
    title: "Computer & CPU Sales & Repair | WRHWFOUR Private Limited",
    pageTitle: "Computer & CPU\nSales & Repair",
    description: "Corporate computer and CPU sales and repair by WRHWFOUR. Desktop procurement, laptop repair, data recovery, and bulk hardware for businesses across India.",
    label: "Hardware Solutions",
    icon: "computer",
    heroSubtitle: "From workstation procurement to component-level repair, we provide comprehensive computing solutions for corporate environments across India.",
    stat1Value: "5000+", stat1Label: "Devices Serviced",
    stat2Value: "24-48h", stat2Label: "Repair Turnaround",
    overviewTitle: "Computer / CPU Sales & Repair",
    overview: [
      "Whether you need to procure new workstations, laptops, or servers, or repair existing hardware at the component level, WRHWFOUR's certified technicians handle the complete spectrum of computing hardware needs for corporate clients. We are authorized resellers for top OEM brands including Dell, HP, Lenovo, Acer, and ASUS.",
      "Our repair services cover everything from motherboard-level diagnostics and RAM/SSD upgrades to complete system rebuilds and data recovery. We offer competitive pricing on bulk corporate procurement with dedicated account management and priority warranty support.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "Desktop & Laptop Procurement (Dell, HP, Lenovo, Acer, ASUS)",
      "Component-Level Repair & Diagnostics",
      "Warranty Management & OEM Claims",
      "OS Installation, Imaging & Data Recovery",
      "Bulk Corporate Orders with Volume Pricing",
      "Preventive Maintenance Programs",
      "Asset Tagging & IT Inventory Management",
    ],
    processTitle: "Our Process",
    processSubtitle: "Fast, reliable support from procurement to repair — keeping your team productive.",
    process: [
      { title: "Assessment", desc: "We evaluate your hardware requirements or diagnose the problem, providing a detailed assessment report and transparent cost estimate before any work begins." },
      { title: "Procurement / Repair", desc: "For new hardware, we source from authorized OEM channels with best-price guarantees. For repairs, certified technicians perform component-level work with quality parts." },
      { title: "Quality Check", desc: "All repaired or newly configured hardware goes through a comprehensive testing protocol covering performance, stability, and functionality benchmarks." },
      { title: "Delivery & Support", desc: "Hardware delivered, configured, and deployed at your location with full documentation, driver packages, and 30-day post-service support." },
    ],
    faqs: [
      { q: "Do you offer bulk corporate procurement?", a: "Yes, we handle bulk procurement for organizations of all sizes. We offer volume pricing, consolidated billing, standardized configurations, and dedicated delivery timelines for corporate orders." },
      { q: "What brands do you repair?", a: "We repair all major brands including Dell, HP, Lenovo, Acer, ASUS, Apple, and more. Our technicians are trained in component-level diagnostics for both laptops and desktop systems." },
      { q: "What is your repair turnaround time?", a: "Standard repairs are completed within 24–48 hours. Complex motherboard-level repairs or data recovery may take 3–5 business days. Priority repair services are available for critical business systems." },
    ],
    ctaTitle: "Need Hardware for Your Business?",
    ctaDesc: "Get in touch for a customized hardware procurement plan or to schedule a repair.",
  },
  {
    slug: "server-installation",
    title: "Server Installation & Maintenance | WRHWFOUR Private Limited",
    pageTitle: "Server Installation &\nMaintenance Services",
    description: "Enterprise server installation and maintenance by WRHWFOUR. Rack servers, virtualization, 24/7 uptime monitoring, and disaster recovery solutions across India.",
    label: "Enterprise Infrastructure",
    icon: "dns",
    heroSubtitle: "Deploy and maintain enterprise-grade server infrastructure. From rack installation to virtualization and 24/7 monitoring — maximizing uptime for your critical systems.",
    stat1Value: "99.9%", stat1Label: "Uptime Guarantee",
    stat2Value: "200+", stat2Label: "Servers Managed",
    overviewTitle: "Server Installation & Maintenance",
    overview: [
      "WRHWFOUR deploys and maintains enterprise-grade server infrastructure for businesses of all sizes. From initial rack setup and OS installation to advanced virtualization configurations and 24/7 remote monitoring, our certified server engineers ensure your critical business systems maintain maximum uptime and peak performance.",
      "We are experienced with leading server platforms including Dell PowerEdge, HP ProLiant, Lenovo ThinkSystem, and IBM. Our expertise spans physical servers, virtualization (VMware vSphere, Microsoft Hyper-V), storage area networks (SAN/NAS), and complete server room design with power and cooling planning.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "Rack & Blade Server Installation and Configuration",
      "Virtualization Setup (VMware vSphere, Microsoft Hyper-V)",
      "24/7 Remote Uptime Monitoring and Alerting",
      "Backup Solutions and Disaster Recovery Planning",
      "Server Room Design, Power & Cooling Optimization",
      "SAN/NAS Storage Installation and Management",
      "Windows Server & Linux Administration",
    ],
    processTitle: "Our Process",
    processSubtitle: "Systematic server deployment for maximum reliability and performance.",
    process: [
      { title: "Infrastructure Planning", desc: "Assess your compute, storage, and networking requirements. Design an optimal server architecture scaled for your current and future workloads." },
      { title: "Procurement & Setup", desc: "Source servers from authorized OEM partners. Rack mounting, cable management, power distribution, and initial BIOS/firmware configuration performed to best practices." },
      { title: "OS & Application Install", desc: "Install and configure the operating system, virtualization layer, monitoring agents, backup software, and required business applications." },
      { title: "Testing & Handover", desc: "Comprehensive performance testing, redundancy verification, failover testing, and complete documentation handover with ongoing monitoring enabled." },
    ],
    faqs: [
      { q: "Which server brands do you support?", a: "We support Dell PowerEdge, HP ProLiant, Lenovo ThinkSystem, IBM, Supermicro, and other enterprise server brands. Our engineers are certified by multiple OEM vendors." },
      { q: "Do you provide 24/7 server monitoring?", a: "Yes, all our server managed service plans include 24/7 remote monitoring with automated alerts, proactive issue resolution, and monthly performance reports to ensure maximum uptime." },
      { q: "Can you help with server virtualization?", a: "Absolutely. We specialize in VMware vSphere and Microsoft Hyper-V deployments, including VM migration, high availability clustering, vSAN setup, and ongoing virtual infrastructure management." },
    ],
    ctaTitle: "Ready to Build Reliable Server Infrastructure?",
    ctaDesc: "Get a free consultation and server deployment plan tailored to your business needs.",
  },
  {
    slug: "biometric-attendance",
    title: "Biometric Attendance Systems | WRHWFOUR Private Limited",
    pageTitle: "Biometric Attendance &\nAccess Control",
    description: "Biometric attendance machine installation and integration by WRHWFOUR. Fingerprint, face recognition, RFID systems with cloud reporting for corporate India.",
    label: "Access & Attendance",
    icon: "fingerprint",
    heroSubtitle: "Modernize workforce management with precision fingerprint, facial recognition, and RFID-based attendance systems with cloud reporting and multi-branch integration.",
    stat1Value: "300+", stat1Label: "Devices Deployed",
    stat2Value: "50K+", stat2Label: "Users Managed",
    overviewTitle: "Biometric Attendance Machines",
    overview: [
      "Streamline your workforce management with WRHWFOUR's biometric attendance solutions. We deploy fingerprint scanners, facial recognition systems, and RFID-based access control devices that integrate seamlessly with your HR and payroll systems. Our cloud-based reporting provides real-time attendance data across all your office locations.",
      "Whether you need a single device for a small office or a multi-branch attendance network spanning dozens of locations, we handle everything from device procurement and installation to software configuration and ongoing support. Our solutions comply with labor regulations and provide tamper-proof attendance records.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "Fingerprint and Face Recognition Scanners",
      "RFID Card-Based Access Control",
      "Cloud-Based Attendance Reporting Dashboard",
      "Multi-Branch Real-Time Synchronization",
      "HR and Payroll System Integration (SAP, Zoho, greytHR)",
      "Visitor Management Systems",
      "Anti-Spoofing and Tamper Detection Technology",
    ],
    processTitle: "Our Process",
    processSubtitle: "A structured approach to deploying biometric attendance across your organization.",
    process: [
      { title: "Needs Assessment", desc: "Evaluate your workforce size, entry points, shift patterns, and existing HR systems to determine the ideal biometric solution architecture." },
      { title: "Device Procurement", desc: "Source and configure biometric devices from leading manufacturers with the right capacity, connectivity, and feature set for your environment." },
      { title: "Installation & Integration", desc: "Install devices at all entry points, configure network connectivity, set up cloud reporting, and integrate with your HR/payroll software." },
      { title: "Training & Support", desc: "Train your HR team on the management portal, enroll employees, and provide ongoing technical support and device maintenance." },
    ],
    faqs: [
      { q: "Which biometric brands do you supply and install?", a: "We work with leading brands including ZKTeco, Essl/eSSL, Realtime, Suprema, Honeywell, and Hikvision. Device selection is based on your specific requirements for capacity, connectivity, and feature set." },
      { q: "Can the system integrate with our existing HR software?", a: "Yes. Our solutions can integrate with popular HR and payroll platforms including SAP SuccessFactors, Zoho People, greytHR, Keka, Darwinbox, and custom attendance management systems via API." },
      { q: "What happens if a device malfunctions?", a: "We provide quick replacement units under AMC contracts to minimize disruption. Remote diagnostics can often resolve issues without an on-site visit. On-site support is available within 4 hours for critical failures." },
    ],
    ctaTitle: "Ready to Modernize Attendance Management?",
    ctaDesc: "Contact us for a free consultation and biometric solution tailored to your workforce.",
  },
  {
    slug: "corporate-it-amc",
    title: "Corporate IT AMC | WRHWFOUR Private Limited",
    pageTitle: "Corporate IT Annual\nMaintenance Contracts",
    description: "Corporate IT AMC by WRHWFOUR. Comprehensive annual maintenance contracts with defined SLAs, quarterly audits, and priority support for all your IT assets.",
    label: "Maintenance Contracts",
    icon: "handshake",
    heroSubtitle: "Reduce unexpected IT costs with comprehensive AMC plans. Predictable budgeting, guaranteed SLAs, priority support, and quarterly preventive audits for all your IT assets.",
    stat1Value: "150+", stat1Label: "Active Contracts",
    stat2Value: "30%", stat2Label: "Avg Cost Savings",
    overviewTitle: "Corporate IT AMC",
    overview: [
      "WRHWFOUR's Annual Maintenance Contracts are designed for businesses that want predictable IT costs, guaranteed response times, and complete peace of mind. Our AMC plans cover all hardware categories — from servers and networking equipment to desktops, printers, and CCTV systems — under a single, transparent contract with no hidden charges.",
      "Each AMC is customized to your infrastructure size and criticality levels. We provide quarterly preventive maintenance audits, 24/7 helpdesk access, priority on-site support, and comprehensive asset lifecycle reporting. Our clients typically save 25–35% on IT maintenance costs compared to break-fix arrangements while enjoying significantly better uptime.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "All-Inclusive Hardware Coverage (Servers, PCs, Printers, Network, CCTV, UPS)",
      "Defined SLA with Clear Escalation Matrix",
      "Quarterly Preventive Maintenance Audits",
      "24/7 Helpdesk Access via Phone, Email & Ticket",
      "Priority On-Site Emergency Support",
      "Comprehensive IT Asset Lifecycle Reporting",
      "Spare Parts Management and Replacement",
    ],
    processTitle: "Our Process",
    processSubtitle: "A seamless onboarding and ongoing service delivery process for your AMC.",
    process: [
      { title: "IT Asset Audit", desc: "Complete audit of all your IT assets including hardware specs, age, warranty status, and current support coverage to create an accurate AMC scope." },
      { title: "Contract Customization", desc: "Design a customized AMC based on your asset list, coverage requirements, response time expectations, and budget. Transparent, all-inclusive pricing." },
      { title: "Onboarding", desc: "Asset tagging, helpdesk account setup, technician briefings, emergency contact assignment, and scheduling of first preventive maintenance visit." },
      { title: "Ongoing Support", desc: "Regular preventive maintenance, 24/7 helpdesk, on-site emergency response per SLA, quarterly reports, and annual AMC review and renewal." },
    ],
    faqs: [
      { q: "What assets are covered under the AMC?", a: "Our AMC covers all IT hardware including servers, desktop PCs, laptops, printers, scanners, networking equipment (switches, routers, firewalls), UPS systems, CCTV, and biometric devices. Custom coverage can be scoped based on your requirements." },
      { q: "What SLAs do you offer?", a: "We offer multiple SLA tiers: Standard (8-hour on-site response), Business (4-hour), and Premium (2-hour). Remote helpdesk support is available within 1 hour across all tiers during business hours." },
      { q: "Can we add assets to the AMC during the year?", a: "Yes, the AMC is flexible. New assets can be added pro-rated at any point during the contract period. We provide a detailed asset register that is updated quarterly." },
    ],
    ctaTitle: "Protect Your IT Investment with an AMC",
    ctaDesc: "Contact us for a free IT asset audit and customized AMC proposal.",
  },
  {
    slug: "networking-solutions",
    title: "Networking Solutions | WRHWFOUR Private Limited",
    pageTitle: "Enterprise Networking\nSolutions",
    description: "Enterprise networking solutions by WRHWFOUR. LAN/WAN design, structured cabling, firewall, VPN, Wi-Fi, and network monitoring for businesses across India.",
    label: "Connectivity Solutions",
    icon: "hub",
    heroSubtitle: "Build a robust, secure, and high-performance network infrastructure. From LAN design to firewall configuration, we connect your business for peak productivity.",
    stat1Value: "500+", stat1Label: "Networks Deployed",
    stat2Value: "10Gbps", stat2Label: "Max Throughput",
    overviewTitle: "Networking Solutions",
    overview: [
      "A reliable and secure network is the backbone of modern business operations. WRHWFOUR designs, deploys, and maintains enterprise-grade networking solutions that ensure seamless connectivity, optimal performance, and robust security across your entire organization — from a single office to multi-site operations spanning the country.",
      "Our network engineers are certified in Cisco, Juniper, Fortinet, and Ubiquiti technologies. We specialize in structured cabling (Cat6/Cat6A/Fiber), enterprise firewall configuration, VPN deployment, wireless network planning, SD-WAN implementations, and comprehensive network security assessments.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "LAN/WAN Architecture Design and Implementation",
      "Structured Cabling (Cat6, Cat6A, Single & Multi-Mode Fiber)",
      "Enterprise Firewall & UTM Configuration (Fortinet, SonicWall)",
      "Site-to-Site and Remote Access VPN Setup",
      "Wi-Fi Site Survey, Planning & Access Point Deployment",
      "Network Monitoring, Analytics & Management (24/7)",
      "SD-WAN and Multi-Site Connectivity Solutions",
    ],
    processTitle: "Our Process",
    processSubtitle: "A structured, transparent approach to building reliable network infrastructure.",
    process: [
      { title: "Network Assessment & Survey", desc: "Survey your premises, analyze bandwidth requirements, map coverage zones, and design the optimal network topology for your current and future needs." },
      { title: "Architecture Design", desc: "Create detailed network architecture documents, structured cabling plans, equipment specifications, IP addressing schemes, and VLAN segmentation strategies." },
      { title: "Deployment & Configuration", desc: "Install structured cabling, switches, routers, firewalls, and access points. Configure VLANs, DHCP, DNS, VPN, QoS, and security policies." },
      { title: "Testing & Handover", desc: "Comprehensive performance testing, bandwidth verification, security auditing, and complete documentation handover with staff training." },
    ],
    faqs: [
      { q: "What networking brands do you work with?", a: "We work with Cisco, Juniper, Fortinet, SonicWall, Ubiquiti, TP-Link Business, D-Link Enterprise, HP Aruba, and other leading networking brands. We recommend the best-fit brand based on your requirements and budget." },
      { q: "Can you help with Wi-Fi for large offices?", a: "Yes. We conduct professional RF site surveys, design optimal access point placement, and deploy enterprise Wi-Fi systems from Cisco Meraki, Ubiquiti UniFi, HP Aruba, and Ruckus for consistent coverage across large spaces." },
      { q: "Do you provide ongoing network support?", a: "Yes. We offer network management and monitoring services including 24/7 uptime monitoring, proactive issue resolution, monthly performance reports, and priority support for network outages." },
    ],
    ctaTitle: "Build a High-Performance Network",
    ctaDesc: "Contact us for a free network assessment and customized infrastructure proposal.",
  },
  {
    slug: "hardware-support",
    title: "Hardware Support for Companies | WRHWFOUR Private Limited",
    pageTitle: "Hardware Support\nfor Companies",
    description: "On-demand IT hardware support for corporate offices. Printers, UPS, projectors, video conferencing equipment, and all peripherals supported by WRHWFOUR.",
    label: "On-Demand Support",
    icon: "build",
    heroSubtitle: "On-demand technical support for all your IT peripherals and office equipment. Printers, UPS, projectors, video conferencing, and more — we keep your office running smoothly.",
    stat1Value: "10K+", stat1Label: "Issues Resolved",
    stat2Value: "2hr", stat2Label: "Remote Response",
    overviewTitle: "Hardware Support for Companies",
    overview: [
      "Beyond servers and computers, your office relies on a wide range of IT peripherals and equipment that must work reliably every day. WRHWFOUR provides comprehensive hardware support for all your office technology — from printers and scanners to UPS systems, projectors, video conferencing equipment, and more. Our technicians handle everything so your team stays productive.",
      "We offer both on-site and remote support options, with guaranteed response times and transparent per-incident or subscription-based pricing. Our support covers troubleshooting, repair, replacement, configuration, driver updates, and user training across all major hardware brands and categories.",
    ],
    featuresTitle: "Key Features & Capabilities",
    features: [
      "Printer & Scanner Support (HP, Canon, Epson, Brother)",
      "UPS and Power Backup Maintenance & Battery Replacement",
      "Projector and Large Display Installation & Calibration",
      "Video Conferencing Equipment Setup (Zoom, Teams, Poly)",
      "Point-of-Sale (POS) System Support & Configuration",
      "Peripheral Troubleshooting, Drivers & Repair",
      "Both On-Site and Remote Technical Support Options",
    ],
    processTitle: "Our Process",
    processSubtitle: "Fast, efficient support to minimize your downtime and keep operations running.",
    process: [
      { title: "Raise a Ticket", desc: "Contact us via phone, email, or WhatsApp. Our team logs your issue immediately, assigns a priority level based on business impact, and provides a ticket reference number." },
      { title: "Remote Diagnosis", desc: "Our technicians attempt remote resolution first for faster turnaround. Many issues involving drivers, configuration, and software-related hardware problems are resolved within 2 hours remotely." },
      { title: "On-Site Visit", desc: "If remote support isn't sufficient, we dispatch a certified technician to your location equipped with common spare parts, diagnostic tools, and the expertise needed for on-the-spot resolution." },
      { title: "Resolution & Report", desc: "Issue resolved, documented, and reported. We include root cause analysis and preventive recommendations to avoid recurrence." },
    ],
    faqs: [
      { q: "What peripherals do you support?", a: "We support printers (laser, inkjet, thermal), scanners, UPS systems, projectors, monitors, docking stations, keyboards, mice, webcams, video conferencing equipment (Poly, Logitech, Jabra), POS systems, barcode scanners, and all standard office IT equipment." },
      { q: "How quickly can you respond to hardware issues?", a: "Remote support is available within 2 hours of ticket creation. On-site support is typically provided within 4–8 business hours. AMC clients with premium plans receive priority response times as fast as 2 hours on-site." },
      { q: "Do you support multi-location offices?", a: "Yes. We have a nationwide field engineer network that can support your offices across multiple cities under a single support contract, with consistent SLAs and centralized reporting." },
    ],
    ctaTitle: "Keep Your Office Equipment Running Smoothly",
    ctaDesc: "Contact us for a hardware support plan tailored to your office equipment needs.",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find(s => s.slug === slug);
}
