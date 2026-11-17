import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, Screen } from "@/components/app/shell";
import { Inbox } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";

export const Route = createFileRoute("/pro/messages")({
  head: () =>
    meta(
      "Professional messages",
      "Chat with patients you are assigned to and with HOMIGO CARE admin.",
    ),
  component: ProMessages,
});
function ProMessages() {
  const { pro } = useProState();
  return (
    <>
      <AppHeader title="Messages" subtitle="Only your assigned patients and admin" />
      <Screen>
        <Inbox key={pro.id} me={{ id: pro.id, name: pro.name }} group="pros" />
      </Screen>
    </>
  );
}
