import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ChevronRight, MapPin } from "lucide-react";
import { AppHeader, Avatar, Card, Screen } from "@/components/app/shell";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { fmtDate, requestLabel } from "@/lib/pro/labels";
import { incomingFor, type ServiceRequest } from "@/lib/pro/rules";

export const Route = createFileRoute("/pro/requests/")({
  head: () =>
    meta(
      "Service requests",
      "Review incoming patient requests, upcoming visits and visits waiting for service notes.",
    ),
  component: Requests,
});

const tabs = ["Incoming", "Upcoming", "Notes due", "History"] as const;

function Requests() {
  const { pro, requests } = useProState();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Incoming");
  const mine = requests.filter((r) => r.assignedTo === pro.id);
  const lists: Record<(typeof tabs)[number], ServiceRequest[]> = {
    Incoming: incomingFor(pro, requests),
    Upcoming: mine.filter((r) => r.status === "accepted"),
    "Notes due": mine.filter((r) => r.status === "notes_required"),
    History: requests.filter(
      (r) =>
        (r.assignedTo === pro.id && r.status === "completed") ||
        (r.status === "rejected" && r.history.some((h) => h.by === pro.name)),
    ),
  };
  const list = [...lists[tab]].sort((a, b) =>
    `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`),
  );
  return (
    <>
      <AppHeader title="Service requests" subtitle={`${pro.name} · ${pro.role}`}>
        <div className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`press shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${tab === t ? "bg-surface text-primary-deep" : "bg-primary-foreground/12 text-primary-foreground"}`}
            >
              {t} <span className="opacity-70">{lists[t].length}</span>
            </button>
          ))}
        </div>
      </AppHeader>
      <Screen>
        {tab === "Incoming" && pro.verification !== "approved" && (
          <Card className="bg-accent-soft shadow-none">
            <p className="text-[14px] font-semibold text-primary-deep">
              You can see requests after admin approval.
            </p>
            <Link to="/upload" className="text-[13px] font-semibold text-primary">
              Finish verification →
            </Link>
          </Card>
        )}
        {list.length === 0 && (
          <p className="py-10 text-center text-[14px] text-muted-foreground">
            Nothing here right now.
          </p>
        )}
        {list.map((r) => {
          const l = requestLabel[r.status];
          return (
            <Link key={r.id} to="/pro/requests/$id" params={{ id: r.id }}>
              <Card className="flex items-center gap-3">
                <Avatar initials={r.patientInitials} tone="accent" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold text-primary-deep">
                      {r.service}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${l.tone}`}
                    >
                      {l.t}
                    </span>
                  </div>
                  <p className="truncate text-[13px] text-muted-foreground">{r.patientName}</p>
                  <p className="flex items-center gap-1 text-[12px] text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {fmtDate(r.date)} · {r.start} · {r.durationMin} min{" "}
                    <MapPin className="ml-1 h-3.5 w-3.5" />
                    {r.area.split(",")[0]}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Card>
            </Link>
          );
        })}
      </Screen>
    </>
  );
}
