import path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    },
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    webpackBuildWorker: true
  },
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: {
    root: path.resolve(__dirname)
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      { source: "/terms-of-service.html", destination: "/terms-of-service", permanent: true },
      { source: "/services/cctv-installation.html", destination: "/services/cctv-installation", permanent: true },
      { source: "/services/computer-sales-repair.html", destination: "/services/computer-sales-repair", permanent: true },
      { source: "/services/server-installation.html", destination: "/services/server-installation", permanent: true },
      { source: "/services/biometric-attendance.html", destination: "/services/biometric-attendance", permanent: true },
      { source: "/services/corporate-it-amc.html", destination: "/services/corporate-it-amc", permanent: true },
      { source: "/services/networking-solutions.html", destination: "/services/networking-solutions", permanent: true },
      { source: "/services/hardware-support.html", destination: "/services/hardware-support", permanent: true }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
