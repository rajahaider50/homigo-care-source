import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Card, Screen, SectionTitle } from "@/components/app/shell";
import { StatusMsg, Stars, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { fmtStamp } from "@/lib/pro/labels";
import { ADMIN } from "@/lib/pro/admin";
import { auditEntry, moderateRating, notice, resolveComplaint } from "@/lib/pro/platform";

export const Route = createFileRoute("/admin/feedback")({
  head: () =>
    meta(
      "Ratings & complaints",
      "Moderate patient feedback and resolve complaints with a recorded outcome.",
    ),
  component: Feedback,
});

function Feedback() {
  const { ratings, complaints, pros } = useProState();
  const [text, setText] = useState("");
  const { msg, run } = useRun();
  const name = (id: string) => pros.find((p) => p.id === id)?.name ?? id;
  return (
    <>
      <AppHeader title="Ratings & complaints" subtitle="Original feedback is always kept" />
      <Screen>
        <StatusMsg msg={msg} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reason / outcome note"
          aria-label="Reason or outcome"
          className={`${inputCls} bg-card shadow-card`}
        />
        <SectionTitle>Complaints</SectionTitle>
        {complaints.map((c) => (
          <Card key={c.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-primary-deep">
                {c.fromName} · {c.about}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.status === "open" ? "bg-accent-soft text-accent" : "bg-success-soft text-success"}`}
              >
                {c.status}
              </span>
            </div>
            <p className="text-[14px] text-foreground">{c.text}</p>
            <p className="text-[11px] text-muted-foreground">
              {fmtStamp(c.at)}
              {c.outcome && ` · Outcome: ${c.outcome} (${c.resolvedBy})`}
            </p>
            {c.status === "open" && (
              <button
                onClick={() =>
                  run(
                    (s) => ({
                      complaints: resolveComplaint(s.complaints, c.id, ADMIN.name, text),
                      audit: [
                        auditEntry(ADMIN.name, "Resolved complaint", `${c.id}: ${text}`),
                        ...s.audit,
                      ],
                      notices: [
                        notice(c.fromId, "Your report was resolved", text, "Admin"),
                        ...s.notices,
                      ],
                    }),
                    "Complaint resolved.",
                    () => setText(""),
                  )
                }
                className="press rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground"
              >
                Resolve with outcome
              </button>
            )}
          </Card>
        ))}
        <p className="px-1 text-[11px] text-muted-foreground">
          Clinical incidents need the clinical incident process, not only a rating or complaint.
        </p>
        <SectionTitle>Ratings</SectionTitle>
        {ratings.map((r) => (
          <Card key={r.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-primary-deep">{name(r.proId)}</p>
              <Stars n={r.stars} />
            </div>
            <p className="text-[14px] text-foreground">{r.text || "No comment"}</p>
            {r.hidden && <p className="text-[12px] text-destructive">Hidden: {r.hiddenReason}</p>}
            <button
              onClick={() =>
                run(
                  (s) => ({
                    ratings: moderateRating(s.ratings, r.id, !r.hidden, text),
                    audit: [
                      auditEntry(
                        ADMIN.name,
                        r.hidden ? "Restored rating" : "Hid rating",
                        `${r.id}: ${text}`,
                      ),
                      ...s.audit,
                    ],
                  }),
                  r.hidden ? "Rating visible again." : "Rating hidden (original kept).",
                  () => setText(""),
                )
              }
              className="text-[13px] font-semibold text-primary"
            >
              {r.hidden ? "Show again" : "Hide (with reason)"}
            </button>
          </Card>
        ))}
      </Screen>
    </>
  );
}
