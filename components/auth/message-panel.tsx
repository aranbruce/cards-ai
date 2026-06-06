import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type AuthMessageAction = {
  href: string
  label: string
  variant?: "primary" | "outline"
}

type AuthMessagePanelProps = {
  title: string
  description: ReactNode
  actions: AuthMessageAction[]
}

export function AuthMessagePanel({
  title,
  description,
  actions,
}: AuthMessagePanelProps) {
  return (
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-muted-foreground">{description}</p>
      <div className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.href + action.label}
            asChild
            fullWidth
            variant={action.variant ?? "primary"}
            size="lg"
            className={
              action.variant === "outline"
                ? "border-border/50 hover:bg-secondary/50"
                : undefined
            }
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
