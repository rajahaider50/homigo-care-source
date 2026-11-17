import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ChevronRight, RotateCcw, Stethoscope, ClipboardList } from "lucide-react";
import { AppHeader, Avatar, Card, Screen, SectionTitle } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { useProState, switchPro, resetDemo } from "@/lib/pro/store";
import { verificationLabel } from "@/lib/pro/labels";
import { stepState, incomingFor } from "@/lib/pro/rules";
import { NoticeList, SwitchPanel } from "@/components/app/panels";

export const Route = createFileRoute("/pro/")({
  head: () =>
    meta(
      "Professional dashboard",
      "Verification status, service requests, schedule and service notes for HOMIGO CARE professionals.",
    ),
  component: ProHome,
});

function ProHome() {
  const { pro, pros, requests } = useProState();
  const v = verificationLabel[pro.verification];
  const steps = stepState(pro);
  const mine = requests.filter((r) => r.assignedTo === pro.id);
  const incoming = incomingFor(pro, requests).length;
  const stats = [
    [incoming, "New requests"],
    [mine.filter((r) => r.status === "accepted").length, "Upcoming"],
    [mine.filter((r) => r.status === "notes_required").length, "Notes due"],
  ] as const;
  return (
    <>
      <AppHeader
        title={pro.role === "Doctor" ? "Doctor panel" : "Nurse & professional panel"}
        subtitle="HOMIGO CARE · Because care begins at home"
        back={false}
        right={<SwitchPanel />}
      >
        <div className="mt-5 flex items-center gap-3">
          <Avatar initials={pro.initials} size={56} />
          <div className="min-w-0">
            <p className="truncate text-[20px] font-semibold">{pro.name}</p>
            <p className="truncate text-[13px] text-primary-foreground/75">
              {pro.role}
              {pro.specialization && ` · ${pro.specialization}`}
            </p>
          </div>
        </div>
      </AppHeader>
      <Screen>
        <Card className="space-y-2">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Demo account
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
            {pros.map((p) => (
              <button
                key={p.id}
                onClick={() => switchPro(p.id)}
                className={`press shrink-0 rounded-full px-3 py-2 text-[13px] font-semibold ${p.id === pro.id ? "bg-primary text-primary-foreground" : "bg-muted text-primary-deep"}`}
              >
                {p.name.split(" ")[0]} · {verificationLabel[p.verification].t}
              </button>
            ))}
            <button
              aria-label="Reset demo data"
              onClick={resetDemo}
              className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </Card>

        {pro.suspended && (
          <Card className="bg-destructive-soft shadow-none">
            <p className="text-[14px] font-semibold text-destructive">
              Your account is restricted by HOMIGO CARE admin. You cannot accept new requests.
              Message admin for help.
            </p>
          </Card>
        )}
        <Link to="/upload">
          <Card className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-primary-deep">Verification</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.tone}`}>
                  {v.t}
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground">{pro.actionNeeded ?? v.d}</p>
              {pro.verification !== "approved" && (
                <p className="mt-1 text-[12px] font-medium text-primary">
                  {[steps.credentials, steps.employment, steps.assessment].filter(Boolean).length}/3
                  steps complete
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Card>
        </Link>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(([n, l]) => (
            <Link key={l} to="/pro/requests">
              <Card className="press p-3 text-center">
                <p className="text-[22px] font-bold text-primary-deep">{n}</p>
                <p className="text-[12px] text-muted-foreground">{l}</p>
              </Card>
            </Link>
          ))}
        </div>
        <Link to="/pro/requests">
          <Card className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
              <ClipboardList className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-primary-deep">
                Service requests & schedule
              </p>
              <p className="text-[13px] text-muted-foreground">
                Accept, decline, record visits and submit notes
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Card>
        </Link>

        <SectionTitle>Services you can provide</SectionTitle>
        <Card>
          {pro.verification === "approved" && pro.approvedServices.length ? (
            <div className="flex flex-wrap gap-2">
              {pro.approvedServices.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-semibold text-primary"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-muted-foreground">
              Services unlock after admin approval. Until then you cannot accept patient requests.
            </p>
          )}
        </Card>
        <NoticeList meId={pro.id} group="pros" />
      </Screen>
    </>
  );
}
