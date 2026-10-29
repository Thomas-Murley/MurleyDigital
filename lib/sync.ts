import "server-only";
import { settleDemoBilling, subscriptionFor } from "./billing";
import { applyStripePull, pullStripeSubscription, syncCheckoutSession } from "./stripe-billing";
import { getStore, mutate, mutateAsync } from "./store";

function demoDue(store: ReturnType<typeof getStore>, now: number) {
  return store.subscriptions.some((sub) => {
    if (sub.processor !== "demo" || !sub.paymentMethod || !sub.autopay || !sub.nextBillAt) return false;
    if (sub.status !== "active" && sub.status !== "past_due") return false;
    return new Date(sub.nextBillAt).getTime() <= now;
  });
}

export async function syncBilling() {
  const snapshot = getStore();
  const pulls: { id: string; pull: NonNullable<Awaited<ReturnType<typeof pullStripeSubscription>>> }[] = [];
  for (const sub of snapshot.subscriptions) {
    if (sub.processor !== "stripe" || !sub.stripeSubscriptionId) continue;
    const age = sub.lastSyncedAt ? Date.now() - new Date(sub.lastSyncedAt).getTime() : Number.POSITIVE_INFINITY;
    if (age < 15 * 60 * 1000) continue;
    const user = snapshot.users.find((item) => item.id === sub.userId);
    try {
      const pull = await pullStripeSubscription(sub, user?.name || "");
      if (pull) pulls.push({ id: sub.id, pull });
    } catch (error) {
      console.error("Stripe sync failed", error);
    }
  }
  if (!pulls.length && !demoDue(snapshot, Date.now())) return 0;
  return mutate((store) => {
    for (const item of pulls) {
      const sub = store.subscriptions.find((entry) => entry.id === item.id);
      if (sub) applyStripePull(store, sub, item.pull);
    }
    return settleDemoBilling(store);
  });
}

export async function completeCheckout(userId: string, sessionId: string) {
  const sub = subscriptionFor(getStore(), userId);
  if (!sub || sub.processor !== "stripe") return { error: "No Stripe subscription." };
  return mutateAsync(async (store) => syncCheckoutSession(store, sessionId, userId));
}
