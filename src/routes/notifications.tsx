import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, Screen } from "@/components/app/shell";
import { NoticeList } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { PATIENT_ID } from "@/lib/pro/seed";

export const Route = createFileRoute("/notifications")({
  head: () =>
    meta("Notifications", "Booking updates, messages and announcements from HOMIGO CARE."),
  component: () => (
    <>
      <AppHeader title="Notifications" subtitle="Bookings, messages and announcements" />
      <Screen>
        <NoticeList meId={PATIENT_ID} group="patients" limit={50} />
      </Screen>
    </>
  ),
});
