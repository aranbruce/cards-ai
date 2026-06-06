import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Sign in")

export default function LoginPage() {
  return <LoginForm />
}
