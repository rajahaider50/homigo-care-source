import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings as Gear,
  MessageSquareWarning,
  ScrollText,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import { AppHeader, Card, PrimaryButton, Screen, SectionTitle } from "@/components/app/shell";
import { NoticeList, StatusMsg, SwitchPanel, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState } from "@/lib/pro/store";
import { ADMIN } from "@/lib/pro/admin";
import { ProRuleError } from "@/lib/pro/rules";
import { auditEntry, notice, type Audience } from "@/lib/pro/platform";

export const Route = createFileRoute("/admin/")({
  head: () =>
    meta(
      "Admin dashboard",
      "HOMIGO CARE operations: verification, bookings, documentation, feedback and announcements.",
    ),
  component: AdminHome,
});

function AdminHome() {
  const s = useProState();
  const [to, setTo] = useState<Audience>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { msg, run } = useRun();
  const c = (st: string) => s.requests.filter((r) => r.status === st).length;
  const stats: [number, string, string][] = [
    [s.patients.length, "Patients", "/admin/people"],
    [s.pros.length, "Professionals", "/admin/people"],
    [
      s.pros.filter((p) => p.verification === "submitted").length,
      "Awaiting review",
      "/admin/verify",
    ],
    [s.pros.filter((p) => p.verification === "approved").length, "Approved", "/admin/verify"],
    [s.pros.filter((p) => p.verification === "rejected").length, "Rejected", "/admin/verify"],
    [c("pending"), "New requests", "/admin/bookings"],
    [c("accepted"), "Accepted", "/admin/bookings"],
    [c("notes_required"), "Notes missing", "/admin/bookings"],
    [c("completed"), "Completed", "/admin/bookings"],
    [c("rejected") + c("cancelled"), "Declined / cancelled", "/admin/bookings"],
    [s.complaints.filter((x) => x.status === "open").length, "Open complaints", "/admin/feedback"],
    [s.pros.filter((p) => p.pendingProfile).length, "Profile changes", "/admin/people"],
  ];
  return (
    <>
      <AppHeader
        title="Admin panel"
        subtitle="HOMIGO CARE operations"
        back={false}
        right={
          <div className="flex gap-2">
            <SwitchPanel />
            <Link
              to="/settings"
              aria-label="Settings"
              className="press grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/12 ring-1 ring-primary-foreground/20"
            >
              <Gear className="h-5 w-5" />
            </Link>
          </div>
        }
      />
      <Screen>
        <p className="px-1 text-[12px] text-muted-foreground">
          All figures are counted from the app's current data (demo data on this device).
        </p>
        <div className="grid grid-cols-3 gap-2">
          {stats.map(([n, l, to2]) => (
            <Link key={l} to={to2}>
              <Card className="press p-3 text-center">
                <p className="text-[20px] font-bold text-primary-deep">{n}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">{l}</p>
              </Card>
            </Link>
          ))}
        </div>
        {(
          [
            ["/admin/feedback", "Ratings & complaints", MessageSquareWarning],
            ["/admin/audit", "Audit & record access logs", ScrollText],
          ] as const
        ).map(([href, t, I]) => (
          <Link key={href} to={href}>
            <Card className="flex items-center gap-3">
              <I className="h-6 w-6 text-primary" />
              <p className="flex-1 text-[15px] font-semibold text-primary-deep">{t}</p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Card>
          </Link>
        ))}

        <SectionTitle>Send announcement</SectionTitle>
        <Card className="space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            {(["all", "patients", "pros"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setTo(a)}
                className={`press rounded-lg py-2 text-[13px] font-semibold ${to === a ? "bg-primary text-primary-foreground" : "bg-muted text-primary-deep"}`}
              >
                {{ all: "Everyone", patients: "Patients", pros: "Professionals" }[a]}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Announcement title"
            className={inputCls}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message"
            aria-label="Announcement message"
            rows={3}
            className="w-full rounded-xl bg-muted px-3 py-2 text-[15px] outline-none ring-primary focus:ring-2"
          />
          <StatusMsg msg={msg} />
          <PrimaryButton
            tone="primary"
            onClick={() =>
              run(
                (st) => {
                  if (title.trim().length < 3 || body.trim().length < 3)
                    throw new ProRuleError("Add a title and a message.");
                  return {
                    notices: [notice(to, title.trim(), body.trim(), "Admin"), ...st.notices],
                    audit: [
                      auditEntry(ADMIN.name, "Sent announcement", `${to}: ${title}`),
                      ...st.audit,
                    ],
                  };
                },
                "Announcement sent. It now shows in the selected panels.",
                () => {
                  setTitle("");
                  setBody("");
                },
              )
            }
          >
            <Megaphone className="h-5 w-5" /> Send
          </PrimaryButton>
        </Card>
        <NoticeList meId="admin" group="admin" limit={8} />
      </Screen>
    </>
  );
}
