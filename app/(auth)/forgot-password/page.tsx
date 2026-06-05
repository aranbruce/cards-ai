import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Forgot password")

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
