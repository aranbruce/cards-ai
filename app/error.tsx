"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import posthog from "posthog-js"
import { EmptyContent } from "@/components/empty-content"
import { MarketingHeader } from "@/components/marketing-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
    posthog.captureException(
      error,
      error.digest ? { digest: error.digest } : undefined,
    )
  }, [error])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex flex-1 flex-col">
        <EmptyContent
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          icon={AlertCircle}
          actions={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Try again
              </Button>
              <Button asChild>
                <Link href="/">Go home</Link>
              </Button>
            </div>
          }
        />
      </main>
      <SiteFooter />
    </div>
  )
}
