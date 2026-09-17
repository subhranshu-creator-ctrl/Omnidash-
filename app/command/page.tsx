import { Badge } from "@/components/ui"
import { OmniCommandWorkspace } from "@/components/command/omni-command-workspace"

export const metadata = {
  title: "Omni Command | OmniDash",
  description: "Turn clear intent into confirmed workspace actions.",
}

export default function Page() {
  return <div className="mx-auto w-full max-w-6xl"><Badge>Omni Command</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your workspace, at your command.</h1><p className="mt-2 text-muted-foreground">Create tasks and reminders with a deliberate confirmation step.</p><div className="mt-8"><OmniCommandWorkspace /></div></div>
}
