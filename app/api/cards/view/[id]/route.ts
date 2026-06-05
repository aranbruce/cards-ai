import { NextRequest, NextResponse } from "next/server"
import { getPublicCardByLinkId } from "@/lib/public-card-view"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  void request
  try {
    const { id: linkId } = await params
    const result = await getPublicCardByLinkId(linkId)

    if (!result) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching card:", error)
    return NextResponse.json({ error: "Failed to fetch card" }, { status: 500 })
  }
}
