import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { z } from "zod"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
})

export async function POST(request: Request) {
  try {
    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ error: "Enter a message to continue." }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "Add GEMINI_API_KEY to the Vercel environment, then redeploy." }, { status: 503 })
    }

    const google = createGoogleGenerativeAI({ apiKey })
    const result = await generateText({
      model: google("gemini-3.6-flash"),
      system: "You are Omni AI, the focused assistant inside OmniDash. Be concise, practical, and honest. You only know the user's request and must not claim to have accessed tasks, notes, calendars, or other private data unless it was explicitly provided in the conversation. Suggest actions, but do not claim to have completed them.",
      prompt: parsed.data.message,
      maxOutputTokens: 700,
    })

    return Response.json({ answer: result.text })
  } catch (error) {
    console.error("[v0] Omni AI request failed", error)
    const message = error instanceof Error ? error.message : "Unknown provider error"
    const isAuthError = /api key|unauthorized|401|403|permission/i.test(message)
    return Response.json({
      error: isAuthError ? "Gemini rejected the API key. Check that it is active and enabled for the deployment." : "Gemini could not respond right now. Please try again.",
    }, { status: isAuthError ? 502 : 502 })
  }
}
