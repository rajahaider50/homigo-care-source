import type { Professional, ServiceRequest, CredentialDoc } from "./rules";
import type {
  ServiceDef,
  PatientAccount,
  HealthRecord,
  Thread,
  Message,
  Notice,
  Rating,
  Complaint,
} from "./platform";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
// Fixed seed timestamp so server and browser render identical text.
const SEED_AT = `${day(-7)}T09:00:00.000Z`;
const docs = (st: CredentialDoc["status"][]): CredentialDoc[] => [
  { id: "cnic", name: "CNIC (front & back)", issuer: "NADRA", kind: "credential", status: st[0]! },
  {
    id: "degree",
    name: "Nursing / medical degree",
    issuer: "University of Health Sciences",
    kind: "credential",
    status: st[1]!,
  },
  {
    id: "council",
    name: "Council registration",
    issuer: "PNMC / PMDC",
    kind: "credential",
    status: st[2]!,
  },
  {
    id: "letter",
    name: "Experience letter",
    issuer: "Previous employer",
    kind: "employment",
    status: st[3]!,
  },
];

export const seedPros: Professional[] = [
  {
    id: "pro-ayesha",
    name: "Ayesha Raza",
    initials: "AR",
    role: "Registered Nurse",
    experienceYears: 8,
    specialization: "Wound care",
    qualifications: ["BSc Nursing", "PNMC registered"],
    approvedServices: ["Wound dressing", "Injection", "Vitals check", "IV drip"],
    verification: "approved",
    docs: docs(["verified", "verified", "verified", "verified"]),
    employment: [{ employer: "Mayo Hospital, Lahore", position: "Staff Nurse", years: 8 }],
    assessment: { answers: {}, score: 0.8, completedAt: day(-40) },
  },
  {
    id: "pro-bilal",
    name: "Bilal Ahmed",
    initials: "BA",
    role: "Hospital Navigator Nurse",
    experienceYears: 0,
    specialization: "",
    qualifications: [],
    approvedServices: [],
    verification: "in_progress",
    docs: docs(["uploaded", "missing", "missing", "missing"]),
    employment: [],
    assessment: { answers: {} },
  },
  {
    id: "pro-hina",
    name: "Dr. Hina Qureshi",
    initials: "HQ",
    role: "Doctor",
    experienceYears: 11,
    specialization: "General physician",
    qualifications: ["MBBS", "FCPS (Medicine)", "PMDC registered"],
    approvedServices: ["Doctor consultation"],
    verification: "approved",
    docs: docs(["verified", "verified", "verified", "verified"]),
    employment: [
      { employer: "Services Hospital, Lahore", position: "Consultant Physician", years: 11 },
    ],
    assessment: { answers: {}, score: 1, completedAt: day(-60) },
  },
  {
    id: "pro-fatima",
    name: "Fatima Noor",
    initials: "FN",
    role: "Hospital Companion Nurse",
    experienceYears: 5,
    specialization: "Bedside support",
    qualifications: ["Diploma in Nursing", "PNMC registered"],
    approvedServices: ["Hospital Companion Nurse"],
    verification: "approved",
    docs: docs(["verified", "verified", "verified", "verified"]),
    availability: { days: [0, 1, 2, 3, 4, 5, 6], from: "08:00", to: "20:00" },
    employment: [{ employer: "Jinnah Hospital, Lahore", position: "Ward Nurse", years: 5 }],
    assessment: { answers: {}, score: 0.8, completedAt: day(-30) },
  },
];

const req = (
  r: Partial<ServiceRequest> &
    Pick<ServiceRequest, "id" | "patientName" | "service" | "date" | "start">,
): ServiceRequest => ({
  patientInitials: r.patientName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2),
  durationMin: 60,
  area: "DHA Phase 5, Lahore",
  status: "pending",
  version: 1,
  history: [{ at: SEED_AT, by: "Patient", action: "Booking requested" }],
  notes: [],
  ...r,
});

