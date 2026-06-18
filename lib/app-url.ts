function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "")
}

let hasLoggedAppUrlResolution = false

function logAppUrlResolution(source: string, resolvedUrl: string): void {
  if (process.env.VERCEL_ENV !== "preview" || hasLoggedAppUrlResolution) return

  hasLoggedAppUrlResolution = true

  console.info("[getAppUrl] resolved app URL", {
    source,
    resolvedUrl,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    vercelProjectProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
  })
}

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const resolvedUrl = stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
    logAppUrlResolution("NEXT_PUBLIC_APP_URL", resolvedUrl)
    return resolvedUrl
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const resolvedUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    logAppUrlResolution("VERCEL_PROJECT_PRODUCTION_URL", resolvedUrl)
    return resolvedUrl
  }
  if (process.env.VERCEL_URL) {
    const resolvedUrl = `https://${process.env.VERCEL_URL}`
    logAppUrlResolution("VERCEL_URL", resolvedUrl)
    return resolvedUrl
  }

  const resolvedUrl = "http://localhost:3000"
  logAppUrlResolution("LOCALHOST_FALLBACK", resolvedUrl)
  return resolvedUrl
}
