"use client"

import { FormEvent, useMemo, useState } from "react"
import { FileText, Pin, Plus, Search, Trash2 } from "lucide-react"
import { Badge, Button, Card, EmptyState, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

type Note = { id: string; title: string; content: string; is_pinned: boolean; is_favorite: boolean; updated_at: string }

export function NotesWorkspace({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [query, setQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const visibleNotes = useMemo(() => notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())), [notes, query])

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const { data, error } = await createClient().from("notes").insert({ title: title.trim(), content: content.trim() }).select("id,title,content,is_pinned,is_favorite,updated_at").single()
    if (!error && data) { setNotes((current) => [data, ...current]); setTitle(""); setContent("") }
    setSaving(false)
  }

  async function togglePin(note: Note) {
    const { error } = await createClient().from("notes").update({ is_pinned: !note.is_pinned }).eq("id", note.id)
    if (!error) setNotes((current) => current.map((item) => item.id === note.id ? { ...item, is_pinned: !item.is_pinned } : item))
  }

  async function deleteNote(id: string) {
    const { error } = await createClient().from("notes").delete().eq("id", id)
    if (!error) setNotes((current) => current.filter((item) => item.id !== id))
  }

  return <div className="mx-auto max-w-5xl">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Badge>Notes</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Capture what matters.</h1><p className="mt-2 text-muted-foreground">Keep ideas, decisions, and reference material close.</p></div><Badge className="w-fit">{notes.length} notes</Badge></div>
    <Card className="mt-8 p-4 sm:p-5"><form className="flex flex-col gap-3" onSubmit={addNote}><Input aria-label="Note title" placeholder="Note title" value={title} onChange={(event) => setTitle(event.target.value)} /><textarea aria-label="Note content" className="min-h-24 w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="Capture a thought..." value={content} onChange={(event) => setContent(event.target.value)} /><div className="flex justify-end"><Button disabled={saving || !title.trim()}><Plus data-icon="inline-start" />{saving ? "Saving..." : "Create note"}</Button></div></form><div className="relative mt-4"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search notes" className="pl-9" placeholder="Search notes" value={query} onChange={(event) => setQuery(event.target.value)} /></div></Card>
    <div className="mt-4 grid gap-3 md:grid-cols-2">{visibleNotes.map((note) => <Card key={note.id} className="flex flex-col gap-4 p-5"><div className="flex items-start gap-3"><FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><h2 className="truncate font-medium">{note.title}</h2><p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{note.content || "No content yet."}</p></div></div><div className="flex items-center justify-between border-t pt-3"><span className="text-xs text-muted-foreground">{new Date(note.updated_at).toLocaleDateString()}</span><div className="flex gap-1"><button aria-label={`${note.is_pinned ? "Unpin" : "Pin"} ${note.title}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => togglePin(note)}><Pin className={note.is_pinned ? "size-4 fill-current" : "size-4"} /></button><button aria-label={`Delete ${note.title}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive" onClick={() => deleteNote(note.id)}><Trash2 className="size-4" /></button></div></div></Card>)}{visibleNotes.length === 0 && <div className="md:col-span-2"><EmptyState title={query ? "No matching notes" : "Your notes are waiting"} description={query ? "Try a different search." : "Create a note to keep your thinking organized."} /></div>}</div>
  </div>
}

export type { Note }

