import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/routing")({
  component: () => (
    <HubStub
      title="Smart Routing"
      description="Skill-based, language-aware, and AI-intent routing rules."
      bullets={["Skill matrix", "Language detection", "AI intent → queue mapping", "Round robin + load balancing"]}
    />
  ),
});
