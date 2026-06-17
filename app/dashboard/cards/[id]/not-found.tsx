import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EmptyContent } from "@/components/empty-content"
import { Button } from "@/components/ui/button"

export default function DashboardCardNotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <EmptyContent
        description="This card may have been deleted or you may not have permission to view it."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <ArrowLeft />
                Back to dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/create">Create a new card</Link>
            </Button>
          </div>
        }
      />
    </main>
  )
}
