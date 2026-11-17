import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  IdCard,
  GraduationCap,
  Landmark,
  FileText,
  Upload,
  Check,
  BriefcaseBusiness,
  ListChecks,
  Info,
} from "lucide-react";
import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { useProState, act, updatePro } from "@/lib/pro/store";
import { verificationLabel } from "@/lib/pro/labels";
import {
  MCQ,
  PASS_MARK,
  addEmployment,
  stepState,
  submitAssessment,
  submitForReview,
  uploadDoc,
  type DocStatus,
} from "@/lib/pro/rules";

export const Route = createFileRoute("/upload")({
  head: () =>
    meta(
      "Get verified",
      "Three-step professional onboarding: credentials, work experience and knowledge test, then admin review.",
    ),
  component: UploadDocs,
});

const chip: Record<DocStatus, string> = {
  verified: "bg-success-soft text-success",
  checking: "bg-accent-soft text-accent",
  uploaded: "bg-primary-soft text-primary",
  missing: "bg-muted text-muted-foreground",
  rejected: "bg-destructive-soft text-destructive",
};
const icons = {
  cnic: IdCard,
  degree: GraduationCap,
  council: Landmark,
  letter: FileText,
} as Record<string, typeof IdCard>;
const steps = ["Credentials", "Experience", "Knowledge test", "Admin review"];

