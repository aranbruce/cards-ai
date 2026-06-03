import posthog from "posthog-js"

const POSTHOG_DISTINCT_ID_HEADER = "X-POSTHOG-DISTINCT-ID"

/** Headers linking server-side AI calls to the current PostHog distinct ID. */
export function posthogAiHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const distinctId = posthog.get_distinct_id?.()
    if (!distinctId) return {}
    return { [POSTHOG_DISTINCT_ID_HEADER]: distinctId }
  } catch {
    return {}
  }
}

const INSTANT_CAPTURE_OPTIONS = {
  send_instantly: true,
  transport: "sendBeacon" as const,
}

/** Identify and capture auth events before navigation so they are not dropped on unload. */
export function captureAuthEvent(
  event: "user_logged_in" | "user_signed_up",
  properties: Record<string, string | boolean | undefined>,
  user?: { id: string; email?: string | null },
) {
  if (user) {
    posthog.identify(user.id, user.email ? { email: user.email } : undefined)
  }
  posthog.capture(event, properties, INSTANT_CAPTURE_OPTIONS)
}
