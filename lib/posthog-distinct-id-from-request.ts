import type { NextRequest } from "next/server"
import { normalizePostHogDistinctId } from "@/lib/posthog-server"

const POSTHOG_DISTINCT_ID_HEADER = "x-posthog-distinct-id"

export function getDistinctIdFromRequest(
  request: NextRequest,
  body?: { posthogDistinctId?: unknown },
): string | null {
  const fromHeader = request.headers.get(POSTHOG_DISTINCT_ID_HEADER)
  if (fromHeader) {
    const normalized = normalizePostHogDistinctId(fromHeader)
    if (normalized) return normalized
  }

  if (body?.posthogDistinctId !== undefined) {
    return normalizePostHogDistinctId(body.posthogDistinctId)
  }

  return null
}
