import Link from "next/link"
import { EmptyContent } from "@/components/empty-content"
import { Button } from "@/components/ui/button"

export default function ViewCardNotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <EmptyContent
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
