import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/sprints")({
  component: () => (
    <HubStub
      title="Active Sprints"
      description="Burndown, velocity, and AI forecast of sprint completion."
      bullets={["Burndown + ideal line", "Rolling velocity", "AI completion forecast", "Scope-creep detection"]}
    />
  ),
});
