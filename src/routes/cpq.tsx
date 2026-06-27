import { createFileRoute } from "@tanstack/react-router";
import { CpqBuilder } from "@/components/cpq/CpqBuilder";
import { HubPage } from "@/components/hubs/page";
import { SAMPLE_QUOTE } from "@/lib/cpq/engine";

export const Route = createFileRoute("/cpq")({
  head: () => ({ meta: [{ title: "CPQ — Configure, Price, Quote" }] }),
  component: () => (
    <HubPage
      title="Configure, Price, Quote"
      description="Global CPQ workspace — used across Sales opportunities, Customer Success expansions, and Billing subscriptions."
    >
      <CpqBuilder initial={SAMPLE_QUOTE} />
    </HubPage>
  ),
});
