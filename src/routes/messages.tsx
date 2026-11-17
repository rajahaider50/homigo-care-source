import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, Screen } from "@/components/app/shell";
import { Inbox } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { PATIENT_ID } from "@/lib/pro/seed";

export const Route = createFileRoute("/messages")({
  head: () =>
    meta(
      "Messages",
      "Chat with your booked professional or HOMIGO CARE admin about bookings and care.",
    ),
  component: Messages,
});
function Messages() {
  const { patients } = useProState();
  const me = patients.find((p) => p.id === PATIENT_ID)!;
  return (
    <>
      <AppHeader title="Messages" subtitle="Your professionals and HOMIGO CARE" />
      <Screen>
        <Inbox me={{ id: me.id, name: me.name }} group="patients" />
      </Screen>
    </>
  );
}
