import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarClock,
  MapPin,
  History,
  FileCheck2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { useProState, act } from "@/lib/pro/store";
import { fmtDate, fmtStamp, requestLabel } from "@/lib/pro/labels";
import {
  notice,
  viewPatientInfo,
  allowedFields,
  FIELD_LABEL,
  type RecordField,
} from "@/lib/pro/platform";
import { startThread } from "@/components/app/panels";
import { useNavigate } from "@tanstack/react-router";
import {
  acceptRequest,
  amendNotes,
  canProvide,
  markDelivered,
  rejectRequest,
  submitNotes,
  type ServiceNoteFields,
} from "@/lib/pro/rules";

export const Route = createFileRoute("/pro/requests/$id")({
  head: () =>
    meta(
      "Request details",
      "Accept or decline a request, record the visit and submit the required service notes.",
    ),
  component: RequestDetail,
});

const empty: ServiceNoteFields = {
  serviceDelivered: "",
  observations: "",
  procedures: "",
  response: "",
  followUp: "",
  escalation: "",
};
const fields: [keyof ServiceNoteFields, string, boolean][] = [
  ["serviceDelivered", "Service delivered", true],
  ["observations", "Relevant observations", true],
  ["procedures", "Care / procedures performed", false],
  ["response", "Patient response or outcome", false],
  ["followUp", "Follow-up advice (within your scope)", false],
  ["escalation", "Concern to escalate to the clinical team", false],
];

