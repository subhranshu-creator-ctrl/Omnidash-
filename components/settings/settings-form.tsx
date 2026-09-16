"use client"

import { useState } from "react"
import { Button, Card } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

type Preferences = {
  theme: "light" | "dark" | "system"
  ai_enabled: boolean
  notifications_enabled: boolean
  personalization_enabled: boolean
}

export function SettingsForm({ initial }: { initial: Preferences }) {
  const [preferences, setPreferences] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function update(next: Partial<Preferences>) {
    setSaving(true)
    setSaved(false)
    const updated = { ...preferences, ...next }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }
    const { error } = await supabase.from("user_preferences").upsert({ ...updated, user_id: user.id })
    if (!error) {
      setPreferences(updated)
      setSaved(true)
    }
    setSaving(false)
  }

  return (
    <Card className="mt-8 divide-y overflow-hidden">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-medium">Appearance</p><p className="mt-1 text-sm text-muted-foreground">Choose how OmniDash looks on this device.</p></div>
        <div className="flex gap-2" role="group" aria-label="Theme">
          {(["light", "dark", "system"] as const).map((theme) => <Button key={theme} type="button" variant={preferences.theme === theme ? "secondary" : "ghost"} className="capitalize" onClick={() => update({ theme })}>{theme}</Button>)}
        </div>
      </div>
      {([
        ["ai_enabled", "Omni AI", "Allow Omni AI features to use your workspace context."],
        ["notifications_enabled", "Notifications", "Receive useful task, reminder, and calendar updates."],
        ["personalization_enabled", "Personalization", "Use non-sensitive activity signals to improve suggestions."],
      ] as const).map(([key, title, description]) => <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between" key={key}><div><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><Button type="button" variant={preferences[key] ? "secondary" : "ghost"} onClick={() => update({ [key]: !preferences[key] })} aria-pressed={preferences[key]}>{preferences[key] ? "Enabled" : "Disabled"}</Button></div>)}
      <div className="flex items-center justify-between gap-4 p-5"><p className="text-xs text-muted-foreground" aria-live="polite">{saving ? "Saving…" : saved ? "Preferences saved." : "Changes save automatically."}</p><Button type="button" variant="ghost" onClick={() => update({ theme: "system", ai_enabled: true, notifications_enabled: true, personalization_enabled: true })}>Restore defaults</Button></div>
    </Card>
  )
}

export type { Preferences }
