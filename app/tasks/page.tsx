import { TaskWorkspace } from "@/components/tasks/task-workspace"
import { createClient } from "@/lib/supabase/server"

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = user ? await supabase.from("tasks").select("id,title,status,priority,due_at").order("created_at", { ascending: false }) : { data: [] }
  return <TaskWorkspace initialTasks={data ?? []} />
}
