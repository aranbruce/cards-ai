import { NodeSDK } from "@opentelemetry/sdk-node"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { PostHogSpanProcessor } from "@posthog/ai/otel"

let sdk: NodeSDK | null = null

function getPostHogToken(): string | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
  return token || null
}

function getPostHogHost(): string {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com"
  )
}

/** Starts OpenTelemetry export to PostHog AI observability. No-op without project token. */
export async function startPostHogAiOtel(): Promise<void> {
  if (sdk) return

  const apiKey = getPostHogToken()
  if (!apiKey) return

  const instance = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": "card-share-ai",
    }),
    // NodeSDK ^0.218: spanProcessors (plural) is the supported option; spanProcessor is deprecated.
    spanProcessors: [
      new PostHogSpanProcessor({
        apiKey,
        host: getPostHogHost(),
      }),
    ],
  })

  try {
    await instance.start()
    sdk = instance
  } catch (error) {
    console.error("Failed to start PostHog AI OpenTelemetry:", error)
  }
}
