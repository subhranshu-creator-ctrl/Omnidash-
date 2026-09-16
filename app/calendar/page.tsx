import type { Metadata } from "next"
import { PlanningWorkspace } from "@/components/planning/planning-workspace"

export const metadata: Metadata = {
  title: "Calendar | OmniDash",
  description: "Plan your time in OmniDash.",
}

export default function Page() {
  return <PlanningWorkspace mode="calendar" />
}
