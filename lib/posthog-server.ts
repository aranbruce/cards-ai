import { PostHog } from "posthog-node"
import { after } from "next/server"

let posthogClient: PostHog | null = null

/** @internal Resets the cached client between unit tests. */
export function resetPostHogClientForTests() {
  posthogClient = null
}

function getPostHogToken(): string | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
  return token || null
}

export function getPostHogClient(): PostHog | null {
  const token = getPostHogToken()
  if (!token) return null

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}

export function normalizePostHogDistinctId(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > 200) return null
  return trimmed
}

/** Capture a server event; flush runs after the response via after(). Failures are logged, never thrown. */
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const client = getPostHogClient()
  if (!client) return

  try {
    client.capture({ distinctId, event, properties })
    after(async () => {
      try {
        await client.flush()
      } catch (error) {
        console.error("[posthog] Failed to flush server event:", event, error)
      }
    })
  } catch (error) {
    console.error("[posthog] Failed to capture server event:", event, error)
  }
}
