import { OmniAIWorkspace } from "@/components/ai/omni-ai-workspace"
import { Badge } from "@/components/ui"

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header>
        <Badge>Omni AI</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Think bigger. Move faster.</h1>
        <p className="mt-2 text-muted-foreground">Your intelligent layer for turning ideas into momentum.</p>
      </header>
      <OmniAIWorkspace />
    </div>
  )
}

