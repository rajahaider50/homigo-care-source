import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Lock, Eye, Clock, CheckCircle2, Delete } from "lucide-react";
import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/consent")({
  head: () => meta("Consent request", "Approve or decline a hospital's request to view a family member's record."),
  component: Consent,
});

const log = [
  ["Dr. Imran Malik · Shifa Clinic", "Viewed prescriptions", "02 Nov, 4:10 PM"],
  ["Chughtai Lab", "Added HbA1c result", "11 Nov, 9:42 AM"],
  ["Nurse Ayesha Raza", "Added visit notes", "15 Nov, 11:05 AM"],
];

function Consent() {
  const [pin, setPin] = useState("");
  const [state, setState] = useState<"ask" | "pin" | "ok" | "no">("ask");
  const press = (d: string) => { const n = (pin + d).slice(0, 4); setPin(n); if (n.length === 4) setTimeout(() => setState("ok"), 250); };
  return (
    <>
      <AppHeader title="Consent request" subtitle="Requires your approval" />
      <Screen>
        <Card className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary-soft text-primary"><Building2 className="h-8 w-8" /></span>
          <p className="mt-3 font-display text-[20px] font-semibold leading-snug text-primary-deep">City Hospital is requesting Ahmed's record.</p>
          <div className="mt-4 space-y-2 rounded-2xl bg-muted p-3 text-left text-[14px]">
            <p className="flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Lab results and prescriptions</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Access for 48 hours</p>
            <p className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Read only · cannot be shared further</p>
          </div>
        </Card>

        {state === "ask" && (
          <div className="space-y-3">
            <PrimaryButton onClick={() => setState("pin")}><Lock className="h-5 w-5" /> Approve with PIN</PrimaryButton>
            <PrimaryButton tone="danger" onClick={() => setState("no")}>Decline</PrimaryButton>
          </div>
        )}
        {state === "pin" && (
          <Card className="animate-screen">
            <p className="text-center text-[15px] font-semibold text-primary-deep">Enter your 4-digit PIN</p>
            <div className="my-4 flex justify-center gap-3">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-4 w-4 rounded-full transition ${i < pin.length ? "bg-primary scale-110" : "bg-border"}`} />)}</div>
            <div className="grid grid-cols-3 gap-2">
              {["1","2","3","4","5","6","7","8","9","","0"].map((d, i) => d ? <button key={i} onClick={() => press(d)} className="press h-14 rounded-2xl bg-muted font-display text-[22px] font-semibold text-primary-deep">{d}</button> : <span key={i} />)}
              <button aria-label="Delete" onClick={() => setPin(pin.slice(0, -1))} className="press grid h-14 place-items-center rounded-2xl text-muted-foreground"><Delete className="h-6 w-6" /></button>
            </div>
          </Card>
        )}
        {state === "ok" && <div className="animate-screen flex items-center gap-3 rounded-2xl bg-success-soft p-4 text-[15px] font-semibold text-success"><CheckCircle2 className="h-6 w-6" /> Access granted to City Hospital for 48 hours.</div>}
        {state === "no" && <div className="animate-screen rounded-2xl bg-destructive-soft p-4 text-[15px] font-semibold text-destructive">Request declined. City Hospital has been notified.</div>}

        <SectionTitle>Access log</SectionTitle>
        <Card className="divide-y divide-border p-0">
          {log.map(([w, a, t]) => (
            <div key={t} className="px-4 py-3">
              <p className="text-[15px] font-semibold text-primary-deep">{w}</p>
              <p className="text-[13px] text-muted-foreground">{a} · {t}</p>
            </div>
          ))}
        </Card>
      </Screen>
    </>
  );
}
