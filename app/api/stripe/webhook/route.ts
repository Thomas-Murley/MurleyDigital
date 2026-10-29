import { verifyStripeEvent, applyStripeEvent } from "@/lib/stripe-billing";
import { mutate } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");
  const verified = verifyStripeEvent(raw, signature);
  if ("error" in verified) {
    return Response.json({ error: verified.error }, { status: 400 });
  }
  await mutate((store) => {
    applyStripeEvent(store, verified.event);
  });
  return Response.json({ received: true });
}
