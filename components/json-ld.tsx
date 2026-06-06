import { getAppUrl } from "@/lib/app-url"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-metadata"

export function SiteJsonLd() {
  const appUrl = getAppUrl()

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: appUrl,
    description: SITE_TAGLINE,
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: appUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  )
}
