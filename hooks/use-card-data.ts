"use client"

import { useEffect, useRef, useState } from "react"
import type { Contribution } from "@/lib/card-body"
import type { OwnerCard } from "@/components/card-owner-studio"
import { ApiError, apiFetch } from "@/lib/api-client"
import {
  type ApiContribution,
  normalizeContributionFromApi,
} from "@/lib/contribution-layout"
import type { OwnerCardDetail } from "@/lib/owner-cards"

function contributionsFromApi(
  list: ApiContribution[] | undefined,
): Contribution[] {
  return (list ?? []).map(normalizeContributionFromApi)
}

function snapshotIsComplete(snapshot?: OwnerCardDetail): boolean {
  return !!snapshot && snapshot.contributionsLoaded !== false
}

export function useCardData(
  cardId: string,
  reloadNonce?: number,
  initialSnapshot?: OwnerCardDetail,
) {
  const skipInitialFetchRef = useRef(snapshotIsComplete(initialSnapshot))
  const hadPartialSnapshotRef = useRef(
    !!initialSnapshot && initialSnapshot.contributionsLoaded === false,
  )
  const [card, setCard] = useState<OwnerCard | null>(
    () => initialSnapshot?.card ?? null,
  )
  const [contributions, setContributions] = useState<Contribution[]>(() =>
    initialSnapshot ? contributionsFromApi(initialSnapshot.contributions) : [],
  )
  const [displayExtraPages, setDisplayExtraPages] = useState(() =>
    initialSnapshot ? initialSnapshot.displayExtraPages : 0,
  )
  const [contributionsLoaded, setContributionsLoaded] = useState(() =>
    initialSnapshot ? initialSnapshot.contributionsLoaded : true,
  )
  const [unusedExtraPagesDetected, setUnusedExtraPagesDetected] = useState(
    () => initialSnapshot?.unusedExtraPagesDetected ?? false,
  )
  const [loading, setLoading] = useState(!snapshotIsComplete(initialSnapshot))
  const [error, setError] = useState("")

  useEffect(() => {
    if (skipInitialFetchRef.current && reloadNonce === undefined) {
      skipInitialFetchRef.current = false
      return
    }

    let cancelled = false
    const refreshingPartialSnapshot =
      reloadNonce === undefined && hadPartialSnapshotRef.current
    if (hadPartialSnapshotRef.current) {
      hadPartialSnapshotRef.current = false
    }

    void (async () => {
      setLoading(true)
      setError("")
      if (!refreshingPartialSnapshot) {
        setCard(null)
        setContributions([])
        setDisplayExtraPages(0)
        setContributionsLoaded(false)
        setUnusedExtraPagesDetected(false)
      }
      try {
        const {
          card: c,
          contributions: list,
          contributionsLoaded,
          displayExtraPages: display,
          unusedExtraPagesDetected: unused,
        } = await apiFetch<{
          card: OwnerCard
          contributions?: ApiContribution[]
          contributionsLoaded?: boolean
          displayExtraPages?: number
          unusedExtraPagesDetected?: boolean
        }>(`/api/cards/${encodeURIComponent(cardId)}`, { cache: "no-store" })
        if (cancelled) return
        setCard(c)
        setContributions(contributionsFromApi(list))
        setContributionsLoaded(contributionsLoaded !== false)
        setDisplayExtraPages(
          typeof display === "number" && Number.isFinite(display)
            ? Math.max(0, Math.trunc(display))
            : (c.extra_pages ?? 0),
        )
        setUnusedExtraPagesDetected(unused === true)
      } catch (e) {
        if (cancelled) return
        setContributions([])
        setContributionsLoaded(false)
        setDisplayExtraPages(0)
        setUnusedExtraPagesDetected(false)
        const message =
          e instanceof ApiError && e.status === 401
            ? "You need to be signed in to open this card."
            : e instanceof Error
              ? e.message
              : "Failed to load"
        setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [cardId, reloadNonce])

  return {
    card,
    setCard,
    contributions,
    setContributions,
    displayExtraPages,
    setDisplayExtraPages,
    contributionsLoaded,
    unusedExtraPagesDetected,
    loading,
    error,
  }
}
