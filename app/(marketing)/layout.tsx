import { MarketingHeader } from "@/components/marketing-header"
import { SiteFooter } from "@/components/site-footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}
