import { Button } from "@/components/ui/button"
import type { OAuthProviderId } from "@/lib/oauth-auth"

type AuthOAuthButtonsProps = {
  disabled?: boolean
  onProviderClick: (provider: OAuthProviderId) => void
}

export function AuthOAuthButtons({
  disabled,
  onProviderClick,
}: AuthOAuthButtonsProps) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => onProviderClick("google")}
          disabled={disabled}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => onProviderClick("github")}
          disabled={disabled}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="my-4 flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  )
}
