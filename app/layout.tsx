import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Cursor from "@/components/cursor";
import { getProfile } from "@/lib/profile";

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
    default: "Jeevan Adhikari - Full Stack Engineer",
    template: "%s | Jeevan Adhikari",
  },
  description:
    "Jeevan Adhikari is a full stack engineer and developer from Nepal. Explore projects, blog posts, and engineering work.",
  metadataBase: new URL(BASE_URL),
  keywords: [
    "Jeevan Adhikari",
    "full stack engineer Nepal",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "web developer Nepal",
    "portfolio",
    "Nepali developer",
    "boyScavedo",
    "software engineer",
    "Node.js developer",
    "freelance developer Nepal",
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
    title: "Jeevan Adhikari - Full Stack Engineer",
    description: "Jeevan Adhikari is a full stack engineer and developer from Nepal. Explore projects, blog posts, and engineering work.",
    url: BASE_URL,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jeevan Adhikari - Full Stack Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeevan Adhikari - Full Stack Engineer",
    description: "Jeevan Adhikari is a full stack engineer and developer from Nepal.",
    creator: "@jeevanadh",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jeevan Adhikari - Full Stack Engineer" }],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/blog/feed.xml`,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const sameAs = [
    profile.githubUrl,
    profile.twitterUrl,
    profile.linkedinUrl,
    profile.youtubeUrl,
  ].filter((url): url is string => Boolean(url));

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
              alternateName: ["Jeevan", "Jeevan Adhikari", "boyScavedo"],
              url: BASE_URL,
              jobTitle: profile.role ?? "Full Stack Engineer",
              description: profile.bio ?? "Jeevan Adhikari is a full stack engineer and developer from Nepal.",
              knowsAbout: profile.techStack?.length ? profile.techStack : ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Full Stack Development"],
              nationality: { "@type": "Country", name: profile.location ?? "Nepal" },
              sameAs: sameAs.length > 0 ? sameAs : undefined,
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
