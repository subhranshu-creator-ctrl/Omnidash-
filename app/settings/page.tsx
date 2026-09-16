import { Settings2 } from "lucide-react"
import { Badge } from "@/components/ui"
import { SettingsForm, type Preferences } from "@/components/settings/settings-form"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: preferences } = user ? await supabase.from("user_preferences").select("theme,ai_enabled,notifications_enabled,personalization_enabled").maybeSingle() : { data: null }
  const initial: Preferences = {
    theme: (preferences?.theme as Preferences["theme"]) ?? "system",
    ai_enabled: preferences?.ai_enabled ?? true,
    notifications_enabled: preferences?.notifications_enabled ?? true,
    personalization_enabled: preferences?.personalization_enabled ?? true,
  }
  return <div className="mx-auto max-w-4xl"><Badge>Settings</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Make OmniDash yours.</h1><p className="mt-2 text-muted-foreground">Your preferences are private and stored with your workspace.</p>{user ? <SettingsForm initial={initial} /> : <div className="mt-8 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground"><Settings2 className="mx-auto size-5" /><p className="mt-3">Sign in to manage your preferences.</p></div>}</div>
}
