export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { registerAiGatewayProvider } =
    await import("@/lib/ai-gateway-provider")
  registerAiGatewayProvider()

  const { startPostHogAiOtel } = await import("@/lib/posthog-ai-otel")
  await startPostHogAiOtel()
}
