import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { EmptyContent } from "@/components/empty-content"
import { Button } from "@/components/ui/button"

export default function ContributeCardNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col">
        <EmptyContent
          description="This link may be invalid or the card is no longer collecting messages."
          actions={
            <Button asChild>
              <Link href="/create">Create a card</Link>
            </Button>
          }
        />
      </main>
    </div>
  )
}
