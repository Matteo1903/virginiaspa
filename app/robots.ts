import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/staff", "/api/", "/checkout/success", "/chi-siamo"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
