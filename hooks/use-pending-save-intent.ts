"use client"

import { useSyncExternalStore } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { hasPendingCard as checkHasPendingCard } from "@/lib/pending-card-storage"

function pendingSaveFromSearchParams(
  searchParams: Pick<ReadonlyURLSearchParams, "get">,
) {
  return (
    searchParams.get("redirect") === "/create" &&
    searchParams.get("action") === "save"
  )
}

function subscribePendingCard(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === "pendingCard") {
      onStoreChange()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => window.removeEventListener("storage", onStorage)
}

/**
 * True when the user is in the create → auth flow (save draft after sign-in).
 * URL params are used for the first render so login/sign-up hydrate without mismatch;
 * localStorage is read via useSyncExternalStore for flows that omit query params.
 */
export function usePendingSaveIntent(
  searchParams: Pick<ReadonlyURLSearchParams, "get">,
) {
  const fromUrl = pendingSaveFromSearchParams(searchParams)
  const fromStorage = useSyncExternalStore(
    subscribePendingCard,
    checkHasPendingCard,
    () => false,
  )

  return fromUrl || fromStorage
}
