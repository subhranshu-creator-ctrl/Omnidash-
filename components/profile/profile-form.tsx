"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button, Card, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

type ProfileFormProps = { initialName: string; initialTimezone: string; email: string }

export function ProfileForm({ initialName, initialTimezone, email }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialName)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setStatus("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus("Your session expired. Please sign in again.")
      setSaving(false)
      return
    }
    const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: displayName.trim(), timezone })
    setStatus(error ? error.message : "Profile saved.")
    setSaving(false)
  }

  return <Card className="mt-8 max-w-2xl p-5 sm:p-7"><form onSubmit={save} className="space-y-5"><div><label className="text-sm font-medium" htmlFor="profile-email">Email</label><Input id="profile-email" className="mt-2" value={email} disabled /></div><div><label className="text-sm font-medium" htmlFor="display-name">Display name</label><Input id="display-name" className="mt-2" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} required /></div><div><label className="text-sm font-medium" htmlFor="timezone">Timezone</label><Input id="timezone" className="mt-2" value={timezone} onChange={(event) => setTimezone(event.target.value)} maxLength={80} required /></div><div className="flex items-center gap-3"><Button type="submit" disabled={saving || !displayName.trim()}>{saving ? <Loader2 className="animate-spin" /> : <Check />}Save profile</Button>{status && <p className="text-sm text-muted-foreground" role="status">{status}</p>}</div></form></Card>
}
