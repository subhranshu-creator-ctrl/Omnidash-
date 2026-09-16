"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Check, Clock3, Pause, Play, Plus, Trash2, Bell, Workflow } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Badge, Button, Card, EmptyState, Input } from "@/components/ui"

type Mode = "calendar" | "reminders" | "automations"
type EventRow = { id: string; title: string; description: string | null; starts_at: string; ends_at: string; location: string | null }
type ReminderRow = { id: string; title: string; remind_at: string; recurrence: string | null; completed_at: string | null }
type AutomationRow = { id: string; name: string; trigger: string; condition: string | null; action: string; enabled: boolean }

const metadata: Record<Mode, { eyebrow: string; title: string; description: string }> = {
  calendar: { eyebrow: "Calendar", title: "Own your time.", description: "See upcoming commitments and keep your focus intentional." },
  reminders: { eyebrow: "Reminders", title: "Nothing slips through.", description: "Keep small but important things close at hand." },
  automations: { eyebrow: "Automations", title: "Let the busywork run itself.", description: "Create calm, repeatable systems for your work." },
}

export function PlanningWorkspace({ mode }: { mode: Mode }) {
  const [events, setEvents] = useState<EventRow[]>([])
  const [reminders, setReminders] = useState<ReminderRow[]>([])
  const [automations, setAutomations] = useState<AutomationRow[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return
    if (mode === "calendar") {
      const { data, error: queryError } = await supabase.from("calendar_events").select("id,title,description,starts_at,ends_at,location").order("starts_at")
      if (queryError) setError("We could not load your calendar.")
      else setEvents((data ?? []) as EventRow[])
    }
    if (mode === "reminders") {
      const { data, error: queryError } = await supabase.from("reminders").select("id,title,remind_at,recurrence,completed_at").order("remind_at")
      if (queryError) setError("We could not load your reminders.")
      else setReminders((data ?? []) as ReminderRow[])
    }
    if (mode === "automations") {
      const { data, error: queryError } = await supabase.from("automations").select("id,name,trigger,condition,action,enabled").order("created_at", { ascending: false })
      if (queryError) setError("Automations are not available yet. Connect the automation schema to enable them.")
      else setAutomations((data ?? []) as AutomationRow[])
    }
  }

  useEffect(() => { void load() }, [mode])

  async function addItem() {
    if (!title.trim()) return
    const supabase = createClient()
    setSaving(true); setError(null)
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setError("Sign in to save workspace items."); setSaving(false); return }
    const isoDate = date ? new Date(date).toISOString() : new Date(Date.now() + 3600000).toISOString()
    let result
    if (mode === "calendar") result = await supabase.from("calendar_events").insert({ user_id: auth.user.id, title: title.trim(), starts_at: isoDate, ends_at: new Date(new Date(isoDate).getTime() + 3600000).toISOString() })
    if (mode === "reminders") result = await supabase.from("reminders").insert({ user_id: auth.user.id, title: title.trim(), remind_at: isoDate })
    if (mode === "automations") result = await supabase.from("automations").insert({ user_id: auth.user.id, name: title.trim(), trigger: "Manual", action: "Create notification", enabled: true })
    if (result?.error) setError("Your item could not be saved. Please try again.")
    else { setTitle(""); setDate(""); await load() }
    setSaving(false)
  }

  async function remove(id: string) {
    const supabase = createClient()
    const table = mode === "calendar" ? "calendar_events" : mode === "reminders" ? "reminders" : "automations"
    const { error: queryError } = await supabase.from(table).delete().eq("id", id)
    if (queryError) setError("This item could not be deleted.")
    else await load()
  }

  async function toggleReminder(row: ReminderRow) {
    const supabase = createClient()
    const { error: queryError } = await supabase.from("reminders").update({ completed_at: row.completed_at ? null : new Date().toISOString() }).eq("id", row.id)
    if (queryError) setError("This reminder could not be updated.")
    else await load()
  }

  async function toggleAutomation(row: AutomationRow) {
    const supabase = createClient()
    const { error: queryError } = await supabase.from("automations").update({ enabled: !row.enabled }).eq("id", row.id)
    if (queryError) setError("This automation could not be updated.")
    else await load()
  }

  const c = metadata[mode]
  return <div className="mx-auto max-w-6xl">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Badge>{c.eyebrow}</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h1><p className="mt-2 text-muted-foreground">{c.description}</p></div></div>
    <Card className="mt-8 p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={mode === "automations" ? "Automation name" : `Add ${mode === "calendar" ? "an event" : "a reminder"}`} aria-label="Title" onKeyDown={(e) => { if (e.key === "Enter") void addItem() }} />{mode !== "automations" && <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} aria-label={mode === "calendar" ? "Event date" : "Reminder date"} />}<Button onClick={() => void addItem()} disabled={saving || !title.trim()}><Plus data-icon="inline-start" />Add</Button></div>{error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}</Card>
    <div className="mt-4 grid gap-3">{mode === "calendar" && (events.length ? events.map((item) => <Card key={item.id} className="flex items-center gap-4 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent"><CalendarDays /></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(item.starts_at).toLocaleString()} · 1 hour</p></div><Button variant="ghost" onClick={() => void remove(item.id)} aria-label={`Delete ${item.title}`}><Trash2 /></Button></Card>) : <EmptyState title="Your calendar is clear" description="Add your next event to see it here." />)}{mode === "reminders" && (reminders.length ? reminders.map((item) => <Card key={item.id} className="flex items-center gap-4 p-4"><Button variant="secondary" className="size-10 shrink-0 rounded-xl p-0" onClick={() => void toggleReminder(item)} aria-label={item.completed_at ? `Reopen ${item.title}` : `Complete ${item.title}`}>{item.completed_at ? <Check /> : <Bell />}</Button><div className="min-w-0 flex-1"><p className={item.completed_at ? "truncate font-medium line-through opacity-60" : "truncate font-medium"}>{item.title}</p><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Clock3 />{new Date(item.remind_at).toLocaleString()}</p></div><Button variant="ghost" onClick={() => void remove(item.id)} aria-label={`Delete ${item.title}`}><Trash2 /></Button></Card>) : <EmptyState title="No reminders yet" description="Capture the small things you do not want to forget." />)}{mode === "automations" && (automations.length ? automations.map((item) => <Card key={item.id} className="flex flex-wrap items-center gap-4 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent"><Workflow /></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.trigger} → {item.action}</p></div><Badge>{item.enabled ? "Active" : "Paused"}</Badge><Button variant="ghost" onClick={() => void toggleAutomation(item)} aria-label={`${item.enabled ? "Pause" : "Enable"} ${item.name}`}>{item.enabled ? <Pause /> : <Play />}</Button><Button variant="ghost" onClick={() => void remove(item.id)} aria-label={`Delete ${item.name}`}><Trash2 /></Button></Card>) : <EmptyState title="No automations yet" description="Start with a simple trigger and let OmniDash handle the repeatable work." />)}</div>
  </div>
}
