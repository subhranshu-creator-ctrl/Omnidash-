"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button, Card, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    const { data, error } = await createClient().auth.signUp({ email, password, options: { data: { display_name: displayName }, emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` } })
    if (error) setError(error.message.toLowerCase().includes("password") ? "Choose a stronger password." : "We couldn't create your account. Please check your details.")
    else if (data.session) router.push("/dashboard")
    else setSent(true)
    setLoading(false)
  }

  return <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center py-10"><Card className="w-full p-6 sm:p-8"><div className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>OmniDash</div>{sent ? <div className="mt-8"><h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">We sent a confirmation link to {email}. Confirm your email to activate your workspace.</p><Link className="mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline" href="/auth/login">Return to sign in</Link></div> : <><div className="mt-8"><h1 className="text-2xl font-semibold tracking-tight">Create your workspace</h1><p className="mt-2 text-sm text-muted-foreground">A clear place for everything that needs your attention.</p></div><form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="display-name">Name<Input id="display-name" autoComplete="name" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">Email<Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">Password<Input id="password" type="password" minLength={8} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="text-sm text-destructive" role="alert">{error}</p>}<Button className="mt-2 w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}<ArrowRight data-icon="inline-end" /></Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/auth/login">Sign in</Link></p></>}</Card></main>
}
