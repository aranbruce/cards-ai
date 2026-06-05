import type { Metadata } from "next"
import { AuthMessagePanel } from "@/components/auth/message-panel"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Authentication error")

export default function AuthErrorPage() {
  return (
    <AuthMessagePanel
      title="Authentication Error"
      description="Something went wrong with your authentication. Please try again."
      actions={[
        { href: "/login", label: "Back to sign in", variant: "outline" },
        { href: "/", label: "Go home" },
      ]}
    />
  )
}
