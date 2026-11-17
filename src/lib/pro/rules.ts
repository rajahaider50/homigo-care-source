// Pure Healthcare Professional workflow rules. No UI, no storage: every action
// returns a new state or throws a ProRuleError with a user-readable message.

export type ProRole =
  | "Registered Nurse"
  | "Doctor"
  | "Physiotherapist"
  | "Hospital Companion Nurse"
  | "Hospital Navigator Nurse";

export type VerificationStatus =
  "not_started" | "in_progress" | "submitted" | "more_info" | "approved" | "rejected";
export type DocStatus = "missing" | "uploaded" | "checking" | "verified" | "rejected";
export type DocKind = "credential" | "employment";

export interface CredentialDoc {
  id: string;
  name: string;
  issuer: string;
  kind: DocKind;
  status: DocStatus;
  fileName?: string;
  uploadedAt?: string;
}
export interface Employment {
  employer: string;
  position: string;
  years: number;
}
export interface Assessment {
  answers: Record<string, number>;
  score?: number;
  completedAt?: string;
}

export interface Professional {
  id: string;
  name: string;
  initials: string;
  role: ProRole;
  experienceYears: number;
  specialization: string;
  qualifications: string[];
  approvedServices: string[];
  verification: VerificationStatus;
  actionNeeded?: string | undefined;
  docs: CredentialDoc[];
  employment: Employment[];
  assessment: Assessment;
  suspended?: boolean | undefined;
  reviewNote?: string | undefined;
  reviewedBy?: string | undefined;
  reviewedAt?: string | undefined;
  availability?: Availability | undefined;
  pendingProfile?: { specialization: string; qualifications: string[] } | undefined;
}
export interface Availability {
  days: number[];
  from: string;
  to: string;
}
export const DEFAULT_AVAILABILITY: Availability = {
  days: [1, 2, 3, 4, 5, 6],
  from: "09:00",
  to: "18:00",
};

export type RequestStatus =
  "pending" | "accepted" | "rejected" | "cancelled" | "notes_required" | "completed";
export interface AuditEntry {
  at: string;
  by: string;
  action: string;
}
export interface ServiceNoteFields {
  serviceDelivered: string;
  observations: string;
  procedures: string;
  response: string;
  followUp: string;
  escalation: string;
}
export interface ServiceNote extends ServiceNoteFields {
  version: number;
  submittedBy: string;
  submittedAt: string;
  amendReason?: string;
}
export interface ServiceRequest {
  id: string;
  patientName: string;
  patientInitials: string;
  service: string;
  date: string;
  start: string;
  durationMin: number;
  area: string;
  status: RequestStatus;
  assignedTo?: string | undefined;
  version: number;
  patientId?: string | undefined;
  requestedProId?: string | undefined;
  cancelReason?: string | undefined;
  history: AuditEntry[];
  notes: ServiceNote[];
}

export class ProRuleError extends Error {}
const fail = (msg: string): never => {
  throw new ProRuleError(msg);
};
const now = () => new Date().toISOString();

/* ---------- Verification (onboarding) ---------- */

export const PASS_MARK = 0.6;
export const MCQ = [
  {
    id: "q1",
    q: "Before any procedure at home, the first step is to:",
    o: [
      "Start quickly to save time",
      "Verify patient identity and consent",
      "Ask family to leave",
      "Check payment",
    ],
    a: 1,
  },
  {
    id: "q2",
    q: "Correct hand hygiene with alcohol rub takes about:",
    o: ["5 seconds", "20–30 seconds", "2 minutes", "Not needed with gloves"],
    a: 1,
  },
  {
    id: "q3",
    q: "A wound shows spreading redness, heat and fever. You should:",
    o: [
      "Ignore until next visit",
      "Prescribe antibiotics yourself",
      "Document and escalate to the treating doctor",
      "Remove the dressing permanently",
    ],
    a: 2,
  },
  {
    id: "q4",
    q: "Used sharps must be disposed of in:",
    o: ["Household bin", "A puncture-proof sharps container", "A plastic bag", "The toilet"],
    a: 1,
  },
  {
    id: "q5",
    q: "Patient information may be shared with:",
    o: [
      "Anyone who asks",
      "Only people involved in care, with consent",
      "Social media",
      "Other patients",
    ],
    a: 1,
  },
] as const;

