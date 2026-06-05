import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Sign up")

export default function SignUpPage() {
  return <SignUpForm />
}
