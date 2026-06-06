import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { EmptyContent } from "@/components/empty-content"
import { MarketingHeader } from "@/components/marketing-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex flex-1 flex-col">
        <EmptyContent
          title="Page not found"
          description="This page doesn't exist or may have been moved."
          icon={FileQuestion}
          actions={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/">Go home</Link>
              </Button>
              <Button asChild>
                <Link href="/create">Start a card</Link>
              </Button>
            </div>
          }
        />
      </main>
      <SiteFooter />
    </div>
  )
}
