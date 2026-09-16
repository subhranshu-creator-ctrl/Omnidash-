import { Search, FileText, CheckSquare, Bell, CalendarDays } from "lucide-react"
import { Badge, Card, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim() ?? ""
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [tasks, notes, reminders, events] = user && query ? await Promise.all([
    supabase.from("tasks").select("id,title,status").ilike("title", `%${query}%`).limit(10),
    supabase.from("notes").select("id,title,content").or(`title.ilike.%${query}%,content.ilike.%${query}%`).limit(10),
    supabase.from("reminders").select("id,title,remind_at").ilike("title", `%${query}%`).limit(10),
    supabase.from("calendar_events").select("id,title,starts_at").ilike("title", `%${query}%`).limit(10),
  ]) : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }]
  const results = [
    ...(tasks.data ?? []).map((item) => ({ ...item, type: "Task", icon: CheckSquare })),
    ...(notes.data ?? []).map((item) => ({ ...item, type: "Note", icon: FileText })),
    ...(reminders.data ?? []).map((item) => ({ ...item, type: "Reminder", icon: Bell })),
    ...(events.data ?? []).map((item) => ({ ...item, type: "Event", icon: CalendarDays })),
  ]
  return <div className="mx-auto max-w-5xl"><Badge>Search</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Find anything, instantly.</h1><p className="mt-2 text-muted-foreground">Search across your private OmniDash workspace.</p><form className="relative mt-8" method="get"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input name="q" defaultValue={query} className="pl-9" placeholder="Search tasks, notes, reminders, and events" aria-label="Search workspace" /></form>{query ? <div className="mt-5 flex flex-col gap-3">{results.map((result) => { const Icon = result.icon; return <Card className="flex items-center gap-3 p-4" key={`${result.type}-${result.id}`}><Icon className="size-4 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{result.title}</p><p className="mt-1 text-xs text-muted-foreground">{result.type}</p></div></Card> })}{results.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">No results found for “{query}”.</Card>}</div> : <Card className="mt-5 p-8 text-center text-sm text-muted-foreground">Start typing to search your workspace.</Card>}</div>
}
