import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rory Oliver — Fractional CTO",
  description:
    "Fractional CTO and technical leadership for ambitious startups and scale-ups. Strategy, architecture, and engineering excellence — without the full-time overhead.",
  openGraph: {
    title: "Rory Oliver — Fractional CTO",
    description:
      "Fractional CTO and technical leadership for ambitious startups and scale-ups.",
    url: "https://roryoliver.com",
    siteName: "Rory Oliver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rory Oliver — Fractional CTO",
    description:
      "Fractional CTO and technical leadership for ambitious startups and scale-ups.",
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
      </head>
      <body className="min-h-full flex flex-col noise-overlay grid-pattern">
        {children}
      </body>
    </html>
  );
}
