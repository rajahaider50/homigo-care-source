import { createFileRoute } from "@tanstack/react-router";
import { AppHeader, Card, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { fmtStamp } from "@/lib/pro/labels";
import { FIELD_LABEL } from "@/lib/pro/platform";

export const Route = createFileRoute("/admin/audit")({
  head: () =>
    meta("Audit log", "Administrative actions and who accessed patient records, when and why."),
  component: Audit,
});
function Audit() {
  const { audit, accessLog } = useProState();
  return (
    <>
      <AppHeader title="Audit log" subtitle="Admin actions and record access" />
      <Screen>
        <SectionTitle>Patient record access</SectionTitle>
        <Card className="space-y-2.5">
          {accessLog.length === 0 && (
            <p className="text-[14px] text-muted-foreground">No record access yet.</p>
          )}
          {accessLog.map((a) => (
            <div key={a.id}>
              <p className="text-[14px] text-foreground">
                {a.by} ({a.byRole}) viewed {a.member}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {a.fields.map((f) => FIELD_LABEL[f]).join(", ")} · {a.purpose} · {fmtStamp(a.at)}
              </p>
            </div>
          ))}
        </Card>
        <SectionTitle>Admin actions</SectionTitle>
        <Card className="space-y-2.5">
          {audit.length === 0 && (
            <p className="text-[14px] text-muted-foreground">No admin actions yet.</p>
          )}
          {audit.map((a) => (
            <div key={a.id}>
              <p className="text-[14px] text-foreground">{a.action}</p>
              <p className="text-[12px] text-muted-foreground">
                {a.by} · {a.context} · {fmtStamp(a.at)}
              </p>
            </div>
          ))}
        </Card>
      </Screen>
    </>
  );
}
