"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { isOAuthProviderId, type OAuthProviderId } from "@/lib/oauth-auth"
import { resolveSafePostAuthRedirectPath } from "@/lib/safe-redirect-path"
import { hasPendingCard as checkHasPendingCard } from "@/lib/pending-card-storage"
import {
  AUTH_SESSION_NOT_READY_MESSAGE,
  persistPendingCardAfterAuth,
  persistPendingCardErrorMessage,
  waitForAuthUser,
} from "@/lib/persist-pending-card-after-auth"
import { captureAuthEvent } from "@/lib/posthog-client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() => createClient())

  const urlError = searchParams.get("error")
  const urlMessage = searchParams.get("message")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(
    urlError === "auth_callback_failed"
      ? "Sign-in link expired or could not be completed. Request a new reset email or try again."
      : (urlError ?? ""),
  )
  const successMessage = !urlError && urlMessage ? urlMessage : ""
  const [loading, setLoading] = useState(false)
  const [hasPendingCard] = useState(() => {
    if (typeof window === "undefined") return false
    return checkHasPendingCard()
  })

  const tryPersistPendingCard = useCallback(async () => {
    const result = await persistPendingCardAfterAuth(supabase)
    if (result.ok)
      return { cardId: result.cardId, error: null as string | null }
    if (result.reason === "none") {
      return { cardId: null as string | null, error: null as string | null }
    }
    return {
      cardId: null as string | null,
      error: persistPendingCardErrorMessage(result),
    }
  }, [supabase])

  useEffect(() => {
    const oauthParam = searchParams.get("oauth")
    if (!isOAuthProviderId(oauthParam)) return

    let cancelled = false

    const completeOAuthLogin = async () => {
      setLoading(true)
      setError("")

      const authResult = await waitForAuthUser(supabase)

      if (cancelled) return

      if (!authResult.ok) {
        setLoading(false)
        if (authResult.reason === "error") {
          setError(authResult.error)
          return
        }
        setError(AUTH_SESSION_NOT_READY_MESSAGE)
        if (hasPendingCard) {
          router.replace("/create?action=save")
        }
        return
      }

      const user = authResult.user

      const { cardId, error: persistError } = await tryPersistPendingCard()
      if (cancelled) return

      captureAuthEvent("user_logged_in", { provider: oauthParam }, user)

      if (cardId) {
        router.replace(`/dashboard/cards/${cardId}`)
        return
      }

      if (persistError) {
        setError(persistError)
        setLoading(false)
        router.replace("/create?action=save")
        return
      }

      const redirect = resolveSafePostAuthRedirectPath(
        searchParams.get("redirect"),
      )
      router.replace(redirect)
    }

    void completeOAuthLogin()

    return () => {
      cancelled = true
    }
  }, [hasPendingCard, router, searchParams, supabase, tryPersistPendingCard])

  const startOAuthLogin = async (provider: OAuthProviderId) => {
    setLoading(true)
    setError("")

    const redirect = resolveSafePostAuthRedirectPath(
      searchParams.get("redirect"),
    )
    const action = searchParams.get("action")

    const callbackUrl = new URL("/callback", window.location.origin)
    const next =
      action === "save"
        ? "/create?action=save"
        : (() => {
            const nextParams = new URLSearchParams({
              oauth: provider,
              redirect,
            })
            if (action) nextParams.set("action", action)
            return `/login?${nextParams.toString()}`
          })()
    callbackUrl.searchParams.set("next", next)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const { cardId, error: persistError } = await tryPersistPendingCard()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        captureAuthEvent("user_logged_in", { provider: "email" }, user)
      }

      if (cardId) {
        router.push(`/dashboard/cards/${cardId}`)
      } else if (persistError) {
        setError(persistError)
        setLoading(false)
        router.push("/create?action=save")
      } else {
        const redirect = resolveSafePostAuthRedirectPath(
          searchParams.get("redirect"),
        )
        router.push(redirect)
      }
    } catch {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-1.5 text-3xl font-semibold tracking-tight">
          Welcome back.
        </h1>
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href={
              hasPendingCard
                ? "/sign-up?redirect=/create&action=save"
                : "/sign-up"
            }
            className="font-medium text-brand hover:underline"
          >
            Create an account
          </Link>
          .
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded border border-primary/20 bg-primary/10 p-3 text-sm text-foreground">
          {successMessage}
        </div>
      )}

      {hasPendingCard && (
        <Alert className="mb-6">
          <AlertTitle>Your card is ready!</AlertTitle>
          <AlertDescription>Sign in to save it.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => void startOAuthLogin("google")}
          disabled={loading}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => void startOAuthLogin("github")}
          disabled={loading}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="my-4 flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            variant="auth"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            variant="auth"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          className="mt-4"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : hasPendingCard
              ? "Sign in & save card"
              : "Sign in"}
        </Button>
      </form>
    </>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={<p className="text-center text-muted-foreground">Loading…</p>}
    >
      <LoginForm />
    </Suspense>
  )
}
