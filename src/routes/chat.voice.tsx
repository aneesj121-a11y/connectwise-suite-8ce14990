import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/voice")({
  component: () => (
    <HubStub
      title="Voice & IVR"
      description="Voice flows, IVR design, and AI transcription with sentiment."
      bullets={["IVR visual builder", "AI transcription + summary", "Voicemail drop", "Quality scoring"]}
    />
  ),
});
