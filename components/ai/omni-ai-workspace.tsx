"use client"

import { FormEvent, useState } from "react"
import { ArrowUp, Bot, Loader2, Sparkles } from "lucide-react"
import { Button, Card, Input } from "@/components/ui"

const suggestions = ["What should I focus on today?", "Help me plan my day", "Summarize my recent priorities"]

export function OmniAIWorkspace() {
  const [message, setMessage] = useState("")
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextMessage = message.trim()
    if (!nextMessage || isLoading) return
    setIsLoading(true)
    setError("")
    setAnswer("")
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nextMessage }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setAnswer(data.answer)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-card via-card to-accent/30 p-5 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Bot aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Omni AI</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">How can I help?</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Ask for guidance, planning help, or a clear next step. Omni AI will be transparent about what it knows.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setMessage(suggestion)} className="rounded-full border bg-background/70 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{suggestion}</button>)}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="omni-message" className="sr-only">Message Omni AI</label>
          <Input id="omni-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Omni AI anything..." disabled={isLoading} />
          <Button type="submit" disabled={isLoading || !message.trim()} className="shrink-0">
            {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" /> : <ArrowUp aria-hidden="true" />}
            <span>{isLoading ? "Thinking" : "Ask Omni"}</span>
          </Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </Card>

      {answer && <Card className="p-5 sm:p-6"><div className="flex items-center gap-2 text-sm font-semibold"><Sparkles aria-hidden="true" className="text-primary" /> Omni AI</div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{answer}</p></Card>}
    </div>
  )
}
