import "server-only";
import { addMonths } from "./format";
import { newId } from "./passwords";
import { logEvent } from "./store";
import type { Invoice, PaymentMethod, StoreData, Subscription } from "./types";

export function subscriptionFor(store: StoreData, userId: string) {
  return store.subscriptions.find((item) => item.userId === userId) || null;
}

export function invoicesFor(store: StoreData, userId: string) {
  return store.invoices.filter((item) => item.userId === userId);
}

function nextNumber(store: StoreData) {
  const n = store.settings.nextInvoice;
  store.settings.nextInvoice += 1;
  return `MRL-${String(n).padStart(4, "0")}`;
}

export function addInvoice(
  store: StoreData,
  sub: Subscription,
  input: {
    status: Invoice["status"];
    periodStart: string;
    periodEnd: string;
    description?: string;
    stripeInvoiceId?: string | null;
    amountCents?: number;
  },
) {
  if (input.stripeInvoiceId && store.invoices.some((item) => item.stripeInvoiceId === input.stripeInvoiceId)) {
    const existing = store.invoices.find((item) => item.stripeInvoiceId === input.stripeInvoiceId)!;
    existing.status = input.status;
    if (input.status === "paid" && !existing.paidAt) existing.paidAt = new Date().toISOString();
    return existing;
  }
  const now = new Date().toISOString();
  const invoice: Invoice = {
    id: newId("inv"),
    number: nextNumber(store),
    userId: sub.userId,
    subscriptionId: sub.id,
    amountCents: input.amountCents ?? sub.monthlyAmountCents,
    currency: "usd",
    status: input.status,
    description: input.description || `Hosting for ${sub.siteName}`,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    createdAt: now,
    paidAt: input.status === "paid" ? now : null,
    brand: sub.paymentMethod?.brand || null,
    last4: sub.paymentMethod?.last4 || null,
    stripeInvoiceId: input.stripeInvoiceId || null,
  };
  store.invoices.unshift(invoice);
  return invoice;
}

export function activateDemoBilling(store: StoreData, sub: Subscription, method: PaymentMethod) {
  const now = new Date().toISOString();
  const periodEnd = addMonths(now, 1);
  sub.paymentMethod = method;
  sub.status = "active";
  sub.autopay = true;
  sub.startedAt = sub.startedAt || now;
  sub.nextBillAt = periodEnd;
  sub.cancelAtPeriodEnd = false;
  sub.updatedAt = now;
  const invoice = addInvoice(store, sub, {
    status: "paid",
    periodStart: now,
    periodEnd,
    description: `Hosting for ${sub.siteName}, first period`,
  });
  logEvent(store, `${sub.siteName} hosting started at the saved card.`, `/admin/clients/${sub.userId}`);
  return invoice;
}

export function replaceDemoCard(sub: Subscription, method: PaymentMethod) {
  sub.paymentMethod = method;
  sub.updatedAt = new Date().toISOString();
  if (sub.status === "past_due") sub.status = "active";
}

/** Records demo charges whose date has arrived. Stripe subscriptions are synced separately. */
export function settleDemoBilling(store: StoreData, now = new Date()) {
  let created = 0;
  for (const sub of store.subscriptions) {
    if (sub.processor !== "demo") continue;
    if (!sub.paymentMethod || !sub.autopay || !sub.nextBillAt) continue;
    if (sub.status !== "active" && sub.status !== "past_due") continue;
    let guard = 0;
    while (sub.nextBillAt && new Date(sub.nextBillAt).getTime() <= now.getTime() && guard < 24) {
      const periodStart = sub.nextBillAt;
      if (sub.cancelAtPeriodEnd) {
        sub.status = "canceled";
        sub.canceledAt = now.toISOString();
        sub.autopay = false;
        sub.nextBillAt = null;
        sub.updatedAt = now.toISOString();
        logEvent(store, `${sub.siteName} hosting ended at the close of the paid period.`, `/admin/clients/${sub.userId}`);
        break;
      }
      const periodEnd = addMonths(periodStart, 1);
      addInvoice(store, sub, {
        status: "paid",
        periodStart,
        periodEnd,
        description: `Hosting for ${sub.siteName}`,
      });
      sub.nextBillAt = periodEnd;
      sub.status = "active";
      sub.updatedAt = now.toISOString();
      created += 1;
      guard += 1;
    }
  }
  return created;
}

export function monthlyRecurringCents(store: StoreData) {
  return store.subscriptions
    .filter((sub) => sub.status === "active" || sub.status === "past_due")
    .reduce((sum, sub) => sum + sub.monthlyAmountCents, 0);
}
