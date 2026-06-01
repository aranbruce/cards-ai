/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.giphy.com" },
    ],
  },
  // PostHog proxy is handled in proxy.ts (Host header required for /static/* scripts).
  skipTrailingSlashRedirect: true,
}

export default nextConfig
