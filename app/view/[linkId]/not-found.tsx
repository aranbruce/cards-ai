import Link from "next/link"
import { CardNotFoundPanel } from "@/components/card-not-found"
import { Button } from "@/components/ui/button"

export default function ViewCardNotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <CardNotFoundPanel
        description="This card may have been deleted or the link may be invalid."
        actions={
          <Button asChild>
            <Link href="/sign-up">Create your own card</Link>
          </Button>
        }
      />
    </main>
  )
}
