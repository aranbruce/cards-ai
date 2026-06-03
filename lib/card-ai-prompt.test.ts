import { describe, expect, it } from "vitest"
import {
  assembleHeadlineUserPrompt,
  HEADLINE_SYSTEM_PROMPT,
} from "@/app/api/generate-headline/prompt"
import {
  assembleMessageUserPrompt,
  MESSAGE_SYSTEM_PROMPT,
} from "@/app/api/generate-message/prompt"
import {
  assembleImageLeadingText,
  assembleImageUserPrompt,
} from "@/app/api/generate-image/prompt"
import { formatContextBlock, resolvePromptFields } from "@/lib/card-ai-prompt"

describe("resolvePromptFields", () => {
  it("maps recipient and userContext to prompt fields", () => {
    expect(
      resolvePromptFields({
        cardType: "birthday",
        recipientName: "Alex",
        tone: "Dry",
        userContext: "Loves hiking",
      }),
    ).toEqual({
      tone: "Dry",
      cardType: "birthday",
      addressedTo: "Alex",
      previousUserMessage: "Loves hiking",
    })
  })
})

describe("formatContextBlock", () => {
  it("omits empty optional fields", () => {
    expect(
      formatContextBlock({
        tone: "Warm",
        cardType: "birthday",
        addressedTo: "Alex",
        previousUserMessage: "Loves hiking",
      }),
    ).toBe(
      "Tone: Warm\nCard type: birthday\nAddressed to: Alex\nPrevious user message: Loves hiking",
    )
  })

  it("includes image placeholder lines when flags set", () => {
    const block = formatContextBlock(
      {
        cardType: "birthday",
        addressedTo: "Alex",
        userPrompt: "More watercolor",
      },
      { hasPreviousImage: true, hasAttachedImage: true },
    )
    expect(block).toContain("Previous image: (see image below)")
    expect(block).toContain("Attached image: (see image below)")
  })
})

describe("assembleHeadlineUserPrompt", () => {
  it("uses create suffix when no regen fields", () => {
    expect(
      assembleHeadlineUserPrompt({
        tone: "Warm",
        cardType: "birthday",
        addressedTo: "Alex",
      }),
    ).toContain("Write a headline for this card.")
  })

  it("uses regen suffix when userPrompt present", () => {
    expect(
      assembleHeadlineUserPrompt({
        cardType: "birthday",
        addressedTo: "Alex",
        cardTitle: "Happy Birthday!",
        userPrompt: "Make it shorter",
      }),
    ).toContain("Based on the user's request, write a new headline.")
  })

  it("exports a system prompt", () => {
    expect(HEADLINE_SYSTEM_PROMPT).toContain("creative greeting card writer")
  })
})

describe("assembleMessageUserPrompt", () => {
  it("appends regen suffix", () => {
    expect(
      assembleMessageUserPrompt({
        cardType: "birthday",
        addressedTo: "Alex",
        cardTitle: "Happy Birthday Alex",
        previousUserMessage: "Old note",
        userPrompt: "Warmer tone",
      }),
    ).toContain("Rewrite the note based on the user's request.")
  })

  it("exports the message system prompt", () => {
    expect(MESSAGE_SYSTEM_PROMPT).toContain("group greeting card")
  })
})

describe("assembleImageUserPrompt", () => {
  it("prepends cover art constraints", () => {
    expect(
      assembleImageUserPrompt(
        { cardType: "birthday", addressedTo: "Alex" },
        {},
      ),
    ).toContain(
      "Create a full-bleed illustration for a greeting card cover only.",
    )
  })

  it("builds leading text for refine flows", () => {
    expect(assembleImageLeadingText(true, true)).toContain(
      "Refine the existing card cover",
    )
  })

  it("includes headline constraints when cardTitle is set", () => {
    expect(
      assembleImageUserPrompt(
        {
          cardType: "birthday",
          addressedTo: "Alex",
          cardTitle: "Happy Birthday",
        },
        {},
      ),
    ).toContain("Headline (JSON string)")
  })
})
