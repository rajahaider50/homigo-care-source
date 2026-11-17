import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Syringe, FlaskConical, Pill, ChevronRight, Share2 } from "lucide-react";
import { AppHeader, Screen } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/file")({
  head: () => meta("Family health file", "One timeline of nurse visits, lab results and prescriptions for every family member."),
  component: FileScreen,
});

const members = ["Ahmed", "Zainab", "Ali", "Sara"];
const types = {
  visit: { I: Syringe, c: "bg-primary-soft text-primary", l: "Nurse visit" },
  lab: { I: FlaskConical, c: "bg-success-soft text-success", l: "Lab result" },
  rx: { I: Pill, c: "bg-accent-soft text-accent", l: "Prescription" },
};
const timeline: Record<string, { d: string; k: keyof typeof types; t: string; s: string }[]> = {
  Ahmed: [
    { d: "15 Nov", k: "visit", t: "Wound dressing", s: "Nurse Ayesha Raza · BP 132/84" },
    { d: "11 Nov", k: "lab", t: "HbA1c", s: "7.2% · slightly above target" },
    { d: "02 Nov", k: "rx", t: "Metformin 500 mg", s: "Twice daily after meals · Dr. Imran Malik" },
    { d: "28 Oct", k: "lab", t: "Complete blood count", s: "All values in normal range" },
  ],
  Zainab: [
    { d: "09 Nov", k: "rx", t: "Amlodipine 5 mg", s: "Once daily · Dr. Hina Qureshi" },
    { d: "20 Oct", k: "lab", t: "Lipid profile", s: "LDL 118 mg/dL" },
  ],
  Ali: [{ d: "05 Nov", k: "visit", t: "Vaccination · Typhoid", s: "Nurse Fatima Noor" }],
  Sara: [{ d: "14 Oct", k: "lab", t: "Vitamin D", s: "24 ng/mL · supplement advised" }],
};

function FileScreen() {
  const [m, setM] = useState("Ahmed");
  return (
    <>
      <AppHeader title="Family health file" subtitle="Records shared only with your consent" right={<button aria-label="Share" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/12"><Share2 className="h-5 w-5" /></button>}>
        <div className="mt-4 flex gap-1 rounded-2xl bg-primary-deep/40 p-1">
          {members.map((x) => (
            <button key={x} onClick={() => setM(x)} className={`flex-1 rounded-xl py-2 text-[14px] font-semibold transition ${m === x ? "bg-surface text-primary-deep" : "text-primary-foreground/80"}`}>{x}</button>
          ))}
        </div>
      </AppHeader>
      <Screen>
        <ol key={m} className="relative space-y-3 before:absolute before:bottom-4 before:left-[23px] before:top-4 before:w-0.5 before:bg-border">
          {(timeline[m] ?? []).map((e) => {
            const { I, c, l } = types[e.k];
            return (
              <li key={e.t} className="animate-screen relative flex gap-3">
                <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-4 ring-background ${c}`}><I className="h-5 w-5" /></span>
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-card p-3.5 shadow-card">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-muted-foreground">{l} · {e.d}</p>
                    <p className="text-[16px] font-semibold text-primary-deep">{e.t}</p>
                    <p className="text-[13px] text-muted-foreground">{e.s}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </li>
            );
          })}
        </ol>
      </Screen>
    </>
  );
}
