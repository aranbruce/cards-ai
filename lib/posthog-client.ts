import posthog from "posthog-js"

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
