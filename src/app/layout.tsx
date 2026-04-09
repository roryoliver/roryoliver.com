import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-5MS4Q86R";

export const metadata: Metadata = {
  title: "Rory Oliver — Fractional CTO",
  description:
    "Fractional CTO for growing businesses. Senior technology leadership, AI strategy, and engineering excellence — on a flexible, fractional basis aligned to your commercial outcomes.",
  openGraph: {
    title: "Rory Oliver — Fractional CTO",
    description:
      "Fractional CTO for growing businesses. Senior technology leadership, AI strategy, and engineering excellence — aligned to your commercial outcomes.",
    url: "https://roryoliver.com",
    siteName: "Rory Oliver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rory Oliver — Fractional CTO",
    description:
      "Fractional CTO for growing businesses. Senior technology leadership, AI strategy, and engineering excellence — aligned to your commercial outcomes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col noise-overlay grid-pattern">
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
