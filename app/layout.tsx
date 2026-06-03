import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Cursor from "@/components/cursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Jeevan Adhikari — Full Stack Engineer",
    template: "%s | Jeevan Adhikari",
  },
  description:
    "Jeevan Adhikari is a full stack engineer and developer from Nepal. Explore Jeevan's projects, blog posts, and engineering work.",
  metadataBase: new URL(BASE_URL),
  keywords: [
    "Jeevan",
    "Jeevan Adhikari",
    "Jeevan developer",
    "Jeevan engineer",
    "Jeevan full stack",
    "Jeevan Nepal",
    "Jeevan Adhikari portfolio",
    "Jeevan Adhikari developer",
    "Jeevan Adhikari engineer",
    "full stack engineer Nepal",
    "Next.js developer Nepal",
    "React developer",
    "boyScavedo",
  ],
  authors: [{ name: "Jeevan Adhikari", url: BASE_URL }],
  creator: "Jeevan Adhikari",
  publisher: "Jeevan Adhikari",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "Jeevan Adhikari",
    title: "Jeevan Adhikari — Full Stack Engineer",
    description: "Jeevan Adhikari is a full stack engineer and developer from Nepal. Explore projects, blog posts, and engineering work.",
    url: BASE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeevan Adhikari — Full Stack Engineer",
    description: "Jeevan Adhikari is a full stack engineer and developer from Nepal.",
    creator: "@jeevanadh",
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/blog/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jeevan Adhikari",
              alternateName: ["Jeevan", "Jeevan developer", "Jeevan engineer", "boyScavedo"],
              url: BASE_URL,
              jobTitle: "Full Stack Engineer",
              description: "Jeevan Adhikari is a full stack engineer and developer from Nepal, specializing in React, Next.js, TypeScript, and Node.js.",
              knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Full Stack Development"],
              nationality: { "@type": "Country", name: "Nepal" },
              sameAs: [
                "https://github.com/boyScavedo",
              ],
            }),
          }}
        />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
        <Cursor />
        <Navbar />
        <main className="flex-1 pt-[60px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
