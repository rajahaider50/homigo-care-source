// Patient + Admin + shared (messages, notices, privacy) rules. Pure functions; throw ProRuleError.
import {
  ProRuleError,
  DEFAULT_AVAILABILITY,
  canProvide,
  overlaps,
  toMin,
  type Professional,
  type ServiceRequest,
  type ProRole,
} from "./rules";

const fail = (m: string): never => {
  throw new ProRuleError(m);
};
const now = () => new Date().toISOString();
export const uid = (p: string) =>
  `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ---------- Service catalog ---------- */
export type Category =
  | "Home nursing"
  | "Doctor consultation"
  | "Hospital Companion Nurse"
  | "Hospital Navigator Nurse"
  | "Physiotherapy"
  | "Laboratory"
  | "Pharmacy"
  | "Nutrition support";
export interface ServiceDef {
  name: string;
  category: Category;
  price: number;
  durationMin: number;
  active: boolean;
  about: string;
  scope?: string;
}

/* ---------- Patients & Digital Health Passport ---------- */
export interface PatientAccount {
  id: string;
  name: string;
  phone: string;
  city: string;
  members: string[];
  restricted?: boolean | undefined;
}
export type RecordField =
  "allergies" | "medications" | "conditions" | "careInstructions" | "labs" | "discharge";
export const FIELD_LABEL: Record<RecordField, string> = {
  allergies: "Allergies & alerts",
  medications: "Current medications",
  conditions: "Medical history",
  careInstructions: "Care instructions",
  labs: "Lab reports",
  discharge: "Discharge summary & follow-up",
};
export interface HealthRecord extends Record<RecordField, string> {
  member: string;
  patientId: string;
}
export interface AccessEntry {
  id: string;
  at: string;
  by: string;
  byRole: string;
  member: string;
  fields: RecordField[];
  purpose: string;
}

/** Minimum-necessary access: which parts of the passport each service may see. */
export const ACCESS_BY_SERVICE: Record<string, RecordField[]> = {
  "Wound dressing": ["allergies", "medications", "conditions", "careInstructions"],
  Injection: ["allergies", "medications"],
  "IV drip": ["allergies", "medications", "conditions"],
  "Vitals check": ["conditions", "medications"],
  "Doctor consultation": ["allergies", "medications", "conditions", "labs", "discharge"],
  "Hospital Companion Nurse": ["allergies", "conditions", "careInstructions"],
  "Hospital Navigator Nurse": ["conditions", "labs", "discharge"],
  "Physiotherapy session": ["conditions", "careInstructions"],
};

/** Access exists only while this professional is assigned to an active visit. */
export function allowedFields(r: ServiceRequest, p: Professional): RecordField[] {
  if (r.assignedTo !== p.id || p.suspended) return [];
  if (r.status !== "accepted" && r.status !== "notes_required") return [];
  return ACCESS_BY_SERVICE[r.service] ?? ["allergies"];
}

export function viewPatientInfo(r: ServiceRequest, p: Professional, records: HealthRecord[]) {
  const fields = allowedFields(r, p);
  if (!fields.length)
    fail(
      "You have no active care assignment for this patient, so their records are not available.",
    );
  const rec = records.find((x) => x.member === r.patientName);
  const data = Object.fromEntries(fields.map((f) => [f, rec?.[f] || "Not recorded"])) as Partial<
    Record<RecordField, string>
  >;
  const entry: AccessEntry = {
    id: uid("ax"),
    at: now(),
    by: p.name,
    byRole: p.role,
    member: r.patientName,
    fields,
    purpose: `${r.service} · request ${r.id}`,
  };
  return { data, entry };
}

/* ---------- Booking (patient) ---------- */
export const availabilityOf = (p: Professional) => p.availability ?? DEFAULT_AVAILABILITY;
const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function availableSlots(
  p: Professional,
  date: string,
  durationMin: number,
  list: ServiceRequest[],
): string[] {
  const a = availabilityOf(p);
  if (!a.days.includes(new Date(`${date}T00:00:00`).getDay())) return [];
  const out: string[] = [];
  for (let m = toMin(a.from); m + durationMin <= toMin(a.to); m += 30) {
    const probe = { date, start: hhmm(m), durationMin } as ServiceRequest;
    const busy = list.some(
      (x) =>
        ((x.assignedTo === p.id && (x.status === "accepted" || x.status === "notes_required")) ||
          (x.requestedProId === p.id && x.status === "pending")) &&
        overlaps(x, probe),
    );
    if (!busy) out.push(hhmm(m));
  }
  return out;
}

export interface BookingInput {
  patientId: string;
  member: string;
  service: string;
  date: string;
  start: string;
  proId: string;
  area: string;
  today: string;
}
export function createBooking(
  list: ServiceRequest[],
  services: ServiceDef[],
  pros: Professional[],
  i: BookingInput,
): ServiceRequest {
  const svc = services.find((s) => s.name === i.service) ?? fail("Service not found.");
  if (!svc.active) fail(`${svc.name} is not available for booking yet.`);
  if (!i.member.trim()) fail("Choose who the care is for.");
  if (i.date < i.today) fail("Choose a date from today onwards.");
  const pro = pros.find((p) => p.id === i.proId) ?? fail("Choose a professional.");
  if (!canProvide(pro, svc.name)) fail(`${pro.name} is not available for ${svc.name}.`);
  if (!availableSlots(pro, i.date, svc.durationMin, list).includes(i.start))
    fail("That time is no longer available. Pick another slot.");
  if (
    list.some(
      (r) =>
        r.patientId === i.patientId &&
        r.patientName === i.member &&
        r.service === svc.name &&
        r.date === i.date &&
        r.start === i.start &&
        (r.status === "pending" || r.status === "accepted"),
    )
  )
    fail("You already requested this booking.");
  return {
    id: uid("r"),
    patientId: i.patientId,
    patientName: i.member,
    patientInitials: i.member
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2),
    service: svc.name,
    date: i.date,
    start: i.start,
    durationMin: svc.durationMin,
    area: i.area,
    status: "pending",
    requestedProId: pro.id,
    version: 1,
    notes: [],
    history: [{ at: now(), by: i.member, action: `Booking requested with ${pro.name}` }],
  };
}

/** Patient (own booking) or admin (with reason) can cancel before the service is delivered. */
export function cancelBooking(
  list: ServiceRequest[],
  id: string,
  by: { name: string; patientId?: string; admin?: boolean },
  reason: string,
) {
  const r = list.find((x) => x.id === id) ?? fail("Booking not found.");
  if (!by.admin && r.patientId !== by.patientId) fail("You can only cancel your own bookings.");
  if (r.status !== "pending" && r.status !== "accepted")
    fail("Only pending or accepted bookings can be cancelled.");
  if (by.admin && reason.trim().length < 5) fail("Admin cancellations need a reason.");
  return list.map((x) =>
    x.id === id
      ? {
          ...x,
          status: "cancelled" as const,
          cancelReason: reason || "Cancelled by patient",
          version: x.version + 1,
          history: [
            ...x.history,
            { at: now(), by: by.name, action: `Cancelled${reason ? `: ${reason}` : ""}` },
          ],
        }
      : x,
  );
}

/* ---------- Ratings & complaints ---------- */
export interface Rating {
  id: string;
  requestId: string;
  proId: string;
  patientId: string;
  stars: number;
  text: string;
  at: string;
  hidden?: boolean | undefined;
  hiddenReason?: string | undefined;
}
export interface Complaint {
  id: string;
  fromId: string;
  fromName: string;
  about: string;
  text: string;
  at: string;
  status: "open" | "resolved";
  outcome?: string | undefined;
  resolvedBy?: string | undefined;
}

export function rateService(
  ratings: Rating[],
  r: ServiceRequest,
  patientId: string,
  stars: number,
  text: string,
): Rating {
  if (r.patientId !== patientId) fail("You can only rate your own bookings.");
  if (r.status !== "completed" || !r.assignedTo)
    fail("You can rate after the service is completed.");
  if (ratings.some((x) => x.requestId === r.id)) fail("You already rated this service.");
  if (!(stars >= 1 && stars <= 5)) fail("Choose 1 to 5 stars.");
  return {
    id: uid("rt"),
    requestId: r.id,
    proId: r.assignedTo!,
    patientId,
    stars,
    text: text.trim().slice(0, 500),
    at: now(),
  };
}
/** Moderation hides, never deletes or edits: the original stays for audit. */
export function moderateRating(ratings: Rating[], id: string, hide: boolean, reason: string) {
  if (hide && reason.trim().length < 5) fail("Give a moderation reason.");
  return ratings.map((x) =>
    x.id === id ? { ...x, hidden: hide, hiddenReason: hide ? reason : undefined } : x,
  );
}
export function fileComplaint(
  fromId: string,
  fromName: string,
  about: string,
  text: string,
): Complaint {
  if (text.trim().length < 10) fail("Describe the problem in a few words (10+ characters).");
  return { id: uid("cp"), fromId, fromName, about, text: text.trim(), at: now(), status: "open" };
}
export function resolveComplaint(list: Complaint[], id: string, admin: string, outcome: string) {
  if (outcome.trim().length < 5) fail("Record the outcome.");
  return list.map((c) =>
    c.id === id ? { ...c, status: "resolved" as const, outcome, resolvedBy: admin } : c,
  );
}

/* ---------- Admin: verification & accounts ---------- */
export const ROLE_SERVICES: Record<ProRole, string[]> = {
  "Registered Nurse": ["Wound dressing", "Injection", "Vitals check", "IV drip"],
  Doctor: ["Doctor consultation"],
  Physiotherapist: ["Physiotherapy session"],
  "Hospital Companion Nurse": ["Hospital Companion Nurse"],
  "Hospital Navigator Nurse": ["Hospital Navigator Nurse"],
};
export type Decision = "approve" | "more_info" | "reject";
export function adminDecide(
  p: Professional,
  d: Decision,
  note: string,
  services: string[],
  admin: string,
): Professional {
  if (p.verification !== "submitted")
    fail("Only applications submitted for review can be decided.");
  const stamp = { reviewedBy: admin, reviewedAt: now(), reviewNote: note };
  if (d === "approve") {
    if (!services.length) fail("Choose at least one service the professional may provide.");
    return {
      ...p,
      ...stamp,
      verification: "approved",
      approvedServices: services,
      actionNeeded: undefined,
      docs: p.docs.map((x) => ({ ...x, status: "verified" })),
    };
  }
  if (note.trim().length < 5) fail("Write what the applicant needs to know.");
  if (d === "more_info")
    return {
      ...p,
      ...stamp,
      verification: "more_info",
      actionNeeded: note,
      docs: p.docs.map((x) => (x.status === "checking" ? { ...x, status: "uploaded" } : x)),
    };
  return { ...p, ...stamp, verification: "rejected", actionNeeded: note };
}
export function setSuspended(p: Professional, on: boolean, reason: string): Professional {
  if (on && reason.trim().length < 5) fail("Give a reason for restricting the account.");
  return { ...p, suspended: on };
}
export function requestProfileUpdate(
  p: Professional,
  specialization: string,
  qualifications: string[],
): Professional {
  if (!specialization.trim()) fail("Specialization is required.");
  return {
    ...p,
    pendingProfile: {
      specialization: specialization.trim(),
      qualifications: qualifications.map((q) => q.trim()).filter(Boolean),
    },
  };
}
export function reviewProfileUpdate(p: Professional, approve: boolean): Professional {
  if (!p.pendingProfile) fail("No profile change is waiting for review.");
  return approve
    ? { ...p, ...p.pendingProfile, pendingProfile: undefined }
    : { ...p, pendingProfile: undefined };
}
export function setAvailability(
  p: Professional,
  a: { days: number[]; from: string; to: string },
): Professional {
  if (!a.days.length) fail("Choose at least one working day.");
  if (toMin(a.from) >= toMin(a.to)) fail("End time must be after start time.");
  return { ...p, availability: a };
}

/* ---------- Messages & notices ---------- */
export interface Thread {
  id: string;
  subject: string;
  participants: string[];
  names: Record<string, string>;
  requestId?: string | undefined;
}
export interface Message {
  id: string;
  threadId: string;
  from: string;
  fromName: string;
  text: string;
  at: string;
}
export type Audience = "all" | "patients" | "pros" | "admin" | (string & {});
export interface Notice {
  id: string;
  to: Audience;
  title: string;
  body: string;
  at: string;
  from: string;
}
export interface AdminAudit {
  id: string;
  at: string;
  by: string;
  action: string;
  context: string;
}

export function openThread(
  threads: Thread[],
  a: { id: string; name: string },
  b: { id: string; name: string },
  subject: string,
  requestId?: string,
) {
  const found = threads.find(
    (t) =>
      (requestId ? t.requestId === requestId : !t.requestId) &&
      t.participants.includes(a.id) &&
      t.participants.includes(b.id),
  );
  if (found) return { threads, id: found.id };
  const t: Thread = {
    id: uid("t"),
    subject,
    participants: [a.id, b.id],
    names: { [a.id]: a.name, [b.id]: b.name },
    requestId,
  };
  return { threads: [t, ...threads], id: t.id };
}
export function sendMessage(
  threads: Thread[],
  threadId: string,
  me: { id: string; name: string },
  text: string,
): Message {
  const t = threads.find((x) => x.id === threadId) ?? fail("Conversation not found.");
  if (!t.participants.includes(me.id)) fail("You are not part of this conversation.");
  const body = text.trim();
  if (!body) fail("Type a message.");
  if (body.length > 1000) fail("Message is too long (max 1000 characters).");
  return { id: uid("m"), threadId, from: me.id, fromName: me.name, text: body, at: now() };
}
export const notice = (to: Audience, title: string, body: string, from: string): Notice => ({
  id: uid("n"),
  to,
  title,
  body,
  at: now(),
  from,
});
export const noticesFor = (list: Notice[], meId: string, group: "patients" | "pros" | "admin") =>
  list.filter((n) => n.to === "all" || n.to === group || n.to === meId);
export const auditEntry = (by: string, action: string, context: string): AdminAudit => ({
  id: uid("au"),
  at: now(),
  by,
  action,
  context,
});
