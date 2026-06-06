import { FileX2 } from "lucide-react"
import type { ReactNode } from "react"

type CardNotFoundPanelProps = {
  description: string
  actions: ReactNode
}

export function CardNotFoundPanel({
  description,
  actions,
}: CardNotFoundPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <FileX2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            Card not found
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {actions}
    </div>
  )
}
