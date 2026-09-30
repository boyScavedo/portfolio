import type { MetadataRoute } from "next";

// Matches the sitemap cadence so a base-URL change propagates without a redeploy.
export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
