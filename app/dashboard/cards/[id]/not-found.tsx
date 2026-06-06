import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CardNotFoundPanel } from "@/components/card-not-found"
import { Button } from "@/components/ui/button"

export default function DashboardCardNotFound() {
  return (
    <CardNotFoundPanel
      description="This card may have been deleted or you may not have permission to view it."
      actions={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ChevronLeft />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/create">Create a new card</Link>
          </Button>
        </div>
      }
    />
  )
}
