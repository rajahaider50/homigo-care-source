import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Info } from "lucide-react";
import { AppHeader, Avatar, Card, Screen, SectionTitle } from "@/components/app/shell";
import { Stars } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { canProvide } from "@/lib/pro/rules";
import { availabilityOf } from "@/lib/pro/platform";

export const Route = createFileRoute("/services")({
  head: () =>
    meta(
      "Services & professionals",
      "Live HOMIGO CARE services, coming-soon services and verified professionals.",
    ),
  component: Services,
});
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fmt = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

function Services() {
  const { services, pros, ratings } = useProState();
  const live = services.filter((s) => s.active),
    soon = services.filter((s) => !s.active);
  const verified = pros.filter((p) => p.verification === "approved" && !p.suspended);
  return (
    <>
      <AppHeader title="Services" subtitle="Only live services can be booked" />
      <Screen>
        <SectionTitle>Available now</SectionTitle>
        {live.map((s) => {
          const n = pros.filter((p) => canProvide(p, s.name)).length;
          return (
            <Card key={s.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[16px] font-semibold text-primary-deep">{s.name}</p>
                <p className="text-[14px] font-semibold text-primary">{fmt(s.price)}</p>
              </div>
              <p className="text-[13px] text-muted-foreground">{s.about}</p>
              {s.scope && (
                <p className="flex gap-1.5 rounded-xl bg-accent-soft px-3 py-2 text-[12px] text-primary-deep">
                  <Info className="h-4 w-4 shrink-0 text-accent" />
                  {s.scope}
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-muted-foreground">
                  {n
                    ? `${n} verified professional${n > 1 ? "s" : ""}`
                    : "No verified professional yet"}
                </span>
                {n > 0 && (
                  <Link to="/book" className="text-[14px] font-semibold text-primary">
                    Book →
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
        <SectionTitle>Coming soon</SectionTitle>
        <Card className="space-y-2">
          {soon.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <p className="text-[14px] text-foreground">{s.name}</p>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                Coming soon
              </span>
            </div>
          ))}
        </Card>
        <SectionTitle>Verified professionals</SectionTitle>
        {verified.map((p) => {
          const rs = ratings.filter((r) => r.proId === p.id && !r.hidden);
          const avg = rs.length ? rs.reduce((a, r) => a + r.stars, 0) / rs.length : 0;
          const a = availabilityOf(p);
          return (
            <Card key={p.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar initials={p.initials} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[16px] font-semibold text-primary-deep">
                    {p.name}
                    <BadgeCheck className="h-4 w-4 text-success" />
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {p.role} · {p.experienceYears} yrs · {p.specialization}
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-foreground">{p.qualifications.join(" · ")}</p>
              <p className="text-[12px] text-muted-foreground">
                Services: {p.approvedServices.join(", ")}
              </p>
              <p className="text-[12px] text-muted-foreground">
                Available: {a.days.map((d) => DAYS[d]).join(", ")} · {a.from}–{a.to}
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Stars n={Math.round(avg)} />
                {rs.length ? `${avg.toFixed(1)} (${rs.length})` : "No ratings yet"}
              </p>
            </Card>
          );
        })}
        <p className="px-1 text-[12px] text-muted-foreground">
          "Verified" means approved through HOMIGO CARE's credential and onboarding review. It does
          not guarantee clinical outcomes.
        </p>
      </Screen>
    </>
  );
}
