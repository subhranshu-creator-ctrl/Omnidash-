import { Bell, Check } from "lucide-react"
import { Badge, Button, Card, EmptyState } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = user ? await supabase.from("notifications").select("id,title,body,category,is_read,priority,created_at").order("created_at", { ascending: false }).limit(50) : { data: [] }
  const notifications = data ?? []
  return <div className="mx-auto max-w-4xl"><Badge>Notifications</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Stay in the loop.</h1><p className="mt-2 text-muted-foreground">Important updates from your OmniDash workspace.</p><div className="mt-8 flex flex-col gap-3">{notifications.map((notification) => <Card className="flex items-start gap-3 p-4" key={notification.id}><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent"><Bell className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{notification.title}</p>{!notification.is_read && <Badge>New</Badge>}</div><p className="mt-1 text-sm text-muted-foreground">{notification.body ?? ""}</p><p className="mt-2 text-xs capitalize text-muted-foreground">{notification.category} · {new Date(notification.created_at).toLocaleString()}</p></div></Card>)}{notifications.length === 0 && <EmptyState title="You are all caught up" description="Notifications created by your tasks, reminders, and AI actions will appear here." action={<Button variant="secondary"><Check className="size-4" />All caught up</Button>} />}</div></div>
}
