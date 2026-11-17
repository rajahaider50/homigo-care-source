// Prototype store shared by the Patient, Professional and Admin panels, saved on this device.
// Every panel reads and writes the same state, so admin updates and messages show up everywhere.
// All changes go through the pure rules in ./rules and ./platform so the checks can move to a server later.
import { useSyncExternalStore } from "react";
import { ProRuleError, type Professional, type ServiceRequest } from "./rules";
import type {
  AccessEntry,
  AdminAudit,
  Complaint,
  HealthRecord,
  Message,
  Notice,
  PatientAccount,
  Rating,
  ServiceDef,
  Thread,
} from "./platform";
import {
  seedComplaints,
  seedMessages,
  seedNotices,
  seedPatients,
  seedPros,
  seedRatings,
  seedRecords,
  seedRequests,
  seedServices,
  seedThreads,
} from "./seed";

export interface ProState {
  currentProId: string;
  pros: Professional[];
  requests: ServiceRequest[];
  patients: PatientAccount[];
  records: HealthRecord[];
  services: ServiceDef[];
  threads: Thread[];
  messages: Message[];
  notices: Notice[];
  accessLog: AccessEntry[];
  ratings: Rating[];
  complaints: Complaint[];
  audit: AdminAudit[];
}
const KEY = "homigo-care-v2";
const seed: ProState = {
  currentProId: "pro-ayesha",
  pros: seedPros,
  requests: seedRequests,
  patients: seedPatients,
  records: seedRecords,
  services: seedServices,
  threads: seedThreads,
  messages: seedMessages,
  notices: seedNotices,
  accessLog: [],
  ratings: seedRatings,
  complaints: seedComplaints,
  audit: [],
};
let state: ProState | null = null;
const listeners = new Set<() => void>();

function get(): ProState {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...seed, ...(JSON.parse(raw) as Partial<ProState>) } : seed;
  } catch {
    state = seed;
  }
  return state;
}
function set(next: ProState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked */
  }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  // Other open tabs (e.g. admin in one tab, patient in another) stay in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      listeners.forEach((x) => x());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};

export function useProState() {
  const s = useSyncExternalStore(subscribe, get, () => seed);
  const pro = s.pros.find((p) => p.id === s.currentProId) ?? s.pros[0]!;
  return { ...s, pro };
}

/** Runs a rule; returns an error message instead of throwing so screens can show it. */
export function act(fn: (s: ProState, pro: Professional) => Partial<ProState>): string | null {
  const s = get();
  const pro = s.pros.find((p) => p.id === s.currentProId) ?? s.pros[0]!;
  try {
    set({ ...s, ...fn(s, pro) });
    return null;
  } catch (e) {
    if (e instanceof ProRuleError) return e.message;
    throw e;
  }
}
export const updatePro = (p: Professional): Partial<ProState> => ({
  pros: get().pros.map((x) => (x.id === p.id ? p : x)),
});
export const switchPro = (id: string) => set({ ...get(), currentProId: id });
export const resetDemo = () => set(seed);
