import { redirect } from "next/navigation"
import {
  authPageSearchParamsFromRecord,
  buildAuthPageUrlWithoutOAuth,
} from "@/lib/auth/oauth-return-url"
import type { OAuthReturnPath } from "@/lib/auth/oauth-sign-in"
import { isOAuthProviderId } from "@/lib/oauth-auth"
import { createClient } from "@/lib/supabase/server"

/** Redirect away from stale OAuth return URLs when there is no active session. */
export async function redirectIfStaleOAuthReturn(
  returnPath: OAuthReturnPath,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const params = authPageSearchParamsFromRecord(searchParams)
  if (!isOAuthProviderId(params.get("oauth"))) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(buildAuthPageUrlWithoutOAuth(returnPath, params))
  }
}
