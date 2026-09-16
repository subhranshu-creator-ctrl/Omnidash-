import Link from "next/link"
import { ArrowRight, Bell, CalendarDays, CheckSquare, FileText, Plus, Sparkles } from "lucide-react"
import { Badge, Button, Card, EmptyState } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const today = new Date().toISOString()
  const [{ count: openCount }, { count: completedCount }, { count: reminderCount }, { count: eventCount }, { data: tasks }, { data: reminders }, { data: events }] = user ? await Promise.all([
    supabase.from("tasks").select("id", { count: "exact", head: true }).neq("status", "completed").neq("status", "archived"),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("reminders").select("id", { count: "exact", head: true }).gte("remind_at", today).is("completed_at", null),
    supabase.from("calendar_events").select("id", { count: "exact", head: true }).gte("starts_at", today),
    supabase.from("tasks").select("id,title,status,priority,due_at").neq("status", "completed").neq("status", "archived").order("due_at", { ascending: true, nullsFirst: false }).limit(5),
    supabase.from("reminders").select("id,title,remind_at").gte("remind_at", today).is("completed_at", null).order("remind_at", { ascending: true }).limit(3),
    supabase.from("calendar_events").select("id,title,starts_at").gte("starts_at", today).order("starts_at", { ascending: true }).limit(3),
  ]) : [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }, { data: [] }, { data: [] }, { data: [] }]
  const name = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "there"

  return <div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Badge>Overview</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, {name}.</h1><p className="mt-2 text-muted-foreground">Your calm command center for today.</p></div><Link href="/ai"><Button><Sparkles data-icon="inline-start" />Ask Omni AI</Button></Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card className="p-5"><p className="text-sm text-muted-foreground">Open tasks</p><p className="mt-3 text-3xl font-semibold">{openCount ?? 0}</p><p className="mt-2 text-sm text-muted-foreground">Work waiting for attention.</p></Card><Card className="p-5"><p className="text-sm text-muted-foreground">Completed</p><p className="mt-3 text-3xl font-semibold">{completedCount ?? 0}</p><p className="mt-2 text-sm text-muted-foreground">Progress recorded in your workspace.</p></Card><Card className="p-5"><p className="text-sm text-muted-foreground">Upcoming</p><p className="mt-3 text-3xl font-semibold">{eventCount ?? 0}</p><p className="mt-2 text-sm text-muted-foreground">Calendar events ahead.</p></Card><Card className="p-5"><p className="text-sm text-muted-foreground">Reminders</p><p className="mt-3 text-3xl font-semibold">{reminderCount ?? 0}</p><p className="mt-2 text-sm text-muted-foreground">Still on your radar.</p></Card></div><Card className="mt-4 p-5"><p className="text-sm font-semibold">Quick actions</p><div className="mt-3 flex flex-wrap gap-2"><Link href="/tasks"><Button variant="secondary"><Plus data-icon="inline-start" />Task</Button></Link><Link href="/notes"><Button variant="secondary"><FileText data-icon="inline-start" />Note</Button></Link><Link href="/calendar"><Button variant="secondary"><CalendarDays data-icon="inline-start" />Event</Button></Link><Link href="/reminders"><Button variant="secondary"><Bell data-icon="inline-start" />Reminder</Button></Link></div></Card>
    <Card className="mt-4 p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">What needs your attention</h2><p className="mt-1 text-sm text-muted-foreground">Your next five open tasks.</p></div><Link href="/tasks" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">View all <ArrowRight className="size-4" /></Link></div>{tasks && tasks.length > 0 ? <div className="mt-5 flex flex-col divide-y">{tasks.map((task) => <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={task.id}><CheckSquare className="size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{task.title}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{task.priority} priority · {task.status.replace("_", " ")}</p></div></div>)}</div> : <div className="mt-5"><EmptyState title="A clear runway" description="Add your first task and make progress visible." action={<Link href="/tasks"><Button>Open tasks</Button></Link>} /></div>}</Card>
  </div>
}
