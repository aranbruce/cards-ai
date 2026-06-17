import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CategoryLandingPage } from "@/components/category-landing-page"
import { ALL_CATEGORY_SLUGS, getCategoryConfig } from "@/lib/category-pages"
import { buildPageMetadata } from "@/lib/site-metadata"

export function generateStaticParams() {
  return ALL_CATEGORY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = getCategoryConfig(slug)
  if (!config) return {}

  return buildPageMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    path: `/browse/${config.slug}`,
  })
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCategoryConfig(slug)
  if (!config) notFound()

  return <CategoryLandingPage config={config} />
}

export const dynamicParams = false
