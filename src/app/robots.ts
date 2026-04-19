import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/profile/", "/mes-textes/"],
    },
    sitemap: "https://bacfrancaisai.fr/sitemap.xml",
  };
}
