import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://boardprep.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BoardPrep | CBSE Class 10 Board Exam Tracker, Notes & PYQs",
    template: "%s | BoardPrep",
  },
  description:
    "Student-first CBSE Class 10 preparation platform. Access official 2026–27 syllabus, comprehensive key notes PDFs, sample papers, daily 3-task planner, and mistake notebook.",
  keywords: [
    "CBSE Class 10 Syllabus 2026-27",
    "CBSE Class 10 Notes PDF",
    "Class 10 Science Key Notes",
    "Class 10 Mathematics Standard Sample Papers",
    "Class 10 Social Science Syllabus",
    "Official CBSE PYQ PDFs",
    "CBSE Board Exam Preparation Tracker",
    "NCERT Class 10 Study Material",
    "CBSE 2027 Board Exam",
  ],
  authors: [{ name: "BoardPrep Academic Team" }],
  creator: "BoardPrep",
  publisher: "BoardPrep",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "BoardPrep | CBSE Class 10 Board Exam Preparation Platform",
    description:
      "One day at a time. One chapter at a time. Free official CBSE Class 10 syllabus, key notes, model question papers, and daily preparation planner.",
    siteName: "BoardPrep",
    images: [
      {
        url: "/icon.svg",
        width: 800,
        height: 600,
        alt: "BoardPrep - Class 10 Board Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoardPrep | CBSE Class 10 Preparation Platform",
    description:
      "Free official CBSE Class 10 syllabus, comprehensive chapter key notes PDFs, and board exam tracker.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalApplication",
  name: "BoardPrep",
  description:
    "Student-first CBSE Class 10 preparation platform with official syllabus, comprehensive key notes, and daily study planner.",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  educationalLevel: "Secondary School (Class 10 CBSE)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
