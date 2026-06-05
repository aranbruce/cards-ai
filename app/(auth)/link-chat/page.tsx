import type { Metadata } from "next"
import { LinkChatForm } from "@/components/auth/link-chat-form"
import { privatePageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = privatePageMetadata("Link chat")

export default function LinkChatPage() {
  return <LinkChatForm />
}