export const seedRequests: ServiceRequest[] = [
  req({
    id: "r7",
    patientId: "patient-sara",
    patientName: "Ali Khan",
    service: "Doctor consultation",
    date: day(1),
    start: "17:00",
    durationMin: 30,
    requestedProId: "pro-hina",
  }),
  req({
    id: "r1",
    patientId: "patient-sara",
    patientName: "Ahmed Khan",
    service: "Wound dressing",
    date: day(1),
    start: "10:00",
  }),
  req({
    id: "r2",
    patientId: "patient-zainab",
    patientName: "Zainab Ali",
    service: "Injection",
    date: day(1),
    start: "10:30",
    durationMin: 30,
    area: "Gulberg III, Lahore",
  }),
  req({
    id: "r3",
    patientId: "patient-hamza",
    patientName: "Hamza Siddiqui",
    service: "Physiotherapy session",
    date: day(2),
    start: "16:00",
    area: "Model Town, Lahore",
  }),
  req({
    id: "r4",
    patientId: "patient-nadia",
    patientName: "Nadia Hussain",
    service: "Vitals check",
    date: day(2),
    start: "09:00",
    durationMin: 30,
    status: "accepted",
    assignedTo: "pro-ayesha",
    version: 2,
  }),
  req({
    id: "r5",
    patientId: "patient-ali",
    patientName: "Ali Raza",
    service: "IV drip",
    date: day(-1),
    start: "15:00",
    durationMin: 90,
    status: "notes_required",
    assignedTo: "pro-ayesha",
    version: 3,
  }),
  req({
    id: "r6",
    patientId: "patient-sara",
    patientName: "Sara Khan",
    service: "Injection",
    date: day(-3),
    start: "11:00",
    durationMin: 30,
    status: "completed",
    assignedTo: "pro-ayesha",
    version: 5,
    notes: [
      {
        version: 1,
        serviceDelivered: "IM injection as prescribed",
        observations: "Vitals stable, site clean",
        procedures: "Injection given, left deltoid",
        response: "Tolerated well",
        followUp: "Next dose in 7 days",
        escalation: "",
        submittedBy: "Ayesha Raza",
        submittedAt: SEED_AT,
      },
    ],
  }),
];

export const PATIENT_ID = "patient-sara";
export const seedPatients: PatientAccount[] = [
  {
    id: "patient-sara",
    name: "Sara Khan",
    phone: "0300 1234567",
    city: "Lahore",
    members: ["Sara Khan", "Ahmed Khan", "Zainab Khan", "Ali Khan"],
  },
  {
    id: "patient-zainab",
    name: "Zainab Ali",
    phone: "0301 7654321",
    city: "Lahore",
    members: ["Zainab Ali"],
  },
  {
    id: "patient-hamza",
    name: "Hamza Siddiqui",
    phone: "0302 1112223",
    city: "Lahore",
    members: ["Hamza Siddiqui"],
  },
  {
    id: "patient-nadia",
    name: "Nadia Hussain",
    phone: "0303 4445556",
    city: "Lahore",
    members: ["Nadia Hussain"],
  },
  {
    id: "patient-ali",
    name: "Ali Raza",
    phone: "0304 7778889",
    city: "Lahore",
    members: ["Ali Raza"],
  },
];

const rec = (member: string, patientId: string, r: Partial<HealthRecord>): HealthRecord => ({
  member,
  patientId,
  allergies: "",
  medications: "",
  conditions: "",
  careInstructions: "",
  labs: "",
  discharge: "",
  ...r,
});
export const seedRecords: HealthRecord[] = [
  rec("Ahmed Khan", "patient-sara", {
    allergies: "Penicillin",
    medications: "Metformin 500mg twice daily",
    conditions: "Type 2 diabetes; leg wound after surgery",
    careInstructions: "Clean with saline, non-adhesive dressing every 2 days",
    labs: "HbA1c 7.9% (Oct)",
    discharge: "Discharged from City Hospital 2 Nov; review in 4 weeks",
  }),
  rec("Sara Khan", "patient-sara", {
    allergies: "None known",
    medications: "Vitamin D weekly",
    conditions: "Mild anaemia",
  }),
  rec("Ali Khan", "patient-sara", {
    allergies: "Dust",
    medications: "Salbutamol inhaler as needed",
    conditions: "Asthma",
    labs: "Chest X-ray clear (Sep)",
  }),
  rec("Zainab Khan", "patient-sara", { allergies: "None known", conditions: "Healthy" }),
  rec("Zainab Ali", "patient-zainab", {
    allergies: "Sulfa drugs",
    medications: "B12 injection monthly",
    conditions: "B12 deficiency",
  }),
  rec("Nadia Hussain", "patient-nadia", {
    conditions: "Hypertension",
    medications: "Amlodipine 5mg",
  }),
  rec("Ali Raza", "patient-ali", {
    allergies: "None known",
    medications: "IV fluids as per hospital plan",
    conditions: "Dehydration after gastroenteritis",
  }),
];

