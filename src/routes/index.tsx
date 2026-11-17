import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Stethoscope, Syringe, ShieldCheck, ChevronRight } from "lucide-react";
import { PrototypeTag, logoUrl } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { switchPro } from "@/lib/pro/store";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Choose your panel",
      "HOMIGO CARE: patient app, doctor and nurse panels, and admin panel — all connected.",
    ),
  component: Start,
});

const panels = [
  {
    to: "/patient",
    t: "Patient",
    d: "Book care, bookings, health passport, chat",
    I: HeartHandshake,
    tone: "bg-primary-soft text-primary",
  },
  {
    to: "/pro",
    t: "Doctor",
    d: "Consultation requests, notes, patients",
    I: Stethoscope,
    tone: "bg-accent-soft text-accent",
    pro: "pro-hina",
  },
  {
    to: "/pro",
    t: "Nurse",
    d: "Home visits, verification, service notes",
    I: Syringe,
    tone: "bg-success-soft text-success",
    pro: "pro-ayesha",
  },
  {
    to: "/admin",
    t: "Admin",
    d: "Verification, bookings, people, audit",
    I: ShieldCheck,
    tone: "bg-destructive-soft text-destructive",
  },
] as const;

function Start() {
  return (
    <div className="animate-screen min-h-screen">
      <header className="header-gradient pt-safe rounded-b-[32px] px-5 pb-10 text-primary-foreground">
        <div className="flex items-center gap-3 pt-4">
          <img
            src={logoUrl}
            alt="Homigo Care"
            className="h-14 w-14 rounded-2xl bg-surface p-1.5 shadow-card"
          />
          <div>
            <p className="font-display text-[22px] font-bold leading-tight">
              HOMIGO <span className="text-accent">CARE</span>
            </p>
            <p className="text-[13px] text-primary-foreground/75">Because care begins at home.</p>
          </div>
        </div>
        <h1 className="mt-8 text-[26px] font-semibold leading-tight">Who is using the app?</h1>
        <p className="mt-1 text-[14px] text-primary-foreground/75">
          Choose your panel. All panels share the same bookings, messages and updates.
        </p>
      </header>
      <div className="space-y-3 px-4 pb-16 pt-5">
        {panels.map((p) => (
          <Link
            key={p.t}
            to={p.to}
            onClick={() => "pro" in p && switchPro(p.pro)}
            className="press icon-hover flex items-center gap-4 rounded-3xl bg-card p-5 shadow-card"
          >
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${p.tone}`}>
              <p.I className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[19px] font-semibold text-primary-deep">{p.t}</p>
              <p className="text-[13px] text-muted-foreground">{p.d}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
        <div className="flex justify-center pt-2">
          <PrototypeTag />
        </div>
        <p className="px-2 text-center text-[12px] text-muted-foreground">
          Demo data is saved on this device. Real sign-in for each role comes with the online
          version.
        </p>
      </div>
    </div>
  );
}
