import Link from "next/link"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-16">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:text-left">
          <Logo className="justify-center self-auto lg:justify-start" />
          <div className="flex flex-col items-center gap-4 lg:contents">
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-center"
              aria-label="Footer"
            >
              <Link href="/slack/install" className="hover:text-foreground">
                Slack app
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground lg:text-right">
              Cards worth signing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
