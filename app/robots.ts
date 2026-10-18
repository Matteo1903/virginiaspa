import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/staff", "/api/", "/checkout/success", "/chi-siamo"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
