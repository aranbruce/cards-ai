import type { TelemetrySettings } from "ai"
import { normalizePostHogDistinctId } from "@/lib/posthog-server"

function isPostHogAiTelemetryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim())
}

export function aiTelemetry(
  functionId: string,
  distinctId?: string | null,
): { experimental_telemetry: TelemetrySettings } {
  const normalizedDistinctId = normalizePostHogDistinctId(distinctId ?? null)

  const telemetry: TelemetrySettings = {
    isEnabled: isPostHogAiTelemetryEnabled(),
    functionId,
  }

  if (normalizedDistinctId) {
    telemetry.metadata = {
      posthog_distinct_id: normalizedDistinctId,
    }
  }

  return { experimental_telemetry: telemetry }
}
