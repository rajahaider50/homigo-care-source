import { createFileRoute } from "@tanstack/react-router";
import { IdCard, GraduationCap, Landmark, FileText, Upload, Check } from "lucide-react";
import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/upload")({
  head: () => meta("Document upload", "Upload your CNIC, degree, council registration and hospital letter to get verified."),
  component: UploadDocs,
});

type St = "verified" | "checking" | "uploaded" | "missing";
const chip: Record<St, string> = {
  verified: "bg-success-soft text-success",
  checking: "bg-accent-soft text-accent",
  uploaded: "bg-primary-soft text-primary",
  missing: "bg-muted text-muted-foreground",
};
const docs: { n: string; s: string; I: typeof IdCard; st: St }[] = [
  { n: "CNIC (front & back)", s: "NADRA", I: IdCard, st: "verified" },
  { n: "Nursing degree", s: "BSc Nursing", I: GraduationCap, st: "checking" },
  { n: "Council registration", s: "PNMC licence", I: Landmark, st: "uploaded" },
  { n: "Hospital letter", s: "Experience certificate", I: FileText, st: "missing" },
];
const steps = ["Documents", "Review", "Skills test", "Live"];

function UploadDocs() {
  return (
    <>
      <AppHeader title="Get verified" subtitle="Professional onboarding · Step 2 of 4">
        <div className="mt-5 grid grid-cols-4 gap-1.5">
          {steps.map((s, i) => (
            <div key={s}>
              <div className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/20"><div className={`h-full rounded-full bg-accent transition-all ${i < 1 ? "w-full" : i === 1 ? "w-1/2" : "w-0"}`} /></div>
              <p className={`mt-1.5 text-[11px] font-medium ${i <= 1 ? "text-primary-foreground" : "text-primary-foreground/60"}`}>{s}</p>
            </div>
          ))}
        </div>
      </AppHeader>
      <Screen>
        <SectionTitle>Required documents</SectionTitle>
        <div className="space-y-3">
          {docs.map(({ n, s, I, st }) => (
            <Card key={n} className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><I className="h-6 w-6" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-semibold text-primary-deep">{n}</p><p className="text-[13px] text-muted-foreground">{s}</p></div>
              {st === "missing" ? (
                <button className="press flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-foreground"><Upload className="h-4 w-4" /> Upload</button>
              ) : (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ${chip[st]}`}>
                  {st === "checking" ? <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> : <Check className="h-3.5 w-3.5" strokeWidth={3} />}{st}
                </span>
              )}
            </Card>
          ))}
        </div>
        <Card className="bg-primary-soft shadow-none">
          <p className="text-[15px] font-semibold text-primary-deep">Next: clinical skills test</p>
          <p className="text-[13px] text-muted-foreground">Unlocks after all documents are verified with the issuing bodies, usually within 48 hours.</p>
        </Card>
        <PrimaryButton>Submit for review</PrimaryButton>
      </Screen>
    </>
  );
}
