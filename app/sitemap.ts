import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const paths = ["", "/work", "/services", "/pricing", "/about", "/contact", "/terms", "/privacy", "/billing-terms", "/login"];
  const now = new Date();
  return [
    ...paths.map((path) => ({ url: `${base}${path}`, lastModified: now })),
    ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: now })),
  ];
}