const svc = (
  name: string,
  category: ServiceDef["category"],
  price: number,
  durationMin: number,
  active: boolean,
  about: string,
  scope?: string,
): ServiceDef => ({
  name,
  category,
  price,
  durationMin,
  active,
  about,
  ...(scope ? { scope } : {}),
});
export const seedServices: ServiceDef[] = [
  svc(
    "Wound dressing",
    "Home nursing",
    2500,
    60,
    true,
    "Sterile wound cleaning and dressing at home by a verified nurse.",
  ),
  svc("Injection", "Home nursing", 1200, 30, true, "Prescribed injections given at home."),
  svc(
    "Vitals check",
    "Home nursing",
    1500,
    30,
    true,
    "Blood pressure, sugar, pulse, temperature and oxygen check.",
  ),
  svc(
    "IV drip",
    "Home nursing",
    3500,
    90,
    true,
    "Prescribed IV drip set up and monitored at home.",
  ),
  svc(
    "Doctor consultation",
    "Doctor consultation",
    3000,
    30,
    true,
    "Consultation with a verified doctor.",
  ),
  svc(
    "Hospital Companion Nurse",
    "Hospital Companion Nurse",
    6000,
    480,
    true,
    "Bedside support during a hospital stay: daily-care help, comfort, mobility support, and passing concerns to the treating team.",
    "Works within hospital policy and the treating team's orders. Does not replace the hospital team or change prescribed treatment.",
  ),
  svc(
    "Hospital Navigator Nurse",
    "Hospital Navigator Nurse",
    4000,
    60,
    true,
    "Help after discharge: booking follow-ups, coordinating specialist visits, organising reports and prescriptions, explaining next steps already advised.",
    "Coordinates care only. No independent diagnosis or prescribing.",
  ),
  svc("Physiotherapy session", "Physiotherapy", 2800, 60, false, "Home physiotherapy session."),
  svc(
    "Lab sample at home",
    "Laboratory",
    500,
    30,
    false,
    "Sample collection at home for lab tests.",
  ),
  svc(
    "Pharmacy delivery",
    "Pharmacy",
    200,
    30,
    false,
    "Medicine delivery from partner pharmacies.",
  ),
  svc(
    "Nutrition support",
    "Nutrition support",
    2000,
    45,
    false,
    "Diet plan and counselling with a nutritionist.",
  ),
];

export const seedThreads: Thread[] = [
  {
    id: "t-r6",
    subject: "Injection · Sara Khan",
    participants: ["patient-sara", "pro-ayesha"],
    names: { "patient-sara": "Sara Khan", "pro-ayesha": "Ayesha Raza" },
    requestId: "r6",
  },
  {
    id: "t-support-sara",
    subject: "Support",
    participants: ["patient-sara", "admin"],
    names: { "patient-sara": "Sara Khan", admin: "HOMIGO CARE Admin" },
  },
];
export const seedMessages: Message[] = [
  {
    id: "m1",
    threadId: "t-r6",
    from: "patient-sara",
    fromName: "Sara Khan",
    text: "Should I keep the injection site covered?",
    at: SEED_AT,
  },
  {
    id: "m2",
    threadId: "t-r6",
    from: "pro-ayesha",
    fromName: "Ayesha Raza",
    text: "Yes, keep it clean and dry for today. Contact your doctor if there is swelling.",
    at: SEED_AT,
  },
  {
    id: "m3",
    threadId: "t-support-sara",
    from: "admin",
    fromName: "HOMIGO CARE Admin",
    text: "Welcome to HOMIGO CARE. Message us here for any account or booking help.",
    at: SEED_AT,
  },
];
export const seedNotices: Notice[] = [
  {
    id: "n1",
    to: "all",
    title: "Welcome to HOMIGO CARE",
    body: "Because care begins at home. This is a prototype with demo data.",
    at: SEED_AT,
    from: "Admin",
  },
];
export const seedRatings: Rating[] = [
  {
    id: "rt1",
    requestId: "old-1",
    proId: "pro-ayesha",
    patientId: "patient-nadia",
    stars: 5,
    text: "Very gentle and on time.",
    at: SEED_AT,
  },
  {
    id: "rt2",
    requestId: "old-2",
    proId: "pro-hina",
    patientId: "patient-zainab",
    stars: 4,
    text: "Explained everything clearly.",
    at: SEED_AT,
  },
];
export const seedComplaints: Complaint[] = [
  {
    id: "cp1",
    fromId: "patient-hamza",
    fromName: "Hamza Siddiqui",
    about: "Booking",
    text: "My physiotherapy request has had no reply for 2 days.",
    at: SEED_AT,
    status: "open",
  },
];
