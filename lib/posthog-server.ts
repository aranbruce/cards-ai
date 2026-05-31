import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      },
    )
  }
  return posthogClient
}

export function normalizePostHogDistinctId(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > 200) return null
  return trimmed
}

/** Capture a server event and flush before the route handler returns. Failures are logged, never thrown. */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  try {
    const client = getPostHogClient()
    client.capture({ distinctId, event, properties })
    await client.flush()
  } catch (error) {
    console.error("[posthog] Failed to capture server event:", event, error)
  }
}
