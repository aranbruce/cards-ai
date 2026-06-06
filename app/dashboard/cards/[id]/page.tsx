import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { CardDetailPageClient } from "@/components/dashboard/card-detail-page"
import { buildLoginRedirectUrl } from "@/lib/safe-redirect-path"
import { getOwnerCardDetail } from "@/lib/owner-cards"
import { randomPresetTextColor } from "@/lib/message-text-color-presets"
import { createClient } from "@/lib/supabase/server"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const headersList = await headers()
    redirect(buildLoginRedirectUrl(headersList.get("x-pathname")))
  }

  const detail = await getOwnerCardDetail(supabase, user.id, id)
  if (!detail) {
    notFound()
  }

  const initialDraftTextColor = randomPresetTextColor()

  return (
    <CardDetailPageClient
      cardId={id}
      initialData={detail}
      initialDraftTextColor={initialDraftTextColor}
    />
  )
}
