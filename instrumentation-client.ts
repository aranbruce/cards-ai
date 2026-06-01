import posthog from "posthog-js"

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
if (token) {
  const isDev = process.env.NODE_ENV === "development"

  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST ?? "/t",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: isDev,
  })
}
