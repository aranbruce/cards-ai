import { type NextRequest, NextResponse } from "next/server"

const EU_ASSETS_HOST = "eu-assets.i.posthog.com"
const EU_API_HOST = "eu.i.posthog.com"
const POSTHOG_SUBDOMAIN_HOST = "t.cardshare.ai"
/** Path prefixes used with api_host=/t (local) and legacy /ingest (remote config). */
const POSTHOG_PATH_PREFIXES = ["/t", "/ingest"] as const

function posthogUpstreamHost(pathname: string): string {
  if (pathname.startsWith("/static/") || pathname.startsWith("/array/")) {
    return EU_ASSETS_HOST
  }
  return EU_API_HOST
}

/**
 * Reverse-proxy PostHog through this app with the correct Host header.
 * Next.js rewrites alone often return 400 for /static/* script loads.
 */
export function tryPostHogProxy(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname
  const host = request.headers.get("host")?.split(":")[0]

  let pathPrefix: string | null = null
  if (host === POSTHOG_SUBDOMAIN_HOST) {
    pathPrefix = ""
  } else {
    for (const prefix of POSTHOG_PATH_PREFIXES) {
      if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
        pathPrefix = prefix
        break
      }
    }
  }

  if (pathPrefix === null) {
    return null
  }

  const upstreamPath =
    pathPrefix === "" ? pathname : pathname.slice(pathPrefix.length) || "/"

  const upstreamHost = posthogUpstreamHost(upstreamPath)
  const url = request.nextUrl.clone()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("host", upstreamHost)
  // App cookies on localhost must not be forwarded to PostHog (can cause 400s).
  requestHeaders.delete("cookie")
  requestHeaders.delete("authorization")

  url.protocol = "https"
  url.hostname = upstreamHost
  url.port = "443"
  url.pathname = upstreamPath

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  })
}
