import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { redirectIfStaleOAuthReturn } from "@/lib/auth/stale-oauth-return"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Sign up")

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignUpPage({ searchParams }: PageProps) {
  await redirectIfStaleOAuthReturn("/sign-up", await searchParams)
  return <SignUpForm />
}
