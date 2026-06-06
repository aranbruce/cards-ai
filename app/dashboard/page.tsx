import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { listOwnerCards } from "@/lib/owner-cards"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const cards = await listOwnerCards(supabase, user!.id)

  return <DashboardHome initialCards={cards} user={user!} />
}
