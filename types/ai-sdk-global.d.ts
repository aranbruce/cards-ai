import type { ProviderV3 } from "@ai-sdk/provider"

declare global {
  // AI SDK reads this when resolving plain `provider/model` strings.
  var AI_SDK_DEFAULT_PROVIDER: ProviderV3 | undefined
}

export {}
