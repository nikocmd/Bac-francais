import { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bacfrancaisai.fr";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/analyse`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/oral`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/examen`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/oeuvre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/premium`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({ url: `${base}/guides/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