export function uploadDoc(p: Professional, docId: string, fileName: string): Professional {
  if (p.verification === "approved" || p.verification === "submitted")
    fail("Your application is locked while it is under review.");
  if (!fileName.trim()) fail("Choose a file to upload.");
  const doc = p.docs.find((d) => d.id === docId) ?? fail("Document not found.");
  if (doc.status === "verified") fail("This document is already verified.");
  return {
    ...p,
    verification: p.verification === "not_started" ? "in_progress" : p.verification,
    docs: p.docs.map((d) =>
      d.id === docId ? { ...d, status: "uploaded", fileName, uploadedAt: now() } : d,
    ),
  };
}

export function addEmployment(p: Professional, e: Employment): Professional {
  if (p.verification === "approved" || p.verification === "submitted")
    fail("Your application is locked while it is under review.");
  if (!e.employer.trim() || !e.position.trim()) fail("Employer and position are required.");
  if (!(e.years > 0 && e.years < 60)) fail("Enter years of experience between 1 and 59.");
  return {
    ...p,
    verification: p.verification === "not_started" ? "in_progress" : p.verification,
    employment: [...p.employment, e],
  };
}

export function scoreAssessment(answers: Record<string, number>): number {
  return MCQ.filter((m) => answers[m.id] === m.a).length / MCQ.length;
}

export function submitAssessment(p: Professional, answers: Record<string, number>): Professional {
  if (MCQ.some((m) => answers[m.id] === undefined))
    fail("Answer every question before submitting.");
  return { ...p, assessment: { answers, score: scoreAssessment(answers), completedAt: now() } };
}

export function stepState(p: Professional) {
  const has = (k: DocKind) =>
    p.docs
      .filter((d) => d.kind === k)
      .every((d) => d.status !== "missing" && d.status !== "rejected");
  return {
    credentials: has("credential"),
    employment: has("employment") && p.employment.length > 0,
    assessment: (p.assessment.score ?? 0) >= PASS_MARK,
  };
}

/** Sends the application to admins. Never approves: only an admin review can set "approved". */
export function submitForReview(p: Professional): Professional {
  if (p.verification === "approved") fail("You are already approved.");
  if (p.verification === "submitted") fail("Already submitted and waiting for admin review.");
  const s = stepState(p);
  if (!s.credentials) fail("Upload all credential documents (step 1).");
  if (!s.employment) fail("Add your work history and experience letter (step 2).");
  if (!s.assessment) fail(`Pass the knowledge test (at least ${PASS_MARK * 100}%) in step 3.`);
  return {
    ...p,
    verification: "submitted",
    actionNeeded: undefined,
    docs: p.docs.map((d) => (d.status === "uploaded" ? { ...d, status: "checking" } : d)),
  };
}

/* ---------- Service requests ---------- */

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h! * 60 + m!;
};
export const overlaps = (a: ServiceRequest, b: ServiceRequest) =>
  a.date === b.date &&
  toMin(a.start) < toMin(b.start) + b.durationMin &&
  toMin(b.start) < toMin(a.start) + a.durationMin;

export function canProvide(p: Professional, service: string) {
  return p.verification === "approved" && !p.suspended && p.approvedServices.includes(service);
}

/** Pending requests this professional may see: sent to them, or open requests for a service they are approved for. */
export function incomingFor(p: Professional, list: ServiceRequest[]) {
  if (p.verification !== "approved" || p.suspended) return [];
  return list.filter(
    (r) =>
      r.status === "pending" &&
      (r.requestedProId ? r.requestedProId === p.id : p.approvedServices.includes(r.service)),
  );
}

function patch(
  list: ServiceRequest[],
  r: ServiceRequest,
  by: string,
  action: string,
  change: Partial<ServiceRequest>,
) {
  const next = {
    ...r,
    ...change,
    version: r.version + 1,
    history: [...r.history, { at: now(), by, action }],
  };
  return list.map((x) => (x.id === r.id ? next : x));
}
const find = (list: ServiceRequest[], id: string) =>
  list.find((r) => r.id === id) ?? fail("Request not found.");

