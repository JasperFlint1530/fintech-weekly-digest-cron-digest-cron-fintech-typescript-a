import { z } from "zod";
import { infrai } from "./infrai_client.ts";
import { buildWeeklyDigest, type PaymentEvent } from "./digest_decision.ts";

const requestSchema = z.object({ events: z.array(z.object({
  id: z.string(), amount: z.number().nonnegative(), currency: z.string().length(3),
  risk: z.enum(["low", "review", "blocked"]), occurredAt: z.string().datetime()
})) });

export function parseDigestRequest(input: unknown): PaymentEvent[] { return requestSchema.parse(input).events; }

export async function scheduleDigest(taskUrl: string): Promise<string> {
  const job = await infrai.cron.create({ cron_expr: "0 9 * * 1", task: taskUrl });
  return job.job_id;
}

export async function runExample(): Promise<void> {
  const events = parseDigestRequest({ events: [{ id: "pay_101", amount: 240, currency: "USD", risk: "low", occurredAt: "2026-09-01T10:00:00Z" }, { id: "pay_102", amount: 90, currency: "USD", risk: "review", occurredAt: "2026-09-02T10:00:00Z" }] });
  console.log(buildWeeklyDigest(events));
  if (process.env.DIGEST_TASK_URL) console.log(`scheduled job: ${await scheduleDigest(process.env.DIGEST_TASK_URL)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) runExample().catch((error) => { console.error(error); process.exitCode = 1; });
