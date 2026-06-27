import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/macros")({
  component: () => (
    <HubStub
      title="AI Macros"
      description="Canned responses with AI auto-suggest based on conversation context."
      bullets={["Top suggested macros per intent", "Macro authoring + variables", "A/B test macro variants", "Localization"]}
    />
  ),
});
