import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HomeDemoPanel } from "@/components/home-demo-panel"
import { HomeMarketingSections } from "@/components/home-marketing-sections"
import { getAppUrl } from "@/lib/app-url"
import { buildPageMetadata, SITE_TAGLINE } from "@/lib/site-metadata"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = buildPageMetadata({
  title: "AI group greeting cards",
  description: SITE_TAGLINE,
  path: "/",
})

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  const appHostname = getAppUrl().replace(/^https?:\/\//, "")

  return (
    <>
      <section className="mx-auto items-center gap-12 px-6 py-20 md:px-15 lg:gap-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="mt-5 text-4xl leading-[0.95] font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
              Greeting cards,
              <br />
              <span className="text-muted-foreground">
                generated in seconds,{" "}
              </span>
              <span className="text-brand">signed in minutes.</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-muted-foreground">
              Describe the card or upload a photo. We design the cover, draft
              the message, and pass it around for the whole team to sign.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/create">
                  Start a card
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    Free
                  </span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>

          <HomeDemoPanel />
        </div>
      </section>

      <HomeMarketingSections appHostname={appHostname} />
    </>
  )
}
