import type { MetadataRoute } from "next"
import { getAppUrl } from "@/lib/app-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl()

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${base}/slack/install`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ]
}
