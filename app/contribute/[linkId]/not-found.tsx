import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { FileX2 } from "lucide-react"

export default function ContributeCardNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileX2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              Card not found
            </h1>
            <p className="max-w-xs text-sm text-muted-foreground">
              This link may be invalid or the card is no longer collecting
              messages.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/create">Create a card</Link>
        </Button>
      </main>
    </div>
  )
}
