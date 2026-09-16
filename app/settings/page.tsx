import { Settings2 } from "lucide-react"
import { Badge, Card } from "@/components/ui"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: preferences } = user ? await supabase.from("user_preferences").select("theme,ai_enabled,notifications_enabled,personalization_enabled").maybeSingle() : { data: null }
  const rows = [["Appearance", `Theme: ${preferences?.theme ?? "system"}`], ["Omni AI", preferences?.ai_enabled === false ? "Disabled" : "Enabled"], ["Notifications", preferences?.notifications_enabled === false ? "Disabled" : "Enabled"], ["Personalization", preferences?.personalization_enabled === false ? "Disabled" : "Enabled"]]
  return <div className="mx-auto max-w-4xl"><Badge>Settings</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Make OmniDash yours.</h1><p className="mt-2 text-muted-foreground">Your preferences are private and stored with your workspace.</p><Card className="mt-8 divide-y overflow-hidden">{rows.map(([label, value]) => <div className="flex items-center gap-4 p-5" key={label}><div className="grid size-9 place-items-center rounded-xl bg-accent"><Settings2 className="size-4" /></div><div className="flex-1"><p className="font-medium">{label}</p><p className="mt-1 text-sm text-muted-foreground">{value}</p></div><span className="text-sm text-muted-foreground">Configure</span></div>)}</Card><p className="mt-4 text-xs text-muted-foreground">Interactive preference controls will be enabled alongside the profile and personalization workflow.</p></div>
}
