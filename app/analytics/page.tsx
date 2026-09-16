import { Activity, CheckCircle2, Clock3, FileText } from "lucide-react"
import { Badge, Card, EmptyState } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [tasks, completed, notes, activities] = user ? await Promise.all([
    supabase.from("tasks").select("id", { count: "exact", head: true }),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("notes").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
  ]) : [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }]
  const total = tasks.count ?? 0
  const completionRate = total ? Math.round(((completed.count ?? 0) / total) * 100) : 0
  const stats = [{ label: "Tasks completed", value: completed.count ?? 0, icon: CheckCircle2 }, { label: "Completion rate", value: `${completionRate}%`, icon: Activity }, { label: "Notes created", value: notes.count ?? 0, icon: FileText }, { label: "Activity, 7 days", value: activities.count ?? 0, icon: Clock3 }]
  return <div className="mx-auto max-w-6xl"><Badge>Analytics</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Understand your momentum.</h1><p className="mt-2 text-muted-foreground">A grounded view of activity recorded in your workspace.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card className="p-5" key={label}><Icon className="size-4 text-muted-foreground" /><p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></Card>)}</div><Card className="mt-4 p-6"><h2 className="font-semibold">Activity trends</h2><p className="mt-1 text-sm text-muted-foreground">Charts will use your real activity history as more events are recorded.</p>{(activities.count ?? 0) === 0 ? <div className="mt-5"><EmptyState title="No activity recorded yet" description="Complete a task or create a note to start building your productivity history." /></div> : <div className="mt-6 h-36 rounded-xl bg-muted/60" aria-label="Activity trend chart placeholder" />}</Card></div>
}
