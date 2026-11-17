import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Siren, Navigation, Check, Phone } from "lucide-react";
import { AppHeader, Avatar, Card, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/visit")({
  head: () => meta("Visit in progress", "Track your nurse live, follow the visit checklist and reach SOS instantly."),
  component: Visit,
});

const initial = [
  { t: "Check blood pressure & pulse", d: true },
  { t: "Clean and inspect wound", d: true },
  { t: "Apply fresh dressing", d: false },
  { t: "Update notes in health file", d: false },
];

function Visit() {
  const [tasks, setTasks] = useState(initial);
  const done = tasks.filter((t) => t.d).length;
  return (
    <>
      <AppHeader title="Visit in progress" subtitle="Wound dressing · Ahmed Khan" />
      <Screen>
        <div className="relative h-64 overflow-hidden rounded-3xl bg-primary-soft shadow-card">
          <svg viewBox="0 0 360 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <g className="stroke-surface" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-10 60 H380" /><path d="M-10 170 H380" /><path d="M80 -10 V280" /><path d="M250 -10 V280" /><path d="M-10 250 L200 -10" />
            </g>
            <rect x="100" y="80" width="130" height="70" rx="10" className="fill-success-soft" />
            <path d="M80 220 V170 H250 V75" className="stroke-primary animate-route" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>
          <div className="absolute left-[18%] top-[80%] -translate-x-1/2 -translate-y-1/2">
            <span className="animate-ping-dot absolute inset-0 rounded-full bg-primary/40" />
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-surface"><Navigation className="h-4 w-4" /></span>
          </div>
          <div className="absolute left-[70%] top-[27%] -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-accent font-bold text-accent-foreground ring-4 ring-surface text-[12px]">H</div>
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between rounded-2xl bg-surface/95 px-4 py-3 backdrop-blur">
            <div><p className="text-[12px] text-muted-foreground">Arriving in</p><p className="font-display text-[22px] font-bold text-primary-deep">7 min</p></div>
            <p className="text-[13px] text-muted-foreground">2.1 km away</p>
          </div>
        </div>
        <Card className="flex items-center gap-3">
          <Avatar initials="AR" />
          <div className="min-w-0 flex-1"><p className="text-[16px] font-semibold text-primary-deep">Ayesha Raza</p><p className="text-[13px] text-muted-foreground">Honda City · LEA-2291</p></div>
          <button aria-label="Call nurse" className="press grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary"><Phone className="h-5 w-5" /></button>
        </Card>
        <SectionTitle action={<span className="text-[13px] font-semibold text-primary">{done}/{tasks.length} done</span>}>Visit checklist</SectionTitle>
        <Card className="space-y-1 p-2">
          {tasks.map((t, i) => (
            <button key={t.t} onClick={() => setTasks(tasks.map((x, j) => (j === i ? { ...x, d: !x.d } : x)))} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition ${t.d ? "bg-success text-primary-foreground" : "ring-2 ring-border"}`}>{t.d && <Check className="h-4 w-4" strokeWidth={3} />}</span>
              <span className={`text-[15px] ${t.d ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.t}</span>
            </button>
          ))}
        </Card>
        <button className="press sos-gradient animate-sos flex h-16 w-full items-center justify-center gap-3 rounded-2xl text-[18px] font-bold text-destructive-foreground">
          <Siren className="h-6 w-6" /> SOS · Emergency
        </button>
      </Screen>
    </>
  );
}
