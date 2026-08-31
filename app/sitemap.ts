import type { MetadataRoute } from "next";
import { ritualExperiences } from "./ritual-experiences";
import { siteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-31");
  const pages = ["", "/gift-card", "/head-spa"];
  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path || "/"}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...ritualExperiences.map((ritual) => ({
      url: `${siteUrl}/esperienze/${ritual.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
