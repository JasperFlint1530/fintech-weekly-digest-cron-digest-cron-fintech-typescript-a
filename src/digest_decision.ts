export type PaymentEvent = { id: string; amount: number; currency: string; risk: "low" | "review" | "blocked"; occurredAt: string };
export type Digest = { subject: string; totalAmount: number; reviewCount: number; eventIds: string[] };

export function buildWeeklyDigest(events: PaymentEvent[]): Digest {
  const review = events.filter((event) => event.risk !== "low");
  return {
    subject: `Weekly payments digest (${events.length} events)`,
    totalAmount: events.reduce((sum, event) => sum + event.amount, 0),
    reviewCount: review.length,
    eventIds: events.map((event) => event.id)
  };
}
