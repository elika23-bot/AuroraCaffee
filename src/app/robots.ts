import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auroracafe.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing useful to index here, and no reason to invite crawlers
        // to the admin login or API routes.
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
