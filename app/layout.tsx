import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import TikTokPixelInit from "@/components/TikTokPixelInit";
import MatrixRain from "@/components/ui/MatrixRain";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Lawrence Cortes — Software Developer & Brand Designer | Ormoc City, Philippines",
  description:
    "Portfolio of Lawrence Cortes: Next.js developer, brand designer, cybersecurity learner, and AI builder based in Ormoc City, PH. Available for internships.",
  keywords: [
    "software developer Philippines",
    "Next.js developer Cebu",
    "brand designer Philippines",
    "cybersecurity student",
    "internship ready 2025",
    "CORTES Engineering Portfolio",
  ],
  openGraph: {
    title: "Lawrence Cortes — Software Developer",
    description:
      "Next.js developer, brand designer, and AI builder from Ormoc City, PH. Available for internships.",
    images: ["/og-image.png"],
    url: "https://lawrencecortes.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lawrence Cortes — Software Developer",
    description: "Next.js developer, brand designer, and AI builder from Ormoc City, PH.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Lawrence Cortes",
    jobTitle: "Software Developer & Brand Designer",
    url: "https://lawrencecortes.dev",
    sameAs: [
      "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio",
    ],
    description:
      "Software developer, brand designer, and AI builder based in Ormoc City, Leyte, Philippines.",
  };

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <MatrixRain />
        <CustomCursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <TikTokPixelInit />
        <Analytics />
      </body>
    </html>
  );
}
