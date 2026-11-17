// Shared building blocks used by the Patient, Professional and Admin panels.
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  Send,
  ShieldCheck,
  Star,
  ArrowLeftRight,
  MessageSquarePlus,
  Eye,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/app/shell";
import { act, useProState } from "@/lib/pro/store";
import {
  FIELD_LABEL,
  noticesFor,
  notice,
  openThread,
  sendMessage,
  type RecordField,
} from "@/lib/pro/platform";
import { fmtStamp } from "@/lib/pro/labels";

export type Msg = { ok: boolean; t: string } | null;
export function StatusMsg({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <div
      role="status"
      className={`animate-screen rounded-2xl p-4 text-[14px] font-semibold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"}`}
    >
      {msg.t}
    </div>
  );
}
/** Runs a store action and turns the result into a status message. */
export function useRun() {
  const [msg, setMsg] = useState<Msg>(null);
  const run = (fn: Parameters<typeof act>[0], ok: string, after?: () => void) => {
    const e = act(fn);
    setMsg(e ? { ok: false, t: e } : { ok: true, t: ok });
    if (!e) after?.();
    return !e;
  };
  return { msg, setMsg, run };
}

export function SwitchPanel() {
  return (
    <Link
      to="/"
      aria-label="Switch panel"
      className="press grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/12 ring-1 ring-primary-foreground/20"
    >
      <ArrowLeftRight className="h-5 w-5" />
    </Link>
  );
}

export function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= n ? "fill-accent text-accent" : "text-border"}
        />
      ))}
    </span>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-primary-deep">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
export const inputCls =
  "h-12 w-full rounded-xl bg-muted px-3 text-[15px] outline-none ring-primary focus:ring-2";

