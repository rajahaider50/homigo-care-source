import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AppHeader,
  Avatar,
  Card,
  PrimaryButton,
  Screen,
  SectionTitle,
} from "@/components/app/shell";
import { StatusMsg, inputCls, useRun } from "@/components/app/panels";
import { meta } from "@/lib/meta";
import { useProState, updatePro } from "@/lib/pro/store";
import { verificationLabel } from "@/lib/pro/labels";
import { ADMIN } from "@/lib/pro/admin";
import { auditEntry, notice, reviewProfileUpdate, setSuspended } from "@/lib/pro/platform";
import { ProRuleError } from "@/lib/pro/rules";

export const Route = createFileRoute("/admin/people")({
  head: () =>
    meta(
      "People & services",
      "Manage professional and patient accounts and which services are live.",
    ),
  component: People,
});

function People() {
  const { pros, patients, services } = useProState();
  const [reason, setReason] = useState("");
  const { msg, run } = useRun();
  const log = (action: string, ctx: string) => auditEntry(ADMIN.name, action, ctx);
  return (
    <>
      <AppHeader title="People & services" subtitle="Accounts and service catalog" />
      <Screen>
        <StatusMsg msg={msg} />
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (needed to restrict an account)"
          aria-label="Reason"
          className={`${inputCls} bg-card shadow-card`}
        />
        <SectionTitle>Professionals</SectionTitle>
        {pros.map((p) => (
          <Card key={p.id} className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar initials={p.initials} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-primary-deep">{p.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {p.role} · {verificationLabel[p.verification].t}
                  {p.suspended && " · Restricted"}
                </p>
              </div>
            </div>
            {p.pendingProfile && (
              <div className="rounded-xl bg-primary-soft p-2.5 text-[13px]">
                <p className="font-semibold text-primary-deep">
                  Profile change: {p.pendingProfile.specialization} ·{" "}
                  {p.pendingProfile.qualifications.join(", ")}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      run(
                        (s) => ({
                          ...updatePro(reviewProfileUpdate(p, true)),
                          audit: [log("Approved profile change", p.name), ...s.audit],
                          notices: [
                            notice(
                              p.id,
                              "Profile change approved",
                              "Your profile now shows the update.",
                              "Admin",
                            ),
                            ...s.notices,
                          ],
                        }),
                        "Profile change approved.",
                      )
                    }
                    className="press rounded-lg bg-primary py-2 font-semibold text-primary-foreground"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      run(
                        (s) => ({
                          ...updatePro(reviewProfileUpdate(p, false)),
                          audit: [log("Declined profile change", p.name), ...s.audit],
                          notices: [
                            notice(
                              p.id,
                              "Profile change declined",
                              "Contact admin for details.",
                              "Admin",
                            ),
                            ...s.notices,
                          ],
                        }),
                        "Profile change declined.",
                      )
                    }
                    className="press rounded-lg bg-surface py-2 font-semibold text-primary-deep"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
            <PrimaryButton
              tone={p.suspended ? "outline" : "danger"}
              className="h-11"
              onClick={() =>
                run(
                  (s) => ({
                    ...updatePro(setSuspended(p, !p.suspended, reason)),
                    audit: [
                      log(
                        p.suspended ? "Restored account" : "Restricted account",
                        `${p.name}${reason ? ` — ${reason}` : ""}`,
                      ),
                      ...s.audit,
                    ],
                    notices: [
                      notice(
                        p.id,
                        p.suspended ? "Account restored" : "Account restricted",
                        reason || "Updated by admin",
                        "Admin",
                      ),
                      ...s.notices,
                    ],
                  }),
                  p.suspended ? "Account restored." : "Account restricted.",
                  () => setReason(""),
                )
              }
            >
              {p.suspended ? "Restore account" : "Restrict account"}
            </PrimaryButton>
          </Card>
        ))}
        <SectionTitle>Patients</SectionTitle>
        <Card className="space-y-2.5">
          {patients.map((p) => (
            <div key={p.id}>
              <p className="text-[15px] font-semibold text-primary-deep">{p.name}</p>
              <p className="text-[12px] text-muted-foreground">
                {p.city} · {p.phone} · {p.members.length} family member(s)
              </p>
            </div>
          ))}
          <p className="text-[11px] text-muted-foreground">
            Account management does not include access to patients' health records.
          </p>
        </Card>
        <SectionTitle>Service catalog</SectionTitle>
        <Card className="space-y-2">
          {services.map((sv) => (
            <div key={sv.name} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-primary-deep">{sv.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {sv.category} · Rs {sv.price.toLocaleString("en-PK")}
                </p>
              </div>
              <button
                onClick={() =>
                  run(
                    (s) => {
                      if (
                        !sv.active &&
                        !s.pros.some(
                          (p) =>
                            p.verification === "approved" && p.approvedServices.includes(sv.name),
                        ) &&
                        !window.confirm(
                          "No approved professional provides this yet. Make it live anyway?",
                        )
                      )
                        throw new ProRuleError("Not changed.");
                      return {
                        services: s.services.map((x) =>
                          x.name === sv.name ? { ...x, active: !x.active } : x,
                        ),
                        audit: [
                          log(sv.active ? "Disabled service" : "Enabled service", sv.name),
                          ...s.audit,
                        ],
                        notices: sv.active
                          ? s.notices
                          : [
                              notice(
                                "patients",
                                "New service available",
                                `${sv.name} can now be booked.`,
                                "Admin",
                              ),
                              ...s.notices,
                            ],
                      };
                    },
                    `${sv.name} ${sv.active ? "is no longer bookable" : "is now live"}.`,
                  )
                }
                className={`press rounded-full px-3 py-1.5 text-[12px] font-semibold ${sv.active ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}
              >
                {sv.active ? "Live" : "Off"}
              </button>
            </div>
          ))}
        </Card>
      </Screen>
    </>
  );
}
