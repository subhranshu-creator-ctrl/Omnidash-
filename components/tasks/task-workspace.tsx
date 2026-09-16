"use client"

import { FormEvent, useMemo, useState } from "react"
import { Check, Plus, Search, Trash2 } from "lucide-react"
import { Badge, Button, Card, EmptyState, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

type Task = { id: string; title: string; status: string; priority: string; due_at: string | null }

export function TaskWorkspace({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState("")
  const [query, setQuery] = useState("")
  const [saving, setSaving] = useState(false)

  const visibleTasks = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())), [tasks, query])

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }
    const { data, error } = await supabase.from("tasks").insert({ user_id: user.id, title: title.trim(), status: "inbox", priority: "normal" }).select("id,title,status,priority,due_at").single()
    if (!error && data) {
      setTasks((current) => [data, ...current])
      setTitle("")
    }
    setSaving(false)
  }

  async function completeTask(task: Task) {
    const nextStatus = task.status === "completed" ? "inbox" : "completed"
    const { error } = await createClient().from("tasks").update({ status: nextStatus, completed_at: nextStatus === "completed" ? new Date().toISOString() : null }).eq("id", task.id)
    if (!error) setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status: nextStatus } : item))
  }

  async function deleteTask(id: string) {
    const { error } = await createClient().from("tasks").delete().eq("id", id)
    if (!error) setTasks((current) => current.filter((task) => task.id !== id))
  }

  return <div className="mx-auto max-w-5xl">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Badge>Tasks</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Make progress visible.</h1><p className="mt-2 text-muted-foreground">Your work, organized around what matters next.</p></div><Badge className="w-fit">{tasks.filter((task) => task.status !== "completed").length} open</Badge></div>
    <Card className="mt-8 p-4 sm:p-5"><form className="flex flex-col gap-3 sm:flex-row" onSubmit={addTask}><Input aria-label="New task title" placeholder="What needs your attention?" value={title} onChange={(event) => setTitle(event.target.value)} /><Button disabled={saving || !title.trim()}><Plus data-icon="inline-start" />{saving ? "Adding..." : "Add task"}</Button></form><div className="relative mt-4"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search tasks" className="pl-9" placeholder="Filter tasks" value={query} onChange={(event) => setQuery(event.target.value)} /></div></Card>
    <div className="mt-4 flex flex-col gap-3">{visibleTasks.map((task) => <Card key={task.id} className="flex items-center gap-3 p-4"><button aria-label={task.status === "completed" ? `Reopen ${task.title}` : `Complete ${task.title}`} className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors ${task.status === "completed" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} onClick={() => completeTask(task)}><Check className="size-4" /></button><div className="min-w-0 flex-1"><p className={`truncate text-sm font-medium ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}>{task.title}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{task.priority} priority · {task.status.replace("_", " ")}</p></div><button aria-label={`Delete ${task.title}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive" onClick={() => deleteTask(task.id)}><Trash2 className="size-4" /></button></Card>)}{visibleTasks.length === 0 && <EmptyState title={query ? "No matching tasks" : "Your task list is clear"} description={query ? "Try a different search." : "Add a task to create momentum."} />}</div>
  </div>
}
