import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/site")({
  head: () => ({
    meta: [
      { title: "Limnn — Take control. One platform. Less software spend." },
      {
        name: "description",
        content:
          "Limnn replaces 12+ SaaS tools — CRM, dialer, support, billing, HRIS, LMS — under one AI-native operating system.",
      },
      { property: "og:title", content: "Limnn — One platform. Less spend." },
      {
        property: "og:description",
        content:
          "Replace point-tool sprawl with a single AI-native platform for revenue, service, finance and people teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SiteLayout,
});

function SiteLayout() {
  return <Outlet />;
}