function RequestDetail() {
  const { id } = Route.useParams();
  const { pro, requests } = useProState();
  const nav = useNavigate();
  const [info, setInfo] = useState<Partial<Record<RecordField, string>> | null>(null);
  const r = requests.find((x) => x.id === id);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [form, setForm] = useState<ServiceNoteFields>(empty);
  const [amending, setAmending] = useState(false);
  const [reason, setReason] = useState("");
  if (!r)
    return (
      <>
        <AppHeader title="Request" />
        <Screen>
          <p className="text-center text-muted-foreground">Request not found.</p>
          <Link to="/pro/requests" className="block text-center font-semibold text-primary">
            Back to requests
          </Link>
        </Screen>
      </>
    );

  const run = (fn: Parameters<typeof act>[0], ok: string, after?: () => void) => {
    const e = act(fn);
    setMsg(e ? { ok: false, t: e } : { ok: true, t: ok });
    if (!e) after?.();
  };
  const latest = r.notes.at(-1);
  const tell = (s: { notices: ReturnType<typeof notice>[] }, title: string) =>
    r.patientId
      ? [
          notice(
            r.patientId,
            title,
            `${r.service} for ${r.patientName} · ${fmtDate(r.date)} ${r.start}`,
            pro.name,
          ),
          ...s.notices,
        ]
      : s.notices;
  const fieldsAllowed = allowedFields(r, pro);
  const mine = r.assignedTo === pro.id;
  const l = requestLabel[r.status];
  const noteForm = (
    <Card className="space-y-2.5">
      {fields.map(([k, label, req]) => (
        <label key={k} className="block">
          <span className="text-[13px] font-semibold text-primary-deep">
            {label}
            {req && <span className="text-destructive"> *</span>}
          </span>
          <textarea
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-xl bg-muted px-3 py-2 text-[14px] outline-none ring-primary focus:ring-2"
          />
        </label>
      ))}
      <p className="text-[12px] text-muted-foreground">
        Record only care within your scope. No independent diagnosis, prescribing or treatment
        changes.
      </p>
    </Card>
  );

  return (
    <>
      <AppHeader title={r.service} subtitle={`${r.patientName} · ${l.t}`} />
      <Screen>
        <Card className="space-y-2">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold ${l.tone}`}
          >
            {l.t}
          </span>
          <p className="flex items-center gap-2 text-[15px] text-foreground">
            <CalendarClock className="h-5 w-5 text-primary" />
            {fmtDate(r.date)} · {r.start} · {r.durationMin} min
          </p>
          <p className="flex items-center gap-2 text-[15px] text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            {r.status === "pending" ? r.area.split(",").slice(-1)[0]?.trim() : r.area}
          </p>
          {r.status === "pending" && (
            <p className="text-[12px] text-muted-foreground">
              Full address and patient details are shared only after you accept.
            </p>
          )}
        </Card>

        {msg && (
          <div
            role="status"
            className={`animate-screen rounded-2xl p-4 text-[14px] font-semibold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"}`}
          >
            {msg.t}
          </div>
        )}

        {r.status === "pending" && (
          <>
            {!canProvide(pro, r.service) && (
              <Card className="flex gap-3 bg-destructive-soft shadow-none">
                <ShieldAlert className="h-5 w-5 shrink-0 text-destructive" />
                <p className="text-[13px] font-medium text-destructive">
                  {pro.verification !== "approved"
                    ? "Only approved professionals can accept requests."
                    : `"${r.service}" is not in your approved services.`}
                </p>
              </Card>
            )}
            <PrimaryButton
              tone="primary"
              onClick={() =>
                run(
                  (s, p) => ({
                    requests: acceptRequest(s.requests, r.id, p, r.version),
                    notices: tell(s, `Booking accepted by ${p.name}`),
                  }),
                  "Request accepted. It is now in your upcoming visits.",
                )
              }
            >
              Accept request
            </PrimaryButton>
            <PrimaryButton
              tone="danger"
              onClick={() =>
                run(
                  (s, p) => ({
                    requests: rejectRequest(s.requests, r.id, p, r.version),
                    notices: tell(s, `${p.name} could not take this booking`),
                  }),
                  "Request declined. The patient has been informed.",
                )
              }
            >
              Decline
            </PrimaryButton>
          </>
        )}

        {mine && fieldsAllowed.length > 0 && (
          <>
            <SectionTitle>Patient information</SectionTitle>
            <Card className="space-y-2">
              <p className="text-[12px] text-muted-foreground">
                Only what is needed for {r.service}:{" "}
                {fieldsAllowed.map((f) => FIELD_LABEL[f]).join(", ")}. Every view is logged and
                visible to the patient.
              </p>
              {info ? (
                fieldsAllowed.map((f) => (
                  <div key={f}>
                    <p className="text-[12px] font-semibold text-muted-foreground">
                      {FIELD_LABEL[f]}
                    </p>
                    <p className="text-[14px] text-foreground">{info[f]}</p>
                  </div>
                ))
              ) : (
                <PrimaryButton
                  tone="outline"
                  onClick={() =>
                    run((s, p) => {
                      const v = viewPatientInfo(r, p, s.records);
                      setInfo(v.data);
                      return { accessLog: [v.entry, ...s.accessLog] };
                    }, "Access recorded in the patient's log.")
                  }
                >
                  View patient information
                </PrimaryButton>
              )}
            </Card>
            {r.patientId && (
              <PrimaryButton
                tone="outline"
                onClick={() => {
                  startThread(
                    { id: pro.id, name: pro.name },
                    { id: r.patientId!, name: r.patientName },
                    `${r.service} · ${r.patientName}`,
                    r.id,
                  );
                  void nav({ to: "/pro/messages" });
                }}
              >
                Message patient
              </PrimaryButton>
            )}
          </>
        )}

        {r.status === "accepted" && mine && (
          <>
            <Card className="bg-primary-soft shadow-none">
              <p className="text-[13px] text-primary-deep">
                After the visit, mark it delivered. The request stays open until you submit service
                notes.
              </p>
            </Card>
            <PrimaryButton
              onClick={() =>
                run(
                  (s, p) => ({ requests: markDelivered(s.requests, r.id, p) }),
                  "Marked delivered. Please submit your service notes.",
                )
              }
            >
              Service delivered
            </PrimaryButton>
          </>
        )}

        {r.status === "notes_required" && mine && (
          <>
            <Card className="flex gap-3 bg-destructive-soft shadow-none">
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
              <p className="text-[13px] font-medium text-destructive">
                This request cannot be closed until required service notes are submitted.
              </p>
            </Card>
            <SectionTitle>Service notes</SectionTitle>
            {noteForm}
            <PrimaryButton
              onClick={() =>
                run(
                  (s, p) => ({
                    requests: submitNotes(s.requests, r.id, p, form),
                    notices: tell(s, "Service completed — you can now rate it"),
                  }),
                  "Notes submitted. Request completed.",
                  () => setForm(empty),
                )
              }
            >
              Submit notes & complete
            </PrimaryButton>
          </>
        )}

        {latest && (
          <>
            <SectionTitle
              action={
                <span className="text-[13px] font-semibold text-primary">v{latest.version}</span>
              }
            >
              Service notes
            </SectionTitle>
            <Card className="space-y-2">
              {fields
                .filter(([k]) => latest[k])
                .map(([k, label]) => (
                  <div key={k}>
                    <p className="text-[12px] font-semibold text-muted-foreground">{label}</p>
                    <p className="text-[14px] text-foreground">{latest[k]}</p>
                  </div>
                ))}
              <p className="flex items-center gap-1 pt-1 text-[12px] text-muted-foreground">
                <FileCheck2 className="h-4 w-4 text-success" />
                By {latest.submittedBy} · {fmtStamp(latest.submittedAt)}
                {latest.amendReason && ` · Amended: ${latest.amendReason}`}
              </p>
            </Card>
            {r.notes.length > 1 && (
              <p className="px-1 text-[12px] text-muted-foreground">
                {r.notes.length - 1} earlier version(s) kept in history.
              </p>
            )}
            {mine && !amending && (
              <PrimaryButton
                tone="outline"
                onClick={() => {
                  setForm({ ...latest });
                  setAmending(true);
                }}
              >
                Amend notes
              </PrimaryButton>
            )}
            {mine && amending && (
              <>
                {noteForm}
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for amendment (required)"
                  aria-label="Reason for amendment"
                  className="h-12 w-full rounded-xl bg-card px-3 text-[15px] shadow-card outline-none ring-primary focus:ring-2"
                />
                <PrimaryButton
                  onClick={() =>
                    run(
                      (s, p) => ({ requests: amendNotes(s.requests, r.id, p, form, reason) }),
                      "Amendment saved as a new version.",
                      () => {
                        setAmending(false);
                        setReason("");
                      },
                    )
                  }
                >
                  Save amendment
                </PrimaryButton>
              </>
            )}
          </>
        )}

        <SectionTitle>Activity log</SectionTitle>
        <Card className="space-y-2.5">
          {[...r.history].reverse().map((h, i) => (
            <div key={i} className="flex gap-2.5">
              <History className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[14px] text-foreground">{h.action}</p>
                <p className="text-[12px] text-muted-foreground">
                  {h.by} · {fmtStamp(h.at)}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </Screen>
    </>
  );
}
