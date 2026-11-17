import type { VerificationStatus, RequestStatus } from "./rules";

export const verificationLabel: Record<VerificationStatus, { t: string; d: string; tone: string }> =
  {
    not_started: {
      t: "Not started",
      d: "Start your onboarding to get verified.",
      tone: "bg-muted text-muted-foreground",
    },
    in_progress: {
      t: "In progress",
      d: "Finish all 3 steps, then submit for admin review.",
      tone: "bg-accent-soft text-accent",
    },
    submitted: {
      t: "Under admin review",
      d: "An admin is reviewing your application. You are not verified yet.",
      tone: "bg-primary-soft text-primary",
    },
    more_info: {
      t: "Action needed",
      d: "The admin team asked for more information.",
      tone: "bg-destructive-soft text-destructive",
    },
    approved: {
      t: "Verified",
      d: "Approved by HOMIGO CARE onboarding review.",
      tone: "bg-success-soft text-success",
    },
    rejected: {
      t: "Not approved",
      d: "Your application was not approved.",
      tone: "bg-destructive-soft text-destructive",
    },
  };

export const requestLabel: Record<RequestStatus, { t: string; tone: string }> = {
  pending: { t: "New request", tone: "bg-accent-soft text-accent" },
  accepted: { t: "Accepted", tone: "bg-primary-soft text-primary" },
  rejected: { t: "Declined", tone: "bg-muted text-muted-foreground" },
  cancelled: { t: "Cancelled", tone: "bg-muted text-muted-foreground" },
  notes_required: { t: "Notes required", tone: "bg-destructive-soft text-destructive" },
  completed: { t: "Completed", tone: "bg-success-soft text-success" },
};

export const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

// Timezone-independent so server and browser render the same text.
export const fmtStamp = (iso: string) => `${fmtDate(iso.slice(0, 10))}, ${iso.slice(11, 16)} UTC`;
