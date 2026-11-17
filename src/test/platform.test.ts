import { describe, expect, it } from "vitest";
import { acceptRequest } from "@/lib/pro/rules";
import {
  adminDecide,
  allowedFields,
  availableSlots,
  cancelBooking,
  createBooking,
  rateService,
  sendMessage,
  setSuspended,
  viewPatientInfo,
  moderateRating,
} from "@/lib/pro/platform";
import {
  seedPros,
  seedRequests,
  seedServices,
  seedRecords,
  seedThreads,
  seedRatings,
} from "@/lib/pro/seed";

const pros = () => structuredClone(seedPros);
const list = () => structuredClone(seedRequests);
const ayesha = seedPros[0]!,
  bilal = seedPros[1]!;
const nextMonday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
};
const base = {
  patientId: "patient-sara",
  member: "Ahmed Khan",
  service: "Injection",
  proId: "pro-ayesha",
  area: "Lahore",
  today: "2000-01-01",
};

describe("patient booking", () => {
  it("cannot book a service admin has not made live", () => {
    expect(() =>
      createBooking(list(), seedServices, pros(), {
        ...base,
        service: "Nutrition support",
        date: nextMonday(),
        start: "09:00",
      }),
    ).toThrow(/not available/);
  });
  it("only offers free slots and blocks a duplicate request", () => {
    const date = nextMonday();
    const r = createBooking(list(), seedServices, pros(), { ...base, date, start: "09:00" });
    expect(r.status).toBe("pending");
    const after = [r, ...list()];
    expect(availableSlots(ayesha, date, 30, after)).not.toContain("09:00");
    expect(() =>
      createBooking(after, seedServices, pros(), { ...base, date, start: "09:00" }),
    ).toThrow();
  });
  it("patient can only cancel their own booking", () => {
    expect(() =>
      cancelBooking(list(), "r2", { name: "Sara", patientId: "patient-sara" }, ""),
    ).toThrow(/own bookings/);
  });
  it("rating only after completion, once", () => {
    const l = list();
    expect(() =>
      rateService(
        [],
        l.find((r) => r.id === "r1")!,
        "patient-sara",
        5,
        "",
      ),
    ).toThrow(/completed/);
    const rt = rateService(
      [],
      l.find((r) => r.id === "r6")!,
      "patient-sara",
      5,
      "Great",
    );
    expect(() =>
      rateService(
        [rt],
        l.find((r) => r.id === "r6")!,
        "patient-sara",
        4,
        "",
      ),
    ).toThrow(/already/);
  });
});

describe("privacy", () => {
  it("wound dressing nurse sees wound-related fields but not lab reports", () => {
    const accepted = acceptRequest(list(), "r1", ayesha, 1).find((r) => r.id === "r1")!;
    const f = allowedFields(accepted, ayesha);
    expect(f).toContain("careInstructions");
    expect(f).not.toContain("labs");
    expect(viewPatientInfo(accepted, ayesha, seedRecords).entry.member).toBe("Ahmed Khan");
  });
  it("no access to a pending or completed request", () => {
    expect(
      allowedFields(
        list().find((r) => r.id === "r6")!,
        ayesha,
      ),
    ).toEqual([]);
    expect(() =>
      viewPatientInfo(
        list().find((r) => r.id === "r1")!,
        ayesha,
        seedRecords,
      ),
    ).toThrow();
  });
  it("only participants can post in a conversation", () => {
    expect(() => sendMessage(seedThreads, "t-r6", { id: "pro-hina", name: "Hina" }, "hi")).toThrow(
      /not part/,
    );
  });
});

describe("admin", () => {
  it("cannot approve an application that was not submitted", () => {
    expect(() => adminDecide(bilal, "approve", "", ["Hospital Navigator Nurse"], "Admin")).toThrow(
      /submitted/,
    );
  });
  it("approval sets verified services and records reviewer", () => {
    const p = adminDecide(
      { ...bilal, verification: "submitted" },
      "approve",
      "",
      ["Hospital Navigator Nurse"],
      "Admin",
    );
    expect(p.verification).toBe("approved");
    expect(p.approvedServices).toEqual(["Hospital Navigator Nurse"]);
    expect(p.reviewedBy).toBe("Admin");
  });
  it("restricted professional cannot accept requests", () => {
    expect(() =>
      acceptRequest(list(), "r1", setSuspended(ayesha, true, "Under investigation"), 1),
    ).toThrow(/restricted/);
  });
  it("hiding a rating keeps the original text", () => {
    const r = moderateRating(seedRatings, "rt1", true, "Contains personal info")[0]!;
    expect(r.hidden).toBe(true);
    expect(r.text).toBe("Very gentle and on time.");
  });
});
