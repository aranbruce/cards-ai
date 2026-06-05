import type { MetadataRoute } from "next"
import { getAppUrl } from "@/lib/app-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl()
  const lastModified = new Date()

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/create`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/slack/install`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]
}
