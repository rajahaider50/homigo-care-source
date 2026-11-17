import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Card, PrimaryButton, Screen } from "@/components/app/shell";
import { StatusMsg, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { fmtDate, fmtStamp, requestLabel } from "@/lib/pro/labels";
import { ADMIN } from "@/lib/pro/admin";
import { auditEntry, cancelBooking, notice } from "@/lib/pro/platform";
import type { RequestStatus } from "@/lib/pro/rules";

export const Route = createFileRoute("/admin/bookings")({
  head: () =>
    meta(
      "Booking oversight",
      "Monitor every booking and find visits still waiting for service notes.",
    ),
  component: AdminBookings,
});
const FILTERS: (RequestStatus | "all")[] = [
  "all",
  "pending",
  "accepted",
  "notes_required",
  "completed",
  "rejected",
  "cancelled",
];

function AdminBookings() {
  const { requests, pros } = useProState();
  const [f, setF] = useState<RequestStatus | "all">("notes_required");
  const [open, setOpen] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const { msg, run } = useRun();
  const list = requests.filter((r) => f === "all" || r.status === f);
  const name = (id?: string) => pros.find((p) => p.id === id)?.name ?? "—";
  return (
    <>
      <AppHeader title="Bookings" subtitle="Lifecycle and documentation status">
        <div className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1">
          {FILTERS.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={`press shrink-0 rounded-full px-3 py-2 text-[12px] font-semibold ${f === x ? "bg-surface text-primary-deep" : "bg-primary-foreground/12 text-primary-foreground"}`}
            >
              {x === "all" ? "All" : requestLabel[x].t}{" "}
              {x === "all" ? requests.length : requests.filter((r) => r.status === x).length}
            </button>
          ))}
        </div>
      </AppHeader>
      <Screen>
        <StatusMsg msg={msg} />
        {f === "notes_required" && (
          <p className="px-1 text-[12px] text-muted-foreground">
            These visits were delivered but stay open until the professional submits notes. Admins
            cannot write clinical notes for them.
          </p>
        )}
        {list.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No bookings.</p>
        )}
        {list.map((r) => {
          const l = requestLabel[r.status];
          const isOpen = open === r.id;
          const n = r.notes.at(-1);
          return (
            <Card key={r.id} className="space-y-2">
              <button onClick={() => setOpen(isOpen ? null : r.id)} className="w-full text-left">
                <div className="flex items-center gap-2">
                  <p className="flex-1 truncate text-[15px] font-semibold text-primary-deep">
                    {r.service} · {r.patientName}
                  </p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${l.tone}`}>
                    {l.t}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {fmtDate(r.date)} {r.start} ·{" "}
                  {r.assignedTo
                    ? name(r.assignedTo)
                    : r.requestedProId
                      ? `Sent to ${name(r.requestedProId)}`
                      : "Open to qualified pros"}{" "}
                  · Notes: {n ? `v${n.version} by ${n.submittedBy}` : "none"}
                </p>
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-border pt-2">
                  {r.history.map((h, i) => (
                    <p key={i} className="text-[12px] text-muted-foreground">
                      {fmtStamp(h.at)} · {h.by}: {h.action}
                    </p>
                  ))}
                  {(r.status === "pending" || r.status === "accepted") && (
                    <>
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for admin cancellation"
                        aria-label="Cancellation reason"
                        className={inputCls}
                      />
                      <PrimaryButton
                        tone="danger"
                        onClick={() =>
                          run(
                            (s) => ({
                              requests: cancelBooking(
                                s.requests,
                                r.id,
                                { name: ADMIN.name, admin: true },
                                reason,
                              ),
                              audit: [
                                auditEntry(
                                  ADMIN.name,
                                  "Cancelled booking",
                                  `${r.id} ${r.service} — ${reason}`,
                                ),
                                ...s.audit,
                              ],
                              notices: [
                                ...(r.patientId
                                  ? [
                                      notice(
                                        r.patientId,
                                        "Booking cancelled by HOMIGO CARE",
                                        reason,
                                        "Admin",
                                      ),
                                    ]
                                  : []),
                                ...((r.assignedTo ?? r.requestedProId)
                                  ? [
                                      notice(
                                        (r.assignedTo ?? r.requestedProId)!,
                                        "Booking cancelled by admin",
                                        `${r.service} · ${reason}`,
                                        "Admin",
                                      ),
                                    ]
                                  : []),
                                ...s.notices,
                              ],
                            }),
                            "Booking cancelled and both sides notified.",
                            () => setReason(""),
                          )
                        }
                      >
                        Cancel with reason
                      </PrimaryButton>
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </Screen>
    </>
  );
}
