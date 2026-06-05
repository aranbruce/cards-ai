import { notFound } from "next/navigation"
import { CardDetailPageClient } from "@/components/dashboard/card-detail-page"
import { getOwnerCardDetail } from "@/lib/owner-cards"
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

  const detail = await getOwnerCardDetail(supabase, user!.id, id)
  if (!detail) {
    notFound()
  }

  return <CardDetailPageClient cardId={id} initialData={detail} />
}
