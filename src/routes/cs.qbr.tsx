import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/qbr")({
  component: () => (
    <HubStub
      title="QBR Builder"
      description="AI-drafted QBR decks built from product usage, support load, and outcomes."
      bullets={["Auto-summary from past quarter", "Outcome scorecard", "Roadmap alignment slides", "Export to PDF or Google Slides"]}
    />
  ),
});
