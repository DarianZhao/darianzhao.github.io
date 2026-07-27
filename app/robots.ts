import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.darianzhao.com/sitemap.xml",
    host: "https://www.darianzhao.com",
  };
}
