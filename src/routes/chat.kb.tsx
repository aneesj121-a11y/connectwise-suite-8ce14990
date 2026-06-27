import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/kb")({
  component: () => (
    <HubStub
      title="Knowledge Base"
      description="AI-curated KB with deflection analytics and gap detection."
      bullets={["Generative answer drafts", "Deflection rate per article", "Gap report from unresolved tickets", "Multi-locale"]}
    />
  ),
});
