"use client"

import { FormEvent, useState } from "react"
import { Check, Command, Loader2, Plus, ShieldCheck, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button, Card, Input } from "@/components/ui"

type Action = { type: "task" | "reminder"; title: string }

function parseAction(value: string): Action | null {
  const input = value.trim()
  const taskMatch = input.match(/^(?:create|add)\s+(?:a\s+)?task\s*:??\s*(.+)$/i)
  if (taskMatch?.[1]) return { type: "task", title: taskMatch[1].trim() }
  const reminderMatch = input.match(/^(?:create|add)\s+(?:a\s+)?reminder\s*:??\s*(.+)$/i)
  if (reminderMatch?.[1]) return { type: "reminder", title: reminderMatch[1].trim() }
  return null
}

export function OmniCommandWorkspace() {
  const [input, setInput] = useState("")
  const [action, setAction] = useState<Action | null>(null)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function preview(event: FormEvent) {
    event.preventDefault()
    setError("")
    setStatus("")
    const nextAction = parseAction(input)
    if (!nextAction) {
      setAction(null)
      setError("Try “create task: Prepare weekly review” or “create reminder: Call Alex”.")
      return
    }
    setAction(nextAction)
  }

  async function confirm() {
    if (!action || saving) return
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Sign in before confirming an action.")
      setSaving(false)
      return
    }
    const table = action.type === "task" ? "tasks" : "reminders"
    const payload = action.type === "task"
      ? { user_id: user.id, title: action.title, status: "inbox", priority: "normal" }
      : { user_id: user.id, title: action.title, remind_at: new Date(Date.now() + 3600000).toISOString() }
    const { error: insertError } = await supabase.from(table).insert(payload)
    if (insertError) setError("The action could not be saved. Please try again.")
    else {
      setStatus(`${action.type === "task" ? "Task" : "Reminder"} created successfully.`)
      setInput("")
      setAction(null)
    }
    setSaving(false)
  }

  return <div className="mx-auto w-full max-w-3xl">
    <Card className="border-primary/15 bg-gradient-to-br from-card to-accent/30 p-5 sm:p-8">
      <div className="flex items-start gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Command aria-hidden="true" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Omni Command</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Turn intent into action.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Commands are previewed first. Nothing changes until you confirm it.</p></div></div>
      <form onSubmit={preview} className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="omni-command">Enter a command</label><Input id="omni-command" value={input} onChange={(event) => setInput(event.target.value)} placeholder="create task: Prepare weekly review" disabled={saving} /><Button type="submit" disabled={!input.trim() || saving}><Plus data-icon="inline-start" />Preview</Button></form>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      {status && <p role="status" className="mt-3 text-sm text-primary">{status}</p>}
    </Card>
    {action && <Card className="mt-4 border-primary/20 p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ready to confirm</p><p className="mt-2 font-medium">Create {action.type}: {action.title}</p><p className="mt-1 text-sm text-muted-foreground">{action.type === "reminder" ? "This reminder will be set for one hour from now." : "This task will be added to your inbox with normal priority."}</p><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => void confirm()} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Check />} {saving ? "Saving" : "Confirm action"}</Button><Button variant="ghost" onClick={() => setAction(null)} disabled={saving}><X />Cancel</Button></div></div></div></Card>}
  </div>
}
