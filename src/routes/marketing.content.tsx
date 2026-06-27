import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/content")({
  component: () => (
    <HubStub
      title="Content Studio"
      description="AI content generation for email, landing pages, and ad creative — brand-tuned."
      bullets={["Brand voice profile", "Email + landing page generator", "Ad creative variants", "Reviewer workflow + approvals"]}
    />
  ),
});
