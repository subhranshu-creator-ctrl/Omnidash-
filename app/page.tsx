import Link from "next/link"
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckSquare,
  FileText,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react"
import { Badge, Button, Card } from "@/components/ui"

const features = [
  {
    icon: Sparkles,
    title: "Omni AI",
    description: "A thoughtful copilot that helps you understand the work already in front of you.",
  },
  {
    icon: Search,
    title: "OmniSearch",
    description: "Find tasks, notes, reminders, and ideas from one fast, universal search.",
  },
  {
    icon: CheckSquare,
    title: "Tasks",
    description: "Turn intention into momentum with a clear view of what matters next.",
  },
  {
    icon: FileText,
    title: "Notes",
    description: "Capture the thinking behind your work without losing the thread.",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description: "See your commitments alongside the work they support.",
  },
  {
    icon: Bell,
    title: "Reminders",
    description: "Keep important details close without adding noise to your day.",
  },
]

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 pb-16 pt-10 sm:gap-32 sm:pt-16">
      <section className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div>
          <Badge>
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
            Personal command center
          </Badge>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl">
            One dashboard.
            <span className="block text-muted-foreground">Everything under control.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Your tasks, notes, schedule, insights, and AI assistant — intelligently connected in one calm, focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button>
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="#overview">
              <Button variant="secondary">Explore OmniDash</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {["Calm by default", "Built for focus", "Private by design"].map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <Check className="size-4 text-accent-foreground" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden bg-card shadow-[0_24px_80px_rgba(16,24,40,.10)]">
          <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-3.5" />
              </span>
              Today
            </div>
            <span className="text-xs text-muted-foreground">Tuesday, Sep 16</span>
          </div>
          <div className="grid gap-4 p-4 sm:p-5">
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Good morning</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">A clear start to a meaningful day.</p>
                </div>
                <WandSparkles className="size-5 shrink-0 text-accent-foreground" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Focus queue</p>
                  <CheckSquare className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">3 items</p>
                <p className="mt-1 text-xs text-muted-foreground">Ready when you are</p>
              </div>
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Next up</p>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 truncate text-2xl font-semibold tracking-tight">Design review</p>
                <p className="mt-1 text-xs text-muted-foreground">In your calendar</p>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Ask Omni AI</p>
                  <p className="text-xs text-muted-foreground">What should I focus on today?</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section id="overview" className="scroll-mt-24">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-accent-foreground">See → Understand → Decide → Act</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">A calmer way to move through your day.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">OmniDash connects the pieces so your attention can stay on the next meaningful thing, not on keeping your tools in sync.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card className="p-5 transition-transform hover:-translate-y-0.5" key={title}>
              <span className="grid size-10 place-items-center rounded-xl bg-muted text-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-7 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary-foreground/70">Ready when you are</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Make space for the work that matters.</h2>
            <p className="mt-4 leading-7 text-primary-foreground/70">Start with a clear view of your day, then let OmniDash grow with you.</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-background text-foreground hover:bg-background/90">Open OmniDash <ArrowRight data-icon="inline-end" /></Button>
          </Link>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>OmniDash — one dashboard, everything under control.</p>
        <p>Phase 1 foundation</p>
      </footer>
    </div>
  )
}
