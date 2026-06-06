import type { OAuthReturnPath } from "@/lib/auth/oauth-sign-in"
import { resolveSafePostAuthRedirectPath } from "@/lib/safe-redirect-path"

export type AuthPageSearchParams = Pick<URLSearchParams, "get">

export function authPageSearchParamsFromRecord(
  params: Record<string, string | string[] | undefined>,
): AuthPageSearchParams {
  return {
    get(key: string) {
      const value = params[key]
      if (value == null) return null
      return Array.isArray(value) ? (value[0] ?? null) : value
    },
  }
}

/** Strip OAuth handoff params while preserving safe post-auth query values. */
export function buildAuthPageUrlWithoutOAuth(
  returnPath: OAuthReturnPath,
  searchParams: AuthPageSearchParams,
): string {
  const params = new URLSearchParams()
  const redirect = searchParams.get("redirect")
  if (redirect) {
    params.set("redirect", resolveSafePostAuthRedirectPath(redirect))
  }
  const action = searchParams.get("action")
  if (action) params.set("action", action)
  const error = searchParams.get("error")
  if (error) params.set("error", error)
  const message = searchParams.get("message")
  if (message) params.set("message", message)
  const qs = params.toString()
  return qs ? `${returnPath}?${qs}` : returnPath
}
