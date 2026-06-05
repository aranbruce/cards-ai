import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { buildLoginRedirectUrl } from "@/lib/safe-redirect-path"
import { privatePageMetadata } from "@/lib/site-metadata"
import { createClient } from "@/lib/supabase/server"
import type { ReactNode } from "react"

export const metadata: Metadata = privatePageMetadata("Dashboard")

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const headersList = await headers()
    redirect(buildLoginRedirectUrl(headersList.get("x-pathname")))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader right={<DashboardSignOutButton />} />
      {children}
    </div>
  )
}
