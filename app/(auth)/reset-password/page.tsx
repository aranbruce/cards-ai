import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Reset password")

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