export function NoticeList({
  meId,
  group,
  limit = 5,
}: {
  meId: string;
  group: "patients" | "pros" | "admin";
  limit?: number;
}) {
  const { notices } = useProState();
  const list = noticesFor(notices, meId, group).slice(0, limit);
  return (
    <>
      <SectionTitle>Notifications</SectionTitle>
      <Card className="space-y-3">
        {list.length === 0 && (
          <p className="text-[14px] text-muted-foreground">No notifications.</p>
        )}
        {list.map((n) => (
          <div key={n.id} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Bell className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-primary-deep">{n.title}</p>
              <p className="text-[13px] text-muted-foreground">{n.body}</p>
              <p className="text-[11px] text-muted-foreground">
                {n.from} · {fmtStamp(n.at)}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

let nextThread: string | null = null;
/** Opens a conversation and makes the next Inbox render show it. */
export function startThread(
  a: { id: string; name: string },
  b: { id: string; name: string },
  subject: string,
  requestId?: string,
) {
  act((s) => {
    const r = openThread(s.threads, a, b, subject, requestId);
    nextThread = r.id;
    return { threads: r.threads };
  });
}

export function Inbox({
  me,
  group,
}: {
  me: { id: string; name: string };
  group: "patients" | "pros" | "admin";
}) {
  const s = useProState();
  const [open, setOpen] = useState<string | null>(() => {
    const t = nextThread;
    nextThread = null;
    return t;
  });
  const [text, setText] = useState("");
  const [to, setTo] = useState("");
  const { msg, run } = useRun();
  const threads = s.threads.filter((t) => t.participants.includes(me.id));
  const thread = threads.find((t) => t.id === open);
  const admin = { id: "admin", name: "HOMIGO CARE Admin" };
  const contacts = [
    ...s.pros.map((p) => ({ id: p.id, name: p.name })),
    ...s.patients.map((p) => ({ id: p.id, name: p.name })),
  ];

  if (thread) {
    const other = thread.participants.find((p) => p !== me.id) ?? "";
    const msgs = s.messages.filter((m) => m.threadId === thread.id);
    return (
      <div className="space-y-3">
        <button onClick={() => setOpen(null)} className="text-[14px] font-semibold text-primary">
          ← All conversations
        </button>
        <Card className="py-3">
          <p className="text-[15px] font-semibold text-primary-deep">
            {thread.names[other] ?? other}
          </p>
          <p className="text-[12px] text-muted-foreground">{thread.subject}</p>
        </Card>
        <p className="rounded-xl bg-destructive-soft px-3 py-2 text-[12px] font-medium text-destructive">
          Chat is not for emergencies. For urgent help use SOS or call 1122.
        </p>
        <div className="space-y-2">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.from === me.id ? "ml-auto bg-primary text-primary-foreground" : "bg-card shadow-card"}`}
            >
              <p className="text-[14px]">{m.text}</p>
              <p className="mt-0.5 text-[11px] opacity-70">
                {m.fromName} · {fmtStamp(m.at)}
              </p>
            </div>
          ))}
          {msgs.length === 0 && (
            <p className="text-center text-[13px] text-muted-foreground">No messages yet.</p>
          )}
        </div>
        <StatusMsg msg={msg?.ok ? null : msg} />
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            aria-label="Message"
            className={`${inputCls} bg-card shadow-card`}
          />
          <button
            aria-label="Send"
            onClick={() =>
              run(
                (st) => {
                  const m = sendMessage(st.threads, thread.id, me, text);
                  return {
                    messages: [...st.messages, m],
                    notices: [
                      notice(other, `New message from ${me.name}`, m.text.slice(0, 80), me.name),
                      ...st.notices,
                    ],
                  };
                },
                "Sent",
                () => setText(""),
              )
            }
            className="press grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {me.id !== "admin" ? (
        <button
          onClick={() => {
            startThread(me, admin, "Support");
            setOpen(nextThread);
            nextThread = null;
          }}
          className="press flex w-full items-center gap-3 rounded-2xl bg-accent-soft p-4 text-left"
        >
          <MessageSquarePlus className="h-6 w-6 text-accent" />
          <div>
            <p className="text-[15px] font-semibold text-primary-deep">Message HOMIGO CARE admin</p>
            <p className="text-[13px] text-muted-foreground">Account, booking or complaint help</p>
          </div>
        </button>
      ) : (
        <Card className="flex gap-2">
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="New message to"
            className={inputCls}
          >
            <option value="">New message to…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            disabled={!to}
            onClick={() => {
              const c = contacts.find((x) => x.id === to)!;
              startThread(me, c, "Admin message");
              setOpen(nextThread);
              nextThread = null;
            }}
            className="press rounded-xl bg-primary px-4 text-[14px] font-semibold text-primary-foreground disabled:opacity-40"
          >
            Open
          </button>
        </Card>
      )}
      {threads.length === 0 && (
        <p className="py-6 text-center text-[14px] text-muted-foreground">No conversations yet.</p>
      )}
      {threads.map((t) => {
        const other = t.participants.find((p) => p !== me.id) ?? "";
        const last = s.messages.filter((m) => m.threadId === t.id).at(-1);
        return (
          <button key={t.id} onClick={() => setOpen(t.id)} className="press block w-full text-left">
            <Card className="py-3">
              <p className="text-[15px] font-semibold text-primary-deep">
                {t.names[other] ?? other}
              </p>
              <p className="text-[12px] font-medium text-primary">{t.subject}</p>
              <p className="truncate text-[13px] text-muted-foreground">
                {last?.text ?? "No messages yet"}
              </p>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

/** The patient's own passport for one family member, plus who has viewed it. */
export function PassportPanel({ member }: { member: string }) {
  const { records, accessLog } = useProState();
  const rec = records.find((r) => r.member === member);
  const log = accessLog.filter((a) => a.member === member);
  return (
    <>
      <SectionTitle>Digital Health Passport</SectionTitle>
      <Card className="space-y-2.5">
        {!rec && (
          <p className="text-[14px] text-muted-foreground">
            No passport details recorded for {member} yet.
          </p>
        )}
        {rec &&
          (Object.keys(FIELD_LABEL) as RecordField[]).map((f) => (
            <div key={f}>
              <p className="text-[12px] font-semibold text-muted-foreground">{FIELD_LABEL[f]}</p>
              <p className="text-[14px] text-foreground">{rec[f] || "—"}</p>
            </div>
          ))}
        <p className="flex gap-1.5 pt-1 text-[12px] text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
          Professionals only see the parts needed for the service they are booked for, and only
          while the booking is active.
        </p>
      </Card>
      <SectionTitle>Who viewed these records</SectionTitle>
      <Card className="space-y-2.5">
        {log.length === 0 && (
          <p className="text-[14px] text-muted-foreground">No one has viewed these records.</p>
        )}
        {log.map((a) => (
          <div key={a.id} className="flex gap-2.5">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[14px] text-foreground">
                {a.by} ({a.byRole})
              </p>
              <p className="text-[12px] text-muted-foreground">
                {a.fields.map((f) => FIELD_LABEL[f]).join(", ")} · {a.purpose} · {fmtStamp(a.at)}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
