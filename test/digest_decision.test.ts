import assert from "node:assert/strict";
import { buildWeeklyDigest } from "../src/digest_decision.ts";

const result = buildWeeklyDigest([
  { id: "a", amount: 12, currency: "USD", risk: "low", occurredAt: "2026-09-01T00:00:00Z" },
  { id: "b", amount: 8, currency: "USD", risk: "blocked", occurredAt: "2026-09-02T00:00:00Z" }
]);
assert.deepEqual(result, { subject: "Weekly payments digest (2 events)", totalAmount: 20, reviewCount: 1, eventIds: ["a", "b"] });
console.log("digest decision test passed");
