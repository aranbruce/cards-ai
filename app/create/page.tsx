import type { Metadata } from "next"
import { CreatePageIntro } from "@/components/create-page-intro"
import { buildPageMetadata } from "@/lib/site-metadata"
import { CreateCardPageClient } from "./create-card-client"

export const metadata: Metadata = buildPageMetadata({
  title: "Create a card",
  description:
    "Start a free AI greeting card. Describe the occasion, pick a tone, and share one link for everyone to sign.",
  path: "/create",
})

export default function CreatePage() {
  return <CreateCardPageClient intro={<CreatePageIntro />} />
}