/** expectedVersion guards against two professionals accepting the same request at once. */
export function acceptRequest(
  list: ServiceRequest[],
  id: string,
  p: Professional,
  expectedVersion: number,
) {
  const r = find(list, id);
  if (p.verification !== "approved") fail("Only approved professionals can accept requests.");
  if (p.suspended) fail("Your account is restricted by HOMIGO CARE admin.");
  if (r.requestedProId && r.requestedProId !== p.id)
    fail("This request was sent to another professional.");
  if (r.version !== expectedVersion || r.status !== "pending")
    fail("This request is no longer available. It may have been taken or cancelled.");
  if (!p.approvedServices.includes(r.service))
    fail(`You are not approved to provide "${r.service}".`);
  const clash = list.find(
    (x) =>
      x.assignedTo === p.id &&
      (x.status === "accepted" || x.status === "notes_required") &&
      overlaps(x, r),
  );
  if (clash) fail(`Time clash with ${clash.service} for ${clash.patientName} at ${clash.start}.`);
  return patch(list, r, p.name, "Accepted request", { status: "accepted", assignedTo: p.id });
}

export function rejectRequest(
  list: ServiceRequest[],
  id: string,
  p: Professional,
  expectedVersion: number,
) {
  const r = find(list, id);
  if (r.version !== expectedVersion || r.status !== "pending")
    fail("This request is no longer available.");
  return patch(list, r, p.name, "Declined request", { status: "rejected" });
}

const own = (r: ServiceRequest, p: Professional) => {
  if (r.assignedTo !== p.id) fail("This request is not assigned to you.");
};

/** Visit happened: request stays open until notes are submitted. */
export function markDelivered(list: ServiceRequest[], id: string, p: Professional) {
  const r = find(list, id);
  own(r, p);
  if (r.status !== "accepted") fail("Only accepted visits can be marked as delivered.");
  return patch(list, r, p.name, "Marked service delivered — notes required", {
    status: "notes_required",
  });
}

export function validateNote(f: ServiceNoteFields) {
  if (f.serviceDelivered.trim().length < 3) fail("Describe the service delivered.");
  if (f.observations.trim().length < 3) fail("Add your observations.");
}

export function closeRequest(list: ServiceRequest[], id: string, p: Professional) {
  const r = find(list, id);
  own(r, p);
  if (r.notes.length === 0) fail("Service notes are required before this request can be closed.");
  if (r.status !== "notes_required") fail("This request cannot be closed in its current state.");
  return patch(list, r, p.name, "Closed request", { status: "completed" });
}

export function submitNotes(
  list: ServiceRequest[],
  id: string,
  p: Professional,
  f: ServiceNoteFields,
) {
  const r = find(list, id);
  own(r, p);
  if (r.status !== "notes_required") fail("Notes can be submitted after the service is delivered.");
  if (r.notes.length) fail("Notes already submitted. Use an amendment to correct them.");
  validateNote(f);
  const withNote = patch(list, r, p.name, "Submitted service notes (v1)", {
    notes: [{ ...f, version: 1, submittedBy: p.name, submittedAt: now() }],
  });
  return closeRequest(withNote, id, p);
}

/** Corrections append a new version; earlier versions are never overwritten. */
export function amendNotes(
  list: ServiceRequest[],
  id: string,
  p: Professional,
  f: ServiceNoteFields,
  reason: string,
) {
  const r = find(list, id);
  own(r, p);
  if (!r.notes.length) fail("There are no notes to amend.");
  if (reason.trim().length < 5) fail("Give a reason for the amendment.");
  validateNote(f);
  const version = r.notes.length + 1;
  return patch(list, r, p.name, `Amended service notes (v${version}): ${reason}`, {
    notes: [
      ...r.notes,
      { ...f, version, submittedBy: p.name, submittedAt: now(), amendReason: reason },
    ],
  });
}
