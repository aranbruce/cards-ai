"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { friendlyAuthError } from "@/lib/auth-errors"
import { isOAuthProviderId, type OAuthProviderId } from "@/lib/oauth-auth"
import { hasPendingCard as checkHasPendingCard } from "@/lib/pending-card-storage"
import {
  AUTH_SESSION_NOT_READY_MESSAGE,
  persistPendingCardAfterAuth,
  persistPendingCardErrorMessage,
  waitForAuthUser,
} from "@/lib/persist-pending-card-after-auth"
import { resolveSafePostAuthRedirectPath } from "@/lib/safe-redirect-path"
import { captureAuthEvent } from "@/lib/posthog-client"

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasPendingCard] = useState(() => {
    if (typeof window === "undefined") return false
    return checkHasPendingCard()
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() => createClient())

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

    const completeOAuthSignUp = async () => {
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

      captureAuthEvent("user_signed_up", { provider: oauthParam }, user)

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

    void completeOAuthSignUp()

    return () => {
      cancelled = true
    }
  }, [hasPendingCard, router, searchParams, supabase, tryPersistPendingCard])

  const startOAuthSignUp = async (provider: OAuthProviderId) => {
    setLoading(true)
    setError("")

    const redirect = resolveSafePostAuthRedirectPath(
      searchParams.get("redirect"),
    )
    const action = searchParams.get("action")

    const nextParams = new URLSearchParams({ oauth: provider, redirect })
    if (action) nextParams.set("action", action)

    const callbackUrl = new URL("/callback", window.location.origin)
    callbackUrl.searchParams.set("next", `/sign-up?${nextParams.toString()}`)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      })

      if (error) {
        setError(friendlyAuthError(error.message, error.status))
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      // If user.identities is empty, email confirmation is required
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length > 0
      ) {
        // User is auto-confirmed (dev mode or email confirmation disabled)
        captureAuthEvent(
          "user_signed_up",
          { provider: "email" },
          { id: data.user.id, email: data.user.email },
        )

        const { cardId, error: persistError } = await tryPersistPendingCard()

        if (cardId) {
          router.push(`/dashboard/cards/${cardId}`)
        } else if (persistError) {
          setError(persistError)
          setLoading(false)
          router.push("/create?action=save")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Email confirmation required - store pending card info and redirect to success
        if (data.user) {
          captureAuthEvent(
            "user_signed_up",
            {
              provider: "email",
              email_confirmation_required: true,
            },
            { id: data.user.id, email: data.user.email },
          )
        }
        router.push("/sign-up-success")
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
          Create an account.
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have one?{" "}
          <Link
            href={
              hasPendingCard ? "/login?redirect=/create&action=save" : "/login"
            }
            className="font-medium text-brand hover:underline"
          >
            Sign in
          </Link>
          .
        </p>
      </div>

      {hasPendingCard && (
        <Alert className="mb-6">
          <AlertTitle>Your card is ready!</AlertTitle>
          <AlertDescription>Create an account to save it.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => void startOAuthSignUp("google")}
          disabled={loading}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => void startOAuthSignUp("github")}
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

      <form onSubmit={handleSignUp} className="space-y-4">
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
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
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
            ? "Creating account..."
            : hasPendingCard
              ? "Sign up & save card"
              : "Create account"}
        </Button>
      </form>
    </>
  )
}

export default function SignUp() {
  return (
    <Suspense
      fallback={<p className="text-center text-muted-foreground">Loading…</p>}
    >
      <SignUpForm />
    </Suspense>
  )
}
