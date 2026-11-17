import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, Screen } from "@/components/app/shell";
import { Inbox } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { ADMIN } from "@/lib/pro/admin";

export const Route = createFileRoute("/admin/messages")({
  head: () => meta("Admin inbox", "Messages from patients and professionals to HOMIGO CARE admin."),
  component: () => (
    <>
      <AppHeader title="Admin inbox" subtitle="Patients and professionals" />
      <Screen>
        <Inbox me={ADMIN} group="admin" />
      </Screen>
    </>
  ),
});
