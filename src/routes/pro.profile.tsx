import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Info } from "lucide-react";
import {
  AppHeader,
  Avatar,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
} from "@/components/app/shell";
import { Field, StatusMsg, Stars, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState, updatePro } from "@/lib/pro/store";
import { verificationLabel } from "@/lib/pro/labels";
import { availabilityOf, notice, requestProfileUpdate, setAvailability } from "@/lib/pro/platform";

export const Route = createFileRoute("/pro/profile")({
  head: () =>
    meta(
      "My professional profile",
      "Profile, availability, patient ratings and scope of practice.",
    ),
  component: ProProfile,
});
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCOPE: Record<string, string> = {
  "Hospital Companion Nurse":
    "You support an admitted patient at the bedside within hospital policy and the treating team's orders. You do not replace the treating team or change prescribed treatment.",
  "Hospital Navigator Nurse":
    "You help with follow-up and post-discharge coordination: appointments, specialist visits, reports and prescriptions. You do not replace the treating clinician, diagnose or prescribe.",
};

function ProProfile() {
  const { pro, ratings } = useProState();
  const a = availabilityOf(pro);
  const [days, setDays] = useState<number[]>(a.days);
  const [from, setFrom] = useState(a.from);
  const [to, setTo] = useState(a.to);
  const [spec, setSpec] = useState(pro.specialization);
  const [quals, setQuals] = useState(pro.qualifications.join(", "));
  const { msg, run } = useRun();
  const mine = ratings.filter((r) => r.proId === pro.id && !r.hidden);
  const avg = mine.length ? mine.reduce((x, r) => x + r.stars, 0) / mine.length : 0;
  const v = verificationLabel[pro.verification];
  return (
    <>
      <AppHeader title="My profile" subtitle={pro.role}>
        <div className="mt-4 flex items-center gap-3">
          <Avatar initials={pro.initials} size={56} />
          <div>
            <p className="flex items-center gap-1 text-[20px] font-semibold">
              {pro.name}
              {pro.verification === "approved" && <BadgeCheck className="h-5 w-5" />}
            </p>
            <p className="text-[13px] text-primary-foreground/75">
              {v.t} · {pro.experienceYears} yrs
            </p>
          </div>
        </div>
      </AppHeader>
      <Screen key={pro.id}>
        <StatusMsg msg={msg} />
        {SCOPE[pro.role] && (
          <Card className="flex gap-3 bg-accent-soft shadow-none">
            <Info className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-[13px] text-primary-deep">{SCOPE[pro.role]}</p>
          </Card>
        )}
        <Card className="text-[13px] text-muted-foreground">
          Work only within your lawful scope. No independent diagnosis, prescribing or treatment
          changes outside it.
        </Card>

        <SectionTitle>Profile details</SectionTitle>
        <Card className="space-y-3">
          <Field label="Specialization">
            <input value={spec} onChange={(e) => setSpec(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Qualifications (comma separated)">
            <input value={quals} onChange={(e) => setQuals(e.target.value)} className={inputCls} />
          </Field>
          {pro.pendingProfile && (
            <p className="rounded-xl bg-primary-soft px-3 py-2 text-[12px] font-medium text-primary">
              Change waiting for admin review: {pro.pendingProfile.specialization}
            </p>
          )}
          <PrimaryButton
            tone="outline"
            onClick={() =>
              run(
                (s, p) => ({
                  ...updatePro(requestProfileUpdate(p, spec, quals.split(","))),
                  notices: [
                    notice("admin", "Profile change to review", `${p.name}: ${spec}`, p.name),
                    ...s.notices,
                  ],
                }),
                "Sent to admin. Changes show after approval.",
              )
            }
          >
            Submit changes for review
          </PrimaryButton>
        </Card>

        <SectionTitle>Availability</SectionTitle>
        <Card className="space-y-3">
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() =>
                  setDays(days.includes(i) ? days.filter((x) => x !== i) : [...days, i].sort())
                }
                className={`press rounded-lg py-2 text-[12px] font-semibold ${days.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="From">
              <input
                type="time"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="To">
              <input
                type="time"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <PrimaryButton
            tone="primary"
            onClick={() =>
              run(
                (_, p) => updatePro(setAvailability(p, { days, from, to })),
                "Availability saved. Patients now see these times.",
              )
            }
          >
            Save availability
          </PrimaryButton>
        </Card>

        <SectionTitle
          action={
            <span className="flex items-center gap-1 text-[13px] font-semibold text-primary">
              <Stars n={Math.round(avg)} />
              {mine.length ? avg.toFixed(1) : "—"}
            </span>
          }
        >
          Patient feedback
        </SectionTitle>
        <Card className="space-y-3">
          {mine.length === 0 && (
            <p className="text-[14px] text-muted-foreground">No ratings yet.</p>
          )}
          {mine.map((r) => (
            <div key={r.id}>
              <Stars n={r.stars} />
              <p className="text-[14px] text-foreground">{r.text || "No comment"}</p>
            </div>
          ))}
          <p className="text-[11px] text-muted-foreground">
            Ratings cannot be edited or removed by professionals. Disputes go to admin.
          </p>
        </Card>
      </Screen>
    </>
  );
}
