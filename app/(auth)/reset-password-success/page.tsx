import type { Metadata } from "next"
import { AuthSuccessPanel } from "@/components/auth/success-panel"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Password updated")

export default function ResetPasswordSuccessPage() {
  return (
    <AuthSuccessPanel
      title="Password updated"
      description="Your password has been changed. Sign in with your new password to continue."
      action={{ href: "/login", label: "Sign in" }}
    />
  )
}
