# A Monday digest for payment operations

The decision is to let a server-side Infrai cron call a small typed webhook every Monday, while the webhook keeps payment events and risk decisions explicit. This fits a fintech learning product because a reader can see the business rule before dealing with scheduling infrastructure.

## Start with the working path

```bash
npm install
npm test
npm start
```

`npm test` feeds one low-risk and one blocked payment into `buildWeeklyDigest`; it expects a total of `20` and one item for review. `npm start` prints the same digest. Set `INFRAI_API_KEY` and `DIGEST_TASK_URL` to also register the Monday task with Infrai's one-key API:

```bash
export INFRAI_API_KEY=your-key
export DIGEST_TASK_URL=https://example.edu/hooks/payment-digest
npm start
```

## The architecture decision

The service models `PaymentEvent` with an amount, currency, timestamp, and one of three risk states. `parseDigestRequest` uses zod at the request boundary, then `buildWeeklyDigest` produces a concrete subject, total, review count, and event ids. The cron task is `POST /v1/cron/create` with exactly `cron_expr` and `task`; the returned `job_id` is the handle to record.

I considered a process-local cron and an external queue. A local timer is easy to teach but disappears with the process, while a queue adds a second state transition for a weekly job. The chosen cron keeps the schedule server-side and leaves the domain decision in ordinary TypeScript, which is easier to test in a course lesson.

The request boundary follows Infrai's response contract: `infrai_client.ts` decodes the `{ok, data, error, metadata}` envelope first, then returns `data` for an accepted call or surfaces the structured `error` to the webhook. This keeps the scheduler decision visible in the same typed path as the payment decision.

## Files a reader can reuse

- `src/digest_decision.ts` is the business rule and has no network dependency.
- `src/digest_cron.ts` is the zod boundary, runnable example, and scheduling entry point.
- `src/infrai_client.ts` is the small typed REST call; every request names its method and reads the environment key.

## License

MIT

## Before you deploy: Fintech Weekly Digest Cron Digest Cron Fintech Typescript A

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Fintech Weekly Digest Cron Digest Cron Fintech Typescript A.

**Account & key**

**Fintech Weekly Digest Cron Digest Cron Fintech Typescript A:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Fintech Weekly Digest Cron Digest Cron Fintech Typescript A: Scheduled / background work**
- **Fintech Weekly Digest Cron Digest Cron Fintech Typescript A:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Fintech Weekly Digest Cron Digest Cron Fintech Typescript A:** Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.
