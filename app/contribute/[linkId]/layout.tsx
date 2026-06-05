import type { Metadata } from "next"
import { buildContributeCardMetadata } from "@/lib/view-card-metadata"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ linkId: string }>
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { linkId } = await params
  return buildContributeCardMetadata(linkId)
}

export default function ContributeLinkLayout({ children }: LayoutProps) {
  return children
}
