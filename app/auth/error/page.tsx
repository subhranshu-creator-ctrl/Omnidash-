import Link from "next/link"
import { Button, Card } from "@/components/ui"

export default function AuthErrorPage() {
  return <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center py-10"><Card className="w-full p-6 text-center sm:p-8"><h1 className="text-2xl font-semibold tracking-tight">That link could not be verified</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">The confirmation link may have expired. Start again or return to sign in.</p><div className="mt-6 flex justify-center gap-3"><Link href="/auth/sign-up"><Button>Try again</Button></Link><Link href="/auth/login"><Button variant="secondary">Sign in</Button></Link></div></Card></main>
}
