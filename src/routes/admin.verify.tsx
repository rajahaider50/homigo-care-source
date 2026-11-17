import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileText, BriefcaseBusiness, ListChecks } from "lucide-react";
import {
  AppHeader,
  Avatar,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
} from "@/components/app/shell";
import { StatusMsg, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState, updatePro } from "@/lib/pro/store";
import { verificationLabel, fmtStamp } from "@/lib/pro/labels";
import { ADMIN } from "@/lib/pro/admin";
import { ROLE_SERVICES, adminDecide, auditEntry, notice, type Decision } from "@/lib/pro/platform";

export const Route = createFileRoute("/admin/verify")({
  head: () =>
    meta(
      "Verification queue",
      "Review professional applications through the 3-step verification and record decisions.",
    ),
  component: Admin,
});

const ORDER = ["submitted", "more_info", "in_progress", "not_started", "approved", "rejected"];

function Admin() {
  const { pros, services } = useProState();
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const { msg, setMsg, run } = useRun();
  const p = pros.find((x) => x.id === open);
  const sorted = [...pros].sort(
    (a, b) => ORDER.indexOf(a.verification) - ORDER.indexOf(b.verification),
  );

  if (p) {
    const v = verificationLabel[p.verification];
    const decide = (d: Decision, label: string) =>
      run(
        (s) => ({
          ...updatePro(adminDecide(p, d, note, picked, ADMIN.name)),
          notices: [
            notice(
              p.id,
              `Verification: ${label}`,
              note || "Your application was reviewed.",
              "Admin",
            ),
            ...s.notices,
          ],
          audit: [
            auditEntry(ADMIN.name, `Verification ${label}`, `${p.name}${note ? ` — ${note}` : ""}`),
            ...s.audit,
          ],
        }),
        `${p.name}: ${label}. The professional has been notified.`,
        () => setNote(""),
      );
    return (
      <>
        <AppHeader title={p.name} subtitle={`${p.role} · ${v.t}`} />
        <Screen>
          <SectionTitle>Step 1 · Credentials</SectionTitle>
          {p.docs
            .filter((d) => d.kind === "credential")
            .map((d) => (
              <Card key={d.id} className="flex items-center gap-3 p-3">
                <FileText className="h-6 w-6 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-primary-deep">{d.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {d.fileName ?? "Not uploaded"} · check with {d.issuer}
                  </p>
                </div>
                <span className="text-[12px] font-semibold capitalize text-primary">
                  {d.status}
                </span>
              </Card>
            ))}
          <SectionTitle>Step 2 · Employment & experience</SectionTitle>
          <Card className="space-y-2">
            {p.employment.length === 0 && (
              <p className="text-[14px] text-muted-foreground">No work history added.</p>
            )}
            {p.employment.map((e, i) => (
              <p key={i} className="flex items-center gap-2 text-[14px]">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                {e.position} · {e.employer} · {e.years} yrs
              </p>
            ))}
            {p.docs
              .filter((d) => d.kind === "employment")
              .map((d) => (
                <p key={d.id} className="text-[13px] text-muted-foreground">
                  {d.name}:{" "}
                  <span className="font-semibold capitalize text-primary">{d.status}</span>
                </p>
              ))}
          </Card>
          <SectionTitle>Step 3 · Knowledge test & review</SectionTitle>
          <Card className="space-y-1">
            <p className="flex items-center gap-2 text-[14px]">
              <ListChecks className="h-4 w-4 text-primary" />
              {p.assessment.score !== undefined
                ? `Score ${Math.round(p.assessment.score * 100)}%`
                : "Not taken"}
            </p>
            <p className="text-[12px] text-muted-foreground">
              An MCQ score supports the onboarding review; it is not proof of clinical competence.
            </p>
            {p.reviewedBy && (
              <p className="text-[12px] text-muted-foreground">
                Last decision by {p.reviewedBy} · {p.reviewedAt && fmtStamp(p.reviewedAt)}
                {p.reviewNote && ` · "${p.reviewNote}"`}
              </p>
            )}
          </Card>
          {p.verification === "submitted" ? (
            <>
              <SectionTitle>Services to approve</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {services
                  .filter((s) => (ROLE_SERVICES[p.role] ?? []).includes(s.name))
                  .map((s) => (
                    <button
                      key={s.name}
                      onClick={() =>
                        setPicked(
                          picked.includes(s.name)
                            ? picked.filter((x) => x !== s.name)
                            : [...picked, s.name],
                        )
                      }
                      className={`press flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold ${picked.includes(s.name) ? "bg-primary text-primary-foreground" : "bg-card text-primary-deep shadow-card"}`}
                    >
                      {picked.includes(s.name) && <Check className="h-3.5 w-3.5" />}
                      {s.name}
                    </button>
                  ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Review note (required for request more / reject). Internal notes are never shown publicly."
                aria-label="Review note"
                className={`${inputCls} h-auto py-2`}
              />
              <StatusMsg msg={msg} />
              <PrimaryButton tone="primary" onClick={() => decide("approve", "approved")}>
                Approve
              </PrimaryButton>
              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton
                  tone="outline"
                  onClick={() => decide("more_info", "more information needed")}
                >
                  Request more
                </PrimaryButton>
                <PrimaryButton tone="danger" onClick={() => decide("reject", "not approved")}>
                  Reject
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <StatusMsg msg={msg} />
              <Card className="bg-muted shadow-none">
                <p className="text-[13px] text-muted-foreground">
                  Decisions are possible once the applicant submits all 3 steps for review.
                </p>
              </Card>
            </>
          )}
          <button
            onClick={() => {
              setOpen(null);
              setMsg(null);
            }}
            className="w-full py-2 text-[14px] font-semibold text-primary"
          >
            Back to queue
          </button>
        </Screen>
      </>
    );
  }
  return (
    <>
      <AppHeader
        title="Verification queue"
        subtitle={`${pros.filter((x) => x.verification === "submitted").length} waiting for review`}
      />
      <Screen>
        {sorted.map((x) => {
          const v = verificationLabel[x.verification];
          return (
            <button
              key={x.id}
              onClick={() => {
                setOpen(x.id);
                setPicked(ROLE_SERVICES[x.role] ?? []);
                setMsg(null);
              }}
              className="press block w-full text-left"
            >
              <Card className="flex items-center gap-3">
                <Avatar initials={x.initials} />
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold text-primary-deep">{x.name}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {x.role} · {x.docs.filter((d) => d.status !== "missing").length}/{x.docs.length}{" "}
                    docs
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.tone}`}>
                  {v.t}
                </span>
              </Card>
            </button>
          );
        })}
      </Screen>
    </>
  );
}
