import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthPageHeaderProps = {
  title: string
  description?: ReactNode
  align?: "left" | "center"
  className?: string
}

export function AuthPageHeader({
  title,
  description,
  align = "left",
  className,
}: AuthPageHeaderProps) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center", className)}>
      <h1
        className={cn(
          "text-3xl tracking-tight",
          align === "center" ? "mb-2 font-extrabold" : "mb-1.5 font-semibold",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            align === "center"
              ? "text-muted-foreground"
              : "text-sm text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
