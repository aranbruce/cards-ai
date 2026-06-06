import type { SupabaseClient } from "@supabase/supabase-js"
import type { OAuthProviderId } from "@/lib/oauth-auth"
import { resolveSafePostAuthRedirectPath } from "@/lib/safe-redirect-path"

export type OAuthReturnPath = "/login" | "/sign-up"

export function buildOAuthCallbackRedirectTo(
  returnPath: OAuthReturnPath,
  provider: OAuthProviderId,
  redirect: string,
  action: string | null,
): string {
  const nextParams = new URLSearchParams({ oauth: provider, redirect })
  if (action) nextParams.set("action", action)

  const callbackUrl = new URL("/callback", window.location.origin)
  callbackUrl.searchParams.set("next", `${returnPath}?${nextParams.toString()}`)
  return callbackUrl.toString()
}

export async function startOAuthSignIn(
  supabase: SupabaseClient,
  returnPath: OAuthReturnPath,
  provider: OAuthProviderId,
  searchParams: Pick<URLSearchParams, "get">,
) {
  const redirect = resolveSafePostAuthRedirectPath(searchParams.get("redirect"))
  const action = searchParams.get("action")
  const redirectTo = buildOAuthCallbackRedirectTo(
    returnPath,
    provider,
    redirect,
    action,
  )

  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  })
}
