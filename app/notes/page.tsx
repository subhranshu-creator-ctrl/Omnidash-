import { NotesWorkspace } from "@/components/notes/notes-workspace"
import { createClient } from "@/lib/supabase/server"

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = user ? await supabase.from("notes").select("id,title,content,is_pinned,is_favorite,updated_at").order("is_pinned", { ascending: false }).order("updated_at", { ascending: false }).limit(50) : { data: [] }
  return <NotesWorkspace initialNotes={data ?? []} />
}
