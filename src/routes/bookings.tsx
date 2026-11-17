import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ChevronDown, Star } from "lucide-react";
import { AppHeader, Avatar, Card, PrimaryButton, Screen } from "@/components/app/shell";
import { StatusMsg, useRun, startThread, Stars, inputCls } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { PATIENT_ID } from "@/lib/pro/seed";
import { fmtDate, requestLabel } from "@/lib/pro/labels";
import { cancelBooking, fileComplaint, notice, rateService } from "@/lib/pro/platform";

export const Route = createFileRoute("/bookings")({
  head: () =>
    meta(
      "My bookings",
      "Track every booking: requested, accepted, visit done, notes pending and completed.",
    ),
  component: Bookings,
});

const patientLabel = {
  ...requestLabel,
  pending: { ...requestLabel.pending, t: "Waiting for reply" },
  notes_required: { ...requestLabel.notes_required, t: "Visit done · notes pending" },
};

function Bookings() {
  const { requests, pros, patients, ratings } = useProState();
  const me = patients.find((p) => p.id === PATIENT_ID)!;
  const nav = useNavigate();
  const [open, setOpen] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const { msg, run } = useRun();
  const mine = requests
    .filter((r) => r.patientId === me.id)
    .sort((a, b) => `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`));
  return (
    <>
      <AppHeader title="My bookings" subtitle={`${mine.length} bookings for your family`} />
      <Screen>
        <StatusMsg msg={msg} />
        {mine.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No bookings yet.</p>
        )}
        {mine.map((r) => {
          const pro = pros.find((p) => p.id === (r.assignedTo ?? r.requestedProId));
          const l = patientLabel[r.status];
          const rated = ratings.find((x) => x.requestId === r.id);
          const isOpen = open === r.id;
          return (
            <Card key={r.id} className="space-y-3">
              <button
                onClick={() => {
                  setOpen(isOpen ? null : r.id);
                  setText("");
                }}
                className="flex w-full items-center gap-3 text-left"
              >
                <Avatar initials={pro?.initials ?? "?"} tone="accent" />
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
                  <p className="text-[13px] text-muted-foreground">
                    For {r.patientName} · {pro?.name ?? "Any verified professional"}
                  </p>
                  <p className="flex items-center gap-1 text-[12px] text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {fmtDate(r.date)} · {r.start}
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-border pt-3">
                  {r.cancelReason && (
                    <p className="text-[13px] text-muted-foreground">Reason: {r.cancelReason}</p>
                  )}
                  {r.status === "notes_required" && (
                    <p className="text-[13px] text-muted-foreground">
                      The professional must submit service notes before this booking is completed.
                    </p>
                  )}
                  {r.assignedTo && pro && (
                    <PrimaryButton
                      tone="outline"
                      onClick={() => {
                        startThread(
                          { id: me.id, name: me.name },
                          { id: pro.id, name: pro.name },
                          `${r.service} · ${r.patientName}`,
                          r.id,
                        );
                        void nav({ to: "/messages" });
                      }}
                    >
                      Message {pro.name.split(" ")[0]}
                    </PrimaryButton>
                  )}
                  {(r.status === "pending" || r.status === "accepted") && (
                    <PrimaryButton
                      tone="danger"
                      onClick={() =>
                        run(
                          (s) => ({
                            requests: cancelBooking(
                              s.requests,
                              r.id,
                              { name: me.name, patientId: me.id },
                              "",
                            ),
                            notices: pro
                              ? [
                                  notice(
                                    pro.id,
                                    "Booking cancelled",
                                    `${r.service} · ${fmtDate(r.date)} ${r.start}`,
                                    me.name,
                                  ),
                                  ...s.notices,
                                ]
                              : s.notices,
                          }),
                          "Booking cancelled.",
                        )
                      }
                    >
                      Cancel booking
                    </PrimaryButton>
                  )}
                  {r.status === "completed" &&
                    (rated ? (
                      <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <Stars n={rated.stars} /> You rated this service
                        {rated.text && `: "${rated.text}"`}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[14px] font-semibold text-primary-deep">
                          Rate {pro?.name}
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              aria-label={`${n} stars`}
                              onClick={() => setStars(n)}
                              className="press"
                            >
                              <Star
                                className={`h-8 w-8 ${n <= stars ? "fill-accent text-accent" : "text-border"}`}
                              />
                            </button>
                          ))}
                        </div>
                        <input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Feedback (optional)"
                          aria-label="Feedback"
                          className={inputCls}
                        />
                        <PrimaryButton
                          onClick={() =>
                            run(
                              (s) => {
                                const rt = rateService(s.ratings, r, me.id, stars, text);
                                return {
                                  ratings: [rt, ...s.ratings],
                                  notices: [
                                    notice(
                                      rt.proId,
                                      "New rating",
                                      `${stars}★ for ${r.service}`,
                                      me.name,
                                    ),
                                    ...s.notices,
                                  ],
                                };
                              },
                              "Thank you for your feedback.",
                              () => setText(""),
                            )
                          }
                        >
                          Submit rating
                        </PrimaryButton>
                        <p className="text-[11px] text-muted-foreground">
                          Ratings are not for reporting clinical incidents. Use "Report a problem"
                          or call your doctor.
                        </p>
                      </div>
                    ))}
                  <button
                    onClick={() => {
                      const t = window.prompt("Describe the problem with this booking");
                      if (t !== null)
                        run(
                          (s) => ({
                            complaints: [
                              fileComplaint(me.id, me.name, `${r.service} · ${r.id}`, t),
                              ...s.complaints,
                            ],
                            notices: [
                              notice(
                                "admin",
                                "New complaint",
                                `${me.name}: ${t.slice(0, 60)}`,
                                me.name,
                              ),
                              ...s.notices,
                            ],
                          }),
                          "Your report was sent to HOMIGO CARE admin.",
                        );
                    }}
                    className="w-full py-1 text-[13px] font-semibold text-destructive"
                  >
                    Report a problem
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </Screen>
    </>
  );
}
