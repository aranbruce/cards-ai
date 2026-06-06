import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { redirectIfStaleOAuthReturn } from "@/lib/auth/stale-oauth-return"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Sign in")

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: PageProps) {
  await redirectIfStaleOAuthReturn("/login", await searchParams)
  return <LoginForm />
}
