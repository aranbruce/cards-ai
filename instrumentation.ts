export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { startPostHogAiOtel } = await import("@/lib/posthog-ai-otel")
  await startPostHogAiOtel()
}
