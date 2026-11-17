import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, Bell, Stethoscope, Syringe, FlaskConical, Pill, FolderHeart, Siren, ChevronRight, CalendarClock } from "lucide-react";
import { Card, PrototypeTag, SectionTitle, logoUrl } from "@/components/app/shell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => meta("Home", "Book home nurses, doctors and lab tests, and keep your family's health file in one place."),
  component: Home,
});

const services = [
  { label: "Nurse", sub: "Home visit", icon: Syringe, to: "/book", tone: "bg-primary-soft text-primary" },
  { label: "Doctor", sub: "Consultation", icon: Stethoscope, to: "/profile", tone: "bg-accent-soft text-accent" },
  { label: "Lab", sub: "Sample at home", icon: FlaskConical, to: "/file", tone: "bg-success-soft text-success" },
  { label: "Medicine", sub: "Reminders", icon: Pill, to: "/reminder", tone: "bg-destructive-soft text-destructive" },
] as const;

function Home() {
  return (
    <div className="animate-screen">
      <header className="header-gradient pt-safe rounded-b-[32px] px-5 pb-8 text-primary-foreground">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <img src={logoUrl} alt="Homigo Care" className="h-11 w-11 rounded-2xl bg-surface p-1.5 shadow-card" />
            <div>
              <p className="font-display text-[17px] font-bold leading-tight">Homigo <span className="text-accent">Care</span></p>
              <PrototypeTag light />
            </div>
          </div>
          <button aria-label="Notifications" className="press icon-hover relative grid h-11 w-11 place-items-center rounded-full bg-primary-foreground/12 ring-1 ring-primary-foreground/20">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-primary" />
          </button>
        </div>
        <p className="mt-6 text-[15px] text-primary-foreground/75">Good evening,</p>
        <h1 className="text-[28px] font-semibold leading-tight">Sara Khan</h1>
        <div className="mt-5 flex items-center gap-4 rounded-3xl bg-surface p-4 text-foreground shadow-float">
          <Link to="/visit" aria-label="SOS emergency" className="press sos-gradient animate-sos grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full text-destructive-foreground">
            <div className="flex flex-col items-center"><Siren className="h-6 w-6" /><span className="text-[13px] font-bold tracking-wide">SOS</span></div>
          </Link>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-primary-deep">Emergency help</p>
            <p className="text-[13px] text-muted-foreground">Press to alert your family and the nearest nurse.</p>
          </div>
        </div>
      </header>

      <div className="space-y-5 px-4 pb-32 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {services.map(({ label, sub, icon: Icon, to, tone }) => (
            <Link key={label} to={to} className="press icon-hover rounded-3xl bg-card p-4 shadow-card">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon className="h-6 w-6" strokeWidth={2} /></span>
              <p className="mt-3 text-[17px] font-semibold text-primary-deep">{label}</p>
              <p className="text-[13px] text-muted-foreground">{sub}</p>
            </Link>
          ))}
          <Link to="/who" className="press icon-hover col-span-2 flex items-center gap-4 rounded-3xl bg-card p-4 shadow-card">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><FolderHeart className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-semibold text-primary-deep">Family File</p>
              <p className="text-[13px] text-muted-foreground">4 members · records up to date</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-accent-soft p-5">
          <img src={logoUrl} alt="" className="animate-float absolute -right-4 -bottom-4 h-28 w-28 opacity-90" />
          <p className="max-w-[65%] font-display text-[20px] font-semibold leading-snug text-primary-deep">Everything for your family, in one place.</p>
          <p className="mt-1 max-w-[60%] text-[13px] text-muted-foreground">Because care begins at home.</p>
        </div>

        <Link to="/consent" className="press flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card ring-1 ring-accent/40">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><ShieldAlert className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="text-[15px] font-semibold text-primary-deep">Consent needed</p><p className="text-[13px] text-muted-foreground">City Hospital requested Ahmed's record</p></div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <SectionTitle>Upcoming</SectionTitle>
        <Card className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><CalendarClock className="h-6 w-6" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-primary-deep">Wound dressing · Ahmed</p>
            <p className="text-[13px] text-muted-foreground">Tomorrow, 10:00 AM · Nurse Ayesha</p>
          </div>
          <Link to="/visit" className="rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-semibold text-primary">Track</Link>
        </Card>
      </div>
    </div>
  );
}
