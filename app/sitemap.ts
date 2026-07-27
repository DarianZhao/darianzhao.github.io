import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.darianzhao.com",
      lastModified: new Date("2026-07-27"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
