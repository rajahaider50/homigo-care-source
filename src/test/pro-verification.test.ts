import { describe, expect, it } from "vitest";
import {
  MCQ,
  submitAssessment,
  submitForReview,
  uploadDoc,
  addEmployment,
  ProRuleError,
} from "@/lib/pro/rules";
import { seedPros } from "@/lib/pro/seed";

const applicant = () => structuredClone(seedPros[1]!);
const allRight = Object.fromEntries(MCQ.map((m) => [m.id, m.a]));
const ready = () => {
  let p = applicant();
  for (const d of p.docs) if (d.status === "missing") p = uploadDoc(p, d.id, `${d.id}.pdf`);
  p = addEmployment(p, { employer: "Services Hospital", position: "Staff Nurse", years: 3 });
  return submitAssessment(p, allRight);
};

describe("professional verification", () => {
  it("cannot submit for review with missing documents", () => {
    expect(() => submitForReview(applicant())).toThrow(ProRuleError);
  });
  it("cannot submit when the knowledge test is below the pass mark", () => {
    const p = submitAssessment(ready(), Object.fromEntries(MCQ.map((m) => [m.id, (m.a + 1) % 4])));
    expect(() => submitForReview(p)).toThrow(/knowledge test/);
  });
  it("submitting sends to admin review and never marks the professional verified", () => {
    const p = submitForReview(ready());
    expect(p.verification).toBe("submitted");
    expect(
      p.docs.some(
        (d) =>
          d.status === "verified" &&
          seedPros[1]!.docs.find((x) => x.id === d.id)?.status !== "verified",
      ),
    ).toBe(false);
  });
  it("locks uploads while under review", () => {
    const p = submitForReview(ready());
    expect(() => uploadDoc(p, "cnic", "new.pdf")).toThrow(/locked/);
  });
});
