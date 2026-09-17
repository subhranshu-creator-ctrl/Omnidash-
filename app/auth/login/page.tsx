"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button, Card, Input } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) setError(error.message.toLowerCase().includes("confirm") ? "Please confirm your email before signing in." : "Invalid email or password.")
    else {
      const nextPath = new URLSearchParams(window.location.search).get("next")
      const destination = nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard"
      router.replace(destination)
      router.refresh()
    }
    setLoading(false)
  }

  return <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center py-10"><Card className="w-full p-6 sm:p-8"><div className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>OmniDash</div><div className="mt-8"><h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your command center.</p></div><form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">Email<Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">Password<Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="text-sm text-destructive" role="alert">{error}</p>}<Button className="mt-2 w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<ArrowRight data-icon="inline-end" /></Button></form><p className="mt-6 text-center text-sm text-muted-foreground">New to OmniDash? <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/auth/sign-up">Create an account</Link></p></Card></main>
}