function UploadDocs() {
  const { pro } = useProState();
  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [job, setJob] = useState({ employer: "", position: "", years: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = useRef<string>("");
  const s = stepState(pro);
  const done = [s.credentials, s.employment, s.assessment, pro.verification === "approved"];
  const locked = pro.verification === "submitted" || pro.verification === "approved";
  const v = verificationLabel[pro.verification];
  const run = (fn: Parameters<typeof act>[0], ok: string) => {
    const e = act(fn);
    setMsg(e ? { ok: false, t: e } : { ok: true, t: ok });
  };

  const docsOf = (kind: "credential" | "employment") =>
    pro.docs
      .filter((d) => d.kind === kind)
      .map((d) => {
        const I = icons[d.id] ?? FileText;
        return (
          <Card key={d.id} className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
              <I className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-primary-deep">{d.name}</p>
              <p className="truncate text-[13px] text-muted-foreground">{d.fileName ?? d.issuer}</p>
            </div>
            {(d.status === "missing" || d.status === "rejected") && !locked ? (
              <button
                onClick={() => {
                  pending.current = d.id;
                  fileRef.current?.click();
                }}
                className="press flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-foreground"
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ${chip[d.status]}`}
              >
                {d.status === "checking" ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                ) : (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                )}
                {d.status}
              </span>
            )}
          </Card>
        );
      });

  return (
    <>
      <AppHeader title="Get verified" subtitle={`Professional onboarding · ${v.t}`}>
        <div className="mt-5 grid grid-cols-4 gap-1.5">
          {steps.map((st, i) => (
            <button key={st} onClick={() => i < 3 && setTab(i)} className="text-left">
              <div className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/20">
                <div
                  className={`h-full rounded-full bg-accent transition-all ${done[i] ? "w-full" : tab === i ? "w-1/2" : "w-0"}`}
                />
              </div>
              <p
                className={`mt-1.5 text-[11px] font-medium ${tab === i || done[i] ? "text-primary-foreground" : "text-primary-foreground/60"}`}
              >
                {st}
              </p>
            </button>
          ))}
        </div>
      </AppHeader>
      <Screen>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          aria-label="Choose document file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f)
              run(
                (_, p) => updatePro(uploadDoc(p, pending.current, f.name)),
                `${f.name} uploaded.`,
              );
          }}
        />

        <Card className={`flex gap-3 shadow-none ${v.tone}`}>
          <Info className="h-5 w-5 shrink-0" />
          <p className="text-[13px] font-medium">{pro.actionNeeded ?? v.d}</p>
        </Card>

        {tab === 0 && (
          <>
            <SectionTitle>Step 1 · Credential documents</SectionTitle>
            <div className="space-y-3">{docsOf("credential")}</div>
            <p className="px-1 text-[12px] text-muted-foreground">
              Documents are checked by the admin team with the issuing bodies. Uploading does not
              mean verified.
            </p>
            <PrimaryButton tone="primary" onClick={() => setTab(1)}>
              Next: experience
            </PrimaryButton>
          </>
        )}

        {tab === 1 && (
          <>
            <SectionTitle>Step 2 · Employment & experience</SectionTitle>
            {pro.employment.map((e, i) => (
              <Card key={i} className="flex items-center gap-3">
                <BriefcaseBusiness className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-[15px] font-semibold text-primary-deep">{e.position}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {e.employer} · {e.years} yrs
                  </p>
                </div>
              </Card>
            ))}
            {!locked && (
              <Card className="space-y-2">
                {(["employer", "position", "years"] as const).map((k) => (
                  <input
                    key={k}
                    value={job[k]}
                    onChange={(e) => setJob({ ...job, [k]: e.target.value })}
                    inputMode={k === "years" ? "numeric" : undefined}
                    placeholder={
                      {
                        employer: "Hospital / clinic name",
                        position: "Your position",
                        years: "Years worked",
                      }[k]
                    }
                    aria-label={k}
                    className="h-12 w-full rounded-xl bg-muted px-3 text-[15px] outline-none ring-primary focus:ring-2"
                  />
                ))}
                <PrimaryButton
                  tone="outline"
                  onClick={() => {
                    const e = act((_, p) =>
                      updatePro(
                        addEmployment(p, {
                          employer: job.employer,
                          position: job.position,
                          years: Number(job.years),
                        }),
                      ),
                    );
                    setMsg(e ? { ok: false, t: e } : { ok: true, t: "Work history added." });
                    if (!e) setJob({ employer: "", position: "", years: "" });
                  }}
                >
                  Add work history
                </PrimaryButton>
              </Card>
            )}
            <div className="space-y-3">{docsOf("employment")}</div>
            <PrimaryButton tone="primary" onClick={() => setTab(2)}>
              Next: knowledge test
            </PrimaryButton>
          </>
        )}

        {tab === 2 && (
          <>
            <SectionTitle
              action={
                pro.assessment.score !== undefined && (
                  <span className="text-[13px] font-semibold text-primary">
                    Last score {Math.round(pro.assessment.score * 100)}%
                  </span>
                )
              }
            >
              Step 3 · Knowledge test
            </SectionTitle>
            <p className="px-1 text-[12px] text-muted-foreground">
              This MCQ test is part of HOMIGO CARE onboarding review. It is not proof of clinical
              competence. Pass mark {PASS_MARK * 100}%.
            </p>
            {!locked &&
              MCQ.map((m, qi) => (
                <Card key={m.id} className="space-y-2">
                  <p className="text-[15px] font-semibold text-primary-deep">
                    <ListChecks className="mr-1 inline h-4 w-4 text-primary" />
                    {qi + 1}. {m.q}
                  </p>
                  {m.o.map((o, oi) => (
                    <button
                      key={o}
                      onClick={() => setAnswers({ ...answers, [m.id]: oi })}
                      className={`press w-full rounded-xl px-3 py-2.5 text-left text-[14px] ${answers[m.id] === oi ? "bg-primary-soft font-semibold text-primary ring-2 ring-primary" : "bg-muted text-foreground"}`}
                    >
                      {o}
                    </button>
                  ))}
                </Card>
              ))}
            {!locked && (
              <PrimaryButton
                tone="outline"
                onClick={() => {
                  const e = act((_, p) => updatePro(submitAssessment(p, answers)));
                  setMsg(e ? { ok: false, t: e } : { ok: true, t: "Test submitted." });
                }}
              >
                Submit test answers
              </PrimaryButton>
            )}
          </>
        )}

        {msg && (
          <div
            role="status"
            className={`animate-screen rounded-2xl p-4 text-[14px] font-semibold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"}`}
          >
            {msg.t}
          </div>
        )}

        {!locked && (
          <PrimaryButton
            onClick={() =>
              run(
                (_, p) => updatePro(submitForReview(p)),
                "Submitted. The admin team will review your application.",
              )
            }
          >
            Submit for admin review
          </PrimaryButton>
        )}
      </Screen>
    </>
  );
}
