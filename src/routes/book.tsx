import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bandage,
  Syringe,
  HeartPulse,
  Droplets,
  Stethoscope,
  Hospital,
  Route as RouteIcon,
  Star,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  AppHeader,
  Avatar,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
  TierBadge,
} from "@/components/app/shell";
import { StatusMsg, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { PATIENT_ID } from "@/lib/pro/seed";
import { canProvide } from "@/lib/pro/rules";
import { availableSlots, createBooking, notice } from "@/lib/pro/platform";
import { fmtDate } from "@/lib/pro/labels";

export const Route = createFileRoute("/book")({
  head: () =>
    meta(
      "Book care",
      "Choose who needs care, the service, a verified professional and a real available time.",
    ),
  component: Book,
});

const icons: Record<string, LucideIcon> = {
  "Wound dressing": Bandage,
  Injection: Syringe,
  "Vitals check": HeartPulse,
  "IV drip": Droplets,
  "Doctor consultation": Stethoscope,
  "Hospital Companion Nurse": Hospital,
  "Hospital Navigator Nurse": RouteIcon,
};
const fmt = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
const dayIso = (o: number) => {
  const d = new Date();
  d.setDate(d.getDate() + o);
  return d.toISOString().slice(0, 10);
};

function Book() {
  const { services, pros, requests, patients, ratings } = useProState();
  const me = patients.find((p) => p.id === PATIENT_ID)!;
  const live = services.filter((s) => s.active);
  const [person, setPerson] = useState(me.members[1] ?? me.name);
  const [svcName, setSvc] = useState(live[0]?.name ?? "");
  const [date, setDate] = useState(dayIso(1));
  const [proId, setPro] = useState("");
  const [slot, setSlot] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const { msg, run } = useRun();
  const cur = live.find((s) => s.name === svcName);
  const able = cur ? pros.filter((p) => canProvide(p, cur.name)) : [];
  const pro = able.find((p) => p.id === proId) ?? able[0];
  const nowHm = new Date().toTimeString().slice(0, 5);
  // Times already passed today are not offered.
  const slots =
    pro && cur
      ? availableSlots(pro, date, cur.durationMin, requests).filter(
          (t) => date !== dayIso(0) || t > nowHm,
        )
      : [];
  const platform = 150;
  const days = Array.from({ length: 7 }, (_, i) => dayIso(i));
  const avg = (id: string) => {
    const r = ratings.filter((x) => x.proId === id && !x.hidden);
    return r.length ? (r.reduce((a, x) => a + x.stars, 0) / r.length).toFixed(1) : "New";
  };

  if (done)
    return (
      <>
        <AppHeader title="Request sent" />
        <Screen>
          <Card className="space-y-2 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="text-[18px] font-semibold text-primary-deep">Booking request submitted</p>
            <p className="text-[14px] text-muted-foreground">{done}</p>
            <p className="text-[13px] text-muted-foreground">
              You will be notified when the professional accepts or declines.
            </p>
          </Card>
          <Link to="/bookings">
            <PrimaryButton tone="primary">View my bookings</PrimaryButton>
          </Link>
          <PrimaryButton
            tone="outline"
            onClick={() => {
              setDone(null);
              setSlot("");
            }}
          >
            Book another
          </PrimaryButton>
        </Screen>
      </>
    );

  return (
    <>
      <AppHeader title="Book care" subtitle={`For ${person}`} />
      <Screen>
        <SectionTitle>Who is the care for?</SectionTitle>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {me.members.map((p) => (
            <button
              key={p}
              onClick={() => setPerson(p)}
              className={`press shrink-0 rounded-full px-5 py-2.5 text-[15px] font-semibold ${person === p ? "bg-primary text-primary-foreground" : "bg-card text-primary-deep shadow-card"}`}
            >
              {p === me.name ? "Myself" : p.split(" ")[0]}
            </button>
          ))}
        </div>
        <SectionTitle
          action={
            <Link to="/services" className="text-[13px] font-semibold text-primary">
              All services
            </Link>
          }
        >
          Service
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {live.map((s) => {
            const I = icons[s.name] ?? Stethoscope;
            const sel = s.name === svcName;
            return (
              <button
                key={s.name}
                onClick={() => {
                  setSvc(s.name);
                  setPro("");
                  setSlot("");
                }}
                className={`press icon-hover rounded-2xl bg-card p-3.5 text-left shadow-card ring-2 ${sel ? "ring-primary" : "ring-transparent"}`}
              >
                <I className={`h-6 w-6 ${sel ? "text-primary" : "text-muted-foreground"}`} />
                <p className="mt-2 text-[15px] font-semibold leading-tight text-primary-deep">
                  {s.name}
                </p>
                <p className="text-[13px] text-muted-foreground">{fmt(s.price)}</p>
              </button>
            );
          })}
        </div>
        {cur?.scope && (
          <p className="rounded-xl bg-accent-soft px-3 py-2 text-[12px] text-primary-deep">
            {cur.scope}
          </p>
        )}
        <SectionTitle>Professional</SectionTitle>
        {able.length === 0 && (
          <Card>
            <p className="text-[14px] text-muted-foreground">
              No verified professional is available for this service yet.
            </p>
          </Card>
        )}
        {able.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPro(p.id);
              setSlot("");
            }}
            className="block w-full text-left"
          >
            <Card
              className={`flex items-center gap-3 ring-2 ${pro?.id === p.id ? "ring-primary" : "ring-transparent"}`}
            >
              <Avatar initials={p.initials} />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-primary-deep">{p.name}</p>
                <p className="flex items-center gap-1 text-[13px] text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {avg(p.id)} · {p.role}
                </p>
              </div>
              <TierBadge tier="Verified" />
            </Card>
          </button>
        ))}
        {pro && (
          <>
            <SectionTitle>Date</SectionTitle>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDate(d);
                    setSlot("");
                  }}
                  className={`press shrink-0 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold ${date === d ? "bg-primary text-primary-foreground" : "bg-card text-primary-deep shadow-card"}`}
                >
                  {fmtDate(d)}
                </button>
              ))}
            </div>
            <SectionTitle>Available times</SectionTitle>
            {slots.length === 0 ? (
              <Card>
                <p className="text-[14px] text-muted-foreground">
                  {pro.name.split(" ")[0]} has no free time on this day. Try another date.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`press rounded-xl py-3 text-[14px] font-semibold ${slot === s ? "bg-primary-soft text-primary ring-2 ring-primary" : "bg-card text-foreground shadow-card"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {cur && (
          <Card>
            <p className="mb-3 text-[15px] font-semibold text-primary-deep">Price breakdown</p>
            <dl className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Visit fee · {cur.name}</dt>
                <dd>{fmt(cur.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Platform fee</dt>
                <dd>{fmt(platform)}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed pt-3 text-[18px] font-bold text-primary-deep">
                <dt>Total</dt>
                <dd>{fmt(cur.price + platform)}</dd>
              </div>
            </dl>
          </Card>
        )}
        <StatusMsg msg={msg} />
        <PrimaryButton
          disabled={!slot || !pro}
          className="disabled:opacity-40"
          onClick={() =>
            pro &&
            cur &&
            run(
              (s) => {
                const r = createBooking(s.requests, s.services, s.pros, {
                  patientId: me.id,
                  member: person,
                  service: cur.name,
                  date,
                  start: slot,
                  proId: pro.id,
                  area: "DHA Phase 5, Lahore",
                  today: dayIso(0),
                });
                return {
                  requests: [r, ...s.requests],
                  notices: [
                    notice(
                      pro.id,
                      "New booking request",
                      `${cur.name} for ${person} · ${fmtDate(date)} ${slot}`,
                      me.name,
                    ),
                    notice(
                      me.id,
                      "Request submitted",
                      `${cur.name} with ${pro.name} · ${fmtDate(date)} ${slot}`,
                      "HOMIGO CARE",
                    ),
                    ...s.notices,
                  ],
                };
              },
              "",
              () =>
                setDone(`${cur.name} for ${person} with ${pro.name} · ${fmtDate(date)} at ${slot}`),
            )
          }
        >
          {slot ? `Request booking · ${slot}` : "Choose a time"}
        </PrimaryButton>
      </Screen>
    </>
  );
}
