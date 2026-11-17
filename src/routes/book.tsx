import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bandage, Syringe, HeartPulse, Droplets, Star } from "lucide-react";
import { AppHeader, Avatar, Card, PrimaryButton, Screen, SectionTitle, TierBadge } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/book")({
  head: () => meta("Book a nurse", "Choose the patient, service and time for a home nurse visit with a clear price breakdown."),
  component: Book,
});

const people = ["Ahmed", "Zainab", "Ali", "Myself"];
const services = [
  { n: "Wound dressing", p: 2500, I: Bandage },
  { n: "Injection", p: 1200, I: Syringe },
  { n: "Vitals check", p: 1500, I: HeartPulse },
  { n: "IV drip", p: 3500, I: Droplets },
];
const slots = ["9:00 AM", "10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM", "7:00 PM"];
const fmt = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

function Book() {
  const [person, setPerson] = useState("Ahmed");
  const [svc, setSvc] = useState(0);
  const [slot, setSlot] = useState("10:00 AM");
  const cur = services[svc]!; const fee = cur.p, platform = 150;
  return (
    <>
      <AppHeader title="Book a nurse" subtitle="Tomorrow · Wed, 18 Nov" />
      <Screen>
        <SectionTitle>Patient</SectionTitle>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {people.map((p) => (
            <button key={p} onClick={() => setPerson(p)} className={`press shrink-0 rounded-full px-5 py-2.5 text-[15px] font-semibold ${person === p ? "bg-primary text-primary-foreground" : "bg-card text-primary-deep shadow-card"}`}>{p}</button>
          ))}
        </div>
        <SectionTitle>Service</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {services.map(({ n, p, I }, i) => (
            <button key={n} onClick={() => setSvc(i)} className={`press icon-hover rounded-2xl bg-card p-3.5 text-left shadow-card ring-2 ${svc === i ? "ring-primary" : "ring-transparent"}`}>
              <I className={`h-6 w-6 ${svc === i ? "text-primary" : "text-muted-foreground"}`} />
              <p className="mt-2 text-[15px] font-semibold text-primary-deep">{n}</p>
              <p className="text-[13px] text-muted-foreground">{fmt(p)}</p>
            </button>
          ))}
        </div>
        <SectionTitle>Time</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s) => (
            <button key={s} onClick={() => setSlot(s)} className={`press rounded-xl py-3 text-[14px] font-semibold ${slot === s ? "bg-primary-soft text-primary ring-2 ring-primary" : "bg-card text-foreground shadow-card"}`}>{s}</button>
          ))}
        </div>
        <Link to="/profile">
          <Card className="flex items-center gap-3">
            <Avatar initials="AR" />
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold text-primary-deep">Nurse Ayesha Raza</p>
              <p className="flex items-center gap-1 text-[13px] text-muted-foreground"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> 4.9 · 312 visits</p>
            </div>
            <TierBadge tier="Gold" />
          </Card>
        </Link>
        <Card>
          <p className="mb-3 text-[15px] font-semibold text-primary-deep">Price breakdown</p>
          <dl className="space-y-2 text-[15px]">
            <div className="flex justify-between"><dt className="text-muted-foreground">Visit fee · {cur.n}</dt><dd>{fmt(fee)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee</dt><dd>{fmt(platform)}</dd></div>
            <div className="flex justify-between border-t border-dashed pt-3 text-[18px] font-bold text-primary-deep"><dt>Total</dt><dd>{fmt(fee + platform)}</dd></div>
          </dl>
        </Card>
        <PrimaryButton>Confirm booking · {slot}</PrimaryButton>
      </Screen>
    </>
  );
}
