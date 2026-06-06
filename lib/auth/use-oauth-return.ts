"use client"

import { useEffect } from "react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ReadonlyURLSearchParams } from "next/navigation"
import type { SupabaseClient } from "@supabase/supabase-js"
import { isOAuthProviderId } from "@/lib/oauth-auth"
import {
  AUTH_SESSION_NOT_READY_MESSAGE,
  waitForAuthUser,
} from "@/lib/persist-pending-card-after-auth"
import { buildAuthPageUrlWithoutOAuth } from "@/lib/auth/oauth-return-url"
import { resolveSafePostAuthRedirectPath } from "@/lib/safe-redirect-path"
import { captureAuthEvent } from "@/lib/posthog-client"
import type { OAuthReturnPath } from "@/lib/auth/oauth-sign-in"

type PersistResult = {
  cardId: string | null
  error: string | null
}

type UseOAuthReturnOptions = {
  returnPath: OAuthReturnPath
  supabase: SupabaseClient
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  hasPendingCard: boolean
  tryPersistPendingCard: () => Promise<PersistResult>
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
}

export function useOAuthReturn({
  returnPath,
  supabase,
  searchParams,
  router,
  hasPendingCard,
  tryPersistPendingCard,
  setLoading,
  setError,
}: UseOAuthReturnOptions) {
  useEffect(() => {
    const oauthParam = searchParams.get("oauth")
    if (!isOAuthProviderId(oauthParam)) return

    let cancelled = false
    const authEvent =
      returnPath === "/login"
        ? ("user_logged_in" as const)
        : ("user_signed_up" as const)

    const completeOAuth = async () => {
      setLoading(true)
      setError("")

      const authResult = await waitForAuthUser(supabase)

      if (cancelled) return

      if (!authResult.ok) {
        setLoading(false)
        if (authResult.reason === "error") {
          setError(authResult.error)
          router.replace(buildAuthPageUrlWithoutOAuth(returnPath, searchParams))
          return
        }
        if (hasPendingCard) {
          setError(AUTH_SESSION_NOT_READY_MESSAGE)
          router.replace("/create?action=save")
          return
        }
        router.replace(buildAuthPageUrlWithoutOAuth(returnPath, searchParams))
        return
      }

      const user = authResult.user
      const { cardId, error: persistError } = await tryPersistPendingCard()
      if (cancelled) return

      captureAuthEvent(authEvent, { provider: oauthParam }, user)

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

    void completeOAuth()

    return () => {
      cancelled = true
    }
  }, [
    returnPath,
    hasPendingCard,
    router,
    searchParams,
    supabase,
    tryPersistPendingCard,
    setLoading,
    setError,
  ])
}
