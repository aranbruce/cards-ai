import type { MetadataRoute } from "next"
import { getAppUrl } from "@/lib/app-url"
import { ALL_CATEGORY_SLUGS } from "@/lib/category-pages"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl()

  const categoryPages: MetadataRoute.Sitemap = ALL_CATEGORY_SLUGS.map(
    (slug) => ({
      url: `${base}/browse/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  )

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/browse`, changeFrequency: "monthly", priority: 0.85 },
    ...categoryPages,
    {
      url: `${base}/slack/install`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ]
}
