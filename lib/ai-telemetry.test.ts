import { afterEach, describe, expect, it, vi } from "vitest"
import { aiTelemetry } from "./ai-telemetry"

describe("aiTelemetry", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("disables telemetry when project token is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "")

    const { experimental_telemetry } = aiTelemetry("generate-card-headline")

    expect(experimental_telemetry.isEnabled).toBe(false)
    expect(experimental_telemetry.functionId).toBe("generate-card-headline")
    expect(experimental_telemetry.metadata).toBeUndefined()
  })

  it("enables telemetry when project token is set", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")

    const { experimental_telemetry } = aiTelemetry("generate-card-message")

    expect(experimental_telemetry.isEnabled).toBe(true)
    expect(experimental_telemetry.functionId).toBe("generate-card-message")
  })

  it("includes posthog_distinct_id when distinct id is valid", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")

    const { experimental_telemetry } = aiTelemetry(
      "generate-card-cover-art",
      "user-abc",
    )

    expect(experimental_telemetry.metadata).toEqual({
      posthog_distinct_id: "user-abc",
    })
  })

  it("omits metadata for invalid distinct ids", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")

    const { experimental_telemetry } = aiTelemetry(
      "generate-card-cover-art",
      "",
    )

    expect(experimental_telemetry.metadata).toBeUndefined()
  })
})
