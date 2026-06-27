import { createFileRoute } from "@tanstack/react-router";
import { HelpDeskInbox } from "@/components/help-desk-inbox";

export const Route = createFileRoute("/support/helpdesk")({
  head: () => ({ meta: [{ title: "Support Center — Help Desk" }] }),
  component: HelpDeskInbox,
});
