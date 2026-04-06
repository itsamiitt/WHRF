import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import "@/assets/style.css";
import "@/assets/pages.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wrhwfour.com"),
  title: "WRHWFOUR",
  description: "Pan-India IT Sales, Support & Infrastructure Services"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/WRHW_logo.png" type="image/png" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script src="/assets/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
