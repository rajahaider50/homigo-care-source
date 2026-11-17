import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as Gear, ChevronRight, IdCard, GraduationCap, Landmark, FileText, Check, Search } from "lucide-react";
import { AppHeader, Avatar, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/admin")({
  head: () => meta("Verification queue", "Review applicant documents against issuing bodies and approve, reject or request more."),
  component: Admin,
});

const applicants = [
  { n: "Ayesha Raza", r: "Registered Nurse", i: "AR", w: "2 h", s: "4/4 docs" },
  { n: "Bilal Ahmed", r: "Physiotherapist", i: "BA", w: "5 h", s: "3/4 docs" },
  { n: "Dr. Hina Qureshi", r: "General Physician", i: "HQ", w: "1 d", s: "4/4 docs" },
  { n: "Fatima Noor", r: "Nurse Assistant", i: "FN", w: "2 d", s: "2/4 docs" },
];
const docs = [
  { n: "CNIC", b: "NADRA", I: IdCard },
  { n: "BSc Nursing degree", b: "University of Health Sciences", I: GraduationCap },
  { n: "Council registration", b: "PNMC", I: Landmark },
  { n: "Hospital letter", b: "Mayo Hospital, Lahore", I: FileText },
];

function Admin() {
  const [open, setOpen] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean[]>([true, true, false, false]);
  const [decision, setDecision] = useState<string | null>(null);
  if (open) {
    return (
      <>
        <AppHeader title={open} subtitle="Applicant review" />
        <Screen>
          <SectionTitle action={<span className="text-[13px] font-semibold text-primary">{ok.filter(Boolean).length}/4 checked</span>}>Documents</SectionTitle>
          <div className="space-y-3">
            {docs.map(({ n, b, I }, i) => (
              <Card key={n} className="flex items-center gap-3 p-3">
                <div className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-muted text-primary ring-1 ring-border"><I className="h-6 w-6" /></div>
                <div className="min-w-0 flex-1"><p className="text-[15px] font-semibold text-primary-deep">{n}</p><p className="truncate text-[12px] text-muted-foreground">Checked with {b}</p></div>
                <button aria-label={`Mark ${n} checked`} onClick={() => setOk(ok.map((v, j) => (j === i ? !v : v)))} className={`press grid h-8 w-8 place-items-center rounded-lg ${ok[i] ? "bg-success text-primary-foreground" : "ring-2 ring-border"}`}>{ok[i] && <Check className="h-5 w-5" strokeWidth={3} />}</button>
              </Card>
            ))}
          </div>
          {decision && <div className="animate-screen rounded-2xl bg-primary-soft p-4 text-[15px] font-semibold text-primary-deep">{decision}</div>}
          <PrimaryButton tone="primary" disabled={!ok.every(Boolean)} className="disabled:opacity-40" onClick={() => setDecision(`${open} approved and notified.`)}>Approve</PrimaryButton>
          <div className="grid grid-cols-2 gap-3">
            <PrimaryButton tone="outline" onClick={() => setDecision("Request for more documents sent.")}>Request more</PrimaryButton>
            <PrimaryButton tone="danger" onClick={() => setDecision("Application rejected.")}>Reject</PrimaryButton>
          </div>
          <button onClick={() => { setOpen(null); setDecision(null); }} className="w-full py-2 text-[14px] font-semibold text-primary">Back to queue</button>
        </Screen>
      </>
    );
  }
  return (
    <>
      <AppHeader title="Verification queue" subtitle="Admin · 4 pending" back={false} right={<Link to="/settings" aria-label="Settings" className="press grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/12 ring-1 ring-primary-foreground/20"><Gear className="h-5 w-5" /></Link>}>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-muted-foreground"><Search className="h-5 w-5" /><span className="text-[15px]">Search applicants</span></div>
      </AppHeader>
      <Screen>
        <div className="grid grid-cols-3 gap-2">
          {[["4", "Pending", "text-accent"], ["27", "Approved", "text-success"], ["3", "Rejected", "text-destructive"]].map(([v, l, c]) => (
            <Card key={l} className="p-3 text-center"><p className={`font-display text-[22px] font-bold ${c}`}>{v}</p><p className="text-[12px] text-muted-foreground">{l}</p></Card>
          ))}
        </div>
        <Card className="divide-y divide-border p-0">
          {applicants.map((a) => (
            <button key={a.n} onClick={() => setOpen(a.n)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <Avatar initials={a.i} tone="accent" />
              <div className="min-w-0 flex-1"><p className="text-[15px] font-semibold text-primary-deep">{a.n}</p><p className="text-[13px] text-muted-foreground">{a.r} · {a.s}</p></div>
              <span className="text-[12px] text-muted-foreground">{a.w}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </Card>
      </Screen>
    </>
  );
}
