import type { Metadata } from "next"
import { Badge } from "@/components/ui"
import { ProfileForm } from "@/components/profile/profile-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Profile | OmniDash", description: "Manage your OmniDash profile." }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from("profiles").select("display_name,timezone").eq("id", user.id).maybeSingle() : { data: null }
  return <div className="mx-auto max-w-4xl"><Badge>Profile</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your workspace identity.</h1><p className="mt-2 text-muted-foreground">Keep your name and timezone current across OmniDash.</p>{user ? <ProfileForm initialName={profile?.display_name ?? user.email?.split("@")[0] ?? ""} initialTimezone={profile?.timezone ?? "UTC"} email={user.email ?? ""} /> : <p className="mt-8 text-sm text-muted-foreground">Sign in to manage your profile.</p>}</div>
}
