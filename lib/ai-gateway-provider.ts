import { createGateway } from "@ai-sdk/gateway"
import { getAppUrl } from "@/lib/app-url"
import { SITE_NAME } from "@/lib/site-metadata"

/** Human-readable app name for Vercel AI Gateway attribution (`x-title`). */
export const AI_GATEWAY_APP_TITLE = SITE_NAME

/**
 * Headers for Vercel AI Gateway app attribution.
 * @see https://vercel.com/docs/ai-gateway/app-attribution
 */
export function getAiGatewayAttributionHeaders(): Record<string, string> {
  return {
    "http-referer": getAppUrl(),
    "x-title": AI_GATEWAY_APP_TITLE,
  }
}

let registered = false

/**
 * Registers a gateway provider with attribution headers as the AI SDK default
 * so plain `provider/model` strings route through AI Gateway with attribution.
 */
export function registerAiGatewayProvider(): void {
  if (registered) return
  registered = true

  const gateway = createGateway({
    headers: getAiGatewayAttributionHeaders(),
  })

  globalThis.AI_SDK_DEFAULT_PROVIDER = gateway
}
