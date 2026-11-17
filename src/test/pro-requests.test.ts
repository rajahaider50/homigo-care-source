import { describe, expect, it } from "vitest";
import {
  acceptRequest,
  amendNotes,
  closeRequest,
  markDelivered,
  submitNotes,
  ProRuleError,
} from "@/lib/pro/rules";
import { seedPros, seedRequests } from "@/lib/pro/seed";

const ayesha = seedPros[0]!,
  bilal = seedPros[1]!;
const list = () => structuredClone(seedRequests);
const note = {
  serviceDelivered: "IV drip 500ml",
  observations: "BP 120/80",
  procedures: "",
  response: "",
  followUp: "",
  escalation: "",
};

describe("service requests", () => {
  it("unapproved professional cannot accept", () => {
    expect(() => acceptRequest(list(), "r1", bilal, 1)).toThrow(/approved professionals/);
  });
  it("cannot accept a service the professional is not approved for", () => {
    expect(() => acceptRequest(list(), "r3", ayesha, 1)).toThrow(/not approved to provide/);
  });
  it("second accept with a stale version fails (no double booking)", () => {
    const after = acceptRequest(list(), "r1", ayesha, 1);
    expect(() => acceptRequest(after, "r1", { ...ayesha, id: "other" }, 1)).toThrow(
      /no longer available/,
    );
  });
  it("cannot accept an overlapping time slot", () => {
    const after = acceptRequest(list(), "r1", ayesha, 1); // 10:00–11:00
    expect(() => acceptRequest(after, "r2", ayesha, 1)).toThrow(/Time clash/); // 10:30
  });
  it("request cannot close while service notes are missing", () => {
    const delivered = markDelivered(acceptRequest(list(), "r1", ayesha, 1), "r1", ayesha);
    expect(delivered.find((r) => r.id === "r1")!.status).toBe("notes_required");
    expect(() => closeRequest(delivered, "r1", ayesha)).toThrow(ProRuleError);
  });
  it("submitting valid notes records author and completes the request", () => {
    const done = submitNotes(list(), "r5", ayesha, note).find((r) => r.id === "r5")!;
    expect(done.status).toBe("completed");
    expect(done.notes[0]!.submittedBy).toBe("Ayesha Raza");
  });
  it("notes missing required fields are refused", () => {
    expect(() => submitNotes(list(), "r5", ayesha, { ...note, observations: "" })).toThrow(
      /observations/,
    );
  });
  it("amendment keeps the original version", () => {
    const r = amendNotes(
      list(),
      "r6",
      ayesha,
      { ...note, observations: "Corrected" },
      "Typo in observations",
    ).find((x) => x.id === "r6")!;
    expect(r.notes).toHaveLength(2);
    expect(r.notes[0]!.observations).toBe("Vitals stable, site clean");
    expect(r.notes[1]!.amendReason).toBe("Typo in observations");
  });
});
