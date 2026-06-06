import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { CardNotFoundPanel } from "@/components/card-not-found"
import { Button } from "@/components/ui/button"

export default function ContributeCardNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col">
        <CardNotFoundPanel
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
