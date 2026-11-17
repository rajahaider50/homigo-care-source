import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserRound, Baby, Plus, TriangleAlert, Check } from "lucide-react";
import {
  AppHeader,
  Avatar,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
} from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/who")({
  head: () => meta("Who is this for?", "Choose yourself or a family member before booking care."),
  component: Who,
});

const family = [
  { name: "Ahmed Khan", rel: "Father · 64 yrs", i: "AK", tone: "primary" as const },
  { name: "Zainab Khan", rel: "Mother · 59 yrs", i: "ZK", tone: "accent" as const },
  { name: "Ali Khan", rel: "Son · 9 yrs", i: "AL", tone: "success" as const },
];

function Who() {
  const [pick, setPick] = useState("self");
  const [dup, setDup] = useState(false);
  return (
    <>
      <AppHeader title="Who is this for?" subtitle="Select the person receiving care" />
      <Screen>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "self", l: "Myself", s: "Sara Khan", I: UserRound },
            { id: "child", l: "My Child", s: "Under 18", I: Baby },
          ].map(({ id, l, s, I }) => (
            <button
              key={id}
              onClick={() => setPick(id)}
              className={`press relative rounded-3xl bg-card p-5 text-left shadow-card ring-2 transition ${pick === id ? "ring-primary" : "ring-transparent"}`}
            >
              {pick === id && (
                <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                <I className="h-7 w-7" />
              </span>
              <p className="mt-4 text-[18px] font-semibold text-primary-deep">{l}</p>
              <p className="text-[13px] text-muted-foreground">{s}</p>
            </button>
          ))}
        </div>
        <SectionTitle action={<span className="text-[13px] text-muted-foreground">3 members</span>}>
          Family
        </SectionTitle>
        <Card className="divide-y divide-border p-0">
          {family.map((f) => (
            <button
              key={f.name}
              onClick={() => setPick(f.name)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <Avatar initials={f.i} tone={f.tone} />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-primary-deep">{f.name}</p>
                <p className="text-[13px] text-muted-foreground">{f.rel}</p>
              </div>
              <span
                className={`grid h-6 w-6 place-items-center rounded-full ring-2 ${pick === f.name ? "bg-primary ring-primary text-primary-foreground" : "ring-border"}`}
              >
                {pick === f.name && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
            </button>
          ))}
        </Card>
        {dup && (
          <div role="alert" className="animate-screen flex gap-3 rounded-2xl bg-accent-soft p-4">
            <TriangleAlert className="h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-[15px] font-semibold text-primary-deep">
                This person already exists.
              </p>
              <p className="text-[13px] text-muted-foreground">
                Ahmed Khan (CNIC ending 4471) is already in your family file.
              </p>
            </div>
          </div>
        )}
        <PrimaryButton tone="outline" onClick={() => setDup(true)}>
          <Plus className="h-5 w-5" /> Add family member
        </PrimaryButton>
        <PrimaryButton>Continue</PrimaryButton>
      </Screen>
    </>
  );
}
