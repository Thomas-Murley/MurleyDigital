import "server-only";
import Stripe from "stripe";
import { addInvoice } from "./billing";
import { logEvent } from "./store";
import type { PaymentMethod, StoreData, Subscription, SubscriptionStatus } from "./types";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function mapStatus(status: Stripe.Subscription.Status, hasCard: boolean): SubscriptionStatus {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "paused") return "paused";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  if (status === "incomplete") return hasCard ? "past_due" : "awaiting_payment";
  return "awaiting_payment";
}

function cardFromPaymentMethod(pm: Stripe.PaymentMethod | null | undefined, fallbackName: string): PaymentMethod | null {
  if (!pm || pm.type !== "card" || !pm.card) return null;
  return {
    brand: pm.card.brand || "card",
    last4: pm.card.last4 || "0000",
    expMonth: pm.card.exp_month,
    expYear: pm.card.exp_year,
    name: pm.billing_details?.name || fallbackName,
    postal: pm.billing_details?.address?.postal_code || "",
    addedAt: new Date().toISOString(),
    providerId: pm.id,
  };
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const record = invoice as Stripe.Invoice & {
    subscription?: string | { id: string } | null;
    parent?: { subscription_details?: { subscription?: string | { id: string } | null } | null } | null;
  };
  const legacy = record.subscription;
  if (typeof legacy === "string") return legacy;
  if (legacy && typeof legacy === "object" && "id" in legacy) return legacy.id;
  const nested = record.parent?.subscription_details?.subscription;
  if (typeof nested === "string") return nested;
  if (nested && typeof nested === "object" && "id" in nested) return nested.id;
  return null;
}

export async function createCheckout(input: {
  origin: string;
  email: string;
  name: string;
  subscription: Subscription;
  stripeCustomerId: string | null;
  mode: "subscription" | "setup";
}) {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not connected." as const };
  let customerId = input.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: input.email,
      name: input.name,
      metadata: { userId: input.subscription.userId },
    });
    customerId = customer.id;
  }
  if (input.mode === "setup") {
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      client_reference_id: input.subscription.id,
      success_url: `${input.origin}/portal/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${input.origin}/portal/billing?checkout=cancel`,
      metadata: { subscriptionId: input.subscription.id, userId: input.subscription.userId, purpose: "setup" },
    });
    return { url: session.url, customerId };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: input.subscription.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: input.subscription.monthlyAmountCents,
          recurring: { interval: "month" },
          product_data: {
            name: `Hosting: ${input.subscription.siteName}`,
            description: input.subscription.hostingLabel,
          },
        },
      },
    ],
    subscription_data: {
      metadata: { subscriptionId: input.subscription.id, userId: input.subscription.userId },
    },
    success_url: `${input.origin}/portal/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/portal/billing?checkout=cancel`,
    metadata: { subscriptionId: input.subscription.id, userId: input.subscription.userId, purpose: "subscription" },
  });
  return { url: session.url, customerId };
}

export async function pullStripeSubscription(sub: Subscription, fallbackName: string) {
  const stripe = getStripe();
  if (!stripe || !sub.stripeSubscriptionId) return null;
  const remote = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId, {
    expand: ["default_payment_method"],
  });
  const pm = cardFromPaymentMethod(
    typeof remote.default_payment_method === "object" ? remote.default_payment_method : null,
    fallbackName,
  );
  const invoices = await stripe.invoices.list({ subscription: sub.stripeSubscriptionId, limit: 24 });
  const periodEnd = remote.items.data[0]?.current_period_end;
  return {
    status: mapStatus(remote.status, Boolean(pm || sub.paymentMethod)),
    nextBillAt: periodEnd ? new Date(periodEnd * 1000).toISOString() : sub.nextBillAt,
    paymentMethod: pm,
    cancelAtPeriodEnd: remote.cancel_at_period_end,
    invoices: invoices.data.map((invoice) => ({
      stripeInvoiceId: invoice.id,
      amountCents: invoice.amount_paid || invoice.amount_due || sub.monthlyAmountCents,
      status: (invoice.status === "paid" ? "paid" : invoice.status === "open" ? "open" : invoice.status === "void" ? "void" : "failed") as
        | "paid"
        | "open"
        | "void"
        | "failed",
      periodStart: new Date((invoice.period_start || invoice.created) * 1000).toISOString(),
      periodEnd: new Date((invoice.period_end || invoice.created) * 1000).toISOString(),
      description: invoice.description || `Hosting for ${sub.siteName}`,
    })),
  };
}

export function applyStripePull(
  store: StoreData,
  sub: Subscription,
  pull: NonNullable<Awaited<ReturnType<typeof pullStripeSubscription>>>,
) {
  sub.status = pull.status;
  sub.nextBillAt = pull.nextBillAt;
  if (pull.paymentMethod) {
    sub.paymentMethod = pull.paymentMethod;
    sub.stripePaymentMethodId = pull.paymentMethod.providerId;
  }
  sub.cancelAtPeriodEnd = pull.cancelAtPeriodEnd;
  sub.autopay = pull.status === "active" || pull.status === "past_due";
  if (pull.status === "active" && !sub.startedAt) sub.startedAt = new Date().toISOString();
  if (pull.status === "canceled") {
    sub.canceledAt = sub.canceledAt || new Date().toISOString();
    sub.autopay = false;
  }
  sub.lastSyncedAt = new Date().toISOString();
  sub.updatedAt = sub.lastSyncedAt;
  for (const invoice of pull.invoices) {
    addInvoice(store, sub, invoice);
  }
}

export async function syncCheckoutSession(store: StoreData, sessionId: string, userId: string) {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not connected." };
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const sub = store.subscriptions.find((item) => item.userId === userId);
  if (!sub) return { error: "No hosting account." };
  const metaUser = session.metadata?.userId;
  const ref = session.client_reference_id;
  if (metaUser !== userId && ref !== sub.id) return { error: "That checkout does not belong to this account." };
  const user = store.users.find((item) => item.id === userId);
  if (session.customer && typeof session.customer === "string" && user) {
    user.stripeCustomerId = session.customer;
  }
  if (session.mode === "setup" && session.setup_intent) {
    const intentId = typeof session.setup_intent === "string" ? session.setup_intent : session.setup_intent.id;
    const intent = await stripe.setupIntents.retrieve(intentId);
    const pmId = typeof intent.payment_method === "string" ? intent.payment_method : intent.payment_method?.id;
    if (pmId && sub.stripeSubscriptionId) {
      await stripe.subscriptions.update(sub.stripeSubscriptionId, { default_payment_method: pmId });
      const pm = await stripe.paymentMethods.retrieve(pmId);
      const card = cardFromPaymentMethod(pm, user?.name || "");
      if (card) {
        sub.paymentMethod = card;
        sub.stripePaymentMethodId = pmId;
      }
    }
    sub.updatedAt = new Date().toISOString();
    return { ok: true as const };
  }
  const stripeSubId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (stripeSubId) sub.stripeSubscriptionId = stripeSubId;
  const pull = await pullStripeSubscription(sub, user?.name || "");
  if (pull) applyStripePull(store, sub, pull);
  logEvent(store, `${sub.siteName} connected a card through Stripe.`, `/admin/clients/${sub.userId}`);
  return { ok: true as const };
}

export async function updateStripeAmount(sub: Subscription, amountCents: number) {
  const stripe = getStripe();
  if (!stripe || !sub.stripeSubscriptionId) return;
  const remote = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
  const item = remote.items.data[0];
  if (!item) return;
  const product = typeof item.price.product === "string" ? item.price.product : item.price.product.id;
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: amountCents,
    recurring: { interval: "month" },
    product,
  });
  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    items: [{ id: item.id, price: price.id }],
    proration_behavior: "none",
  });
}

export async function setStripeCancel(sub: Subscription, atPeriodEnd: boolean, immediate: boolean) {
  const stripe = getStripe();
  if (!stripe || !sub.stripeSubscriptionId) return;
  if (immediate) {
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    return;
  }
  await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: atPeriodEnd });
}

export async function setStripePause(sub: Subscription, paused: boolean) {
  const stripe = getStripe();
  if (!stripe || !sub.stripeSubscriptionId) return;
  if (paused) {
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      pause_collection: { behavior: "void" },
    });
    return;
  }
  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    pause_collection: "",
  });
}

export async function stripeAccount() {
  const stripe = getStripe();
  if (!stripe) return { connected: false as const };
  try {
    const balance = await stripe.balance.retrieve();
    return { connected: true as const, livemode: balance.livemode };
  } catch {
    return { connected: false as const, error: "Stripe rejected the secret key." };
  }
}

export function verifyStripeEvent(raw: string, signature: string | null) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret || !signature) return { error: "Webhook is not configured." as const };
  try {
    const event = stripe.webhooks.constructEvent(raw, signature, secret);
    return { event };
  } catch {
    return { error: "Invalid webhook signature." as const };
  }
}

export function applyStripeEvent(store: StoreData, event: Stripe.Event) {
  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const stripeSubId = subscriptionIdFromInvoice(invoice);
    const sub = store.subscriptions.find((item) => item.stripeSubscriptionId === stripeSubId);
    if (!sub) return;
    addInvoice(store, sub, {
      stripeInvoiceId: invoice.id,
      amountCents: invoice.amount_paid || invoice.amount_due || sub.monthlyAmountCents,
      status: event.type === "invoice.paid" ? "paid" : "failed",
      periodStart: new Date((invoice.period_start || invoice.created) * 1000).toISOString(),
      periodEnd: new Date((invoice.period_end || invoice.created) * 1000).toISOString(),
      description: `Hosting for ${sub.siteName}`,
    });
    if (event.type === "invoice.payment_failed") {
      sub.status = "past_due";
      sub.updatedAt = new Date().toISOString();
      logEvent(store, `A hosting charge failed for ${sub.siteName}.`, `/admin/clients/${sub.userId}`);
    } else if (sub.status === "past_due" || sub.status === "awaiting_payment") {
      sub.status = "active";
      sub.updatedAt = new Date().toISOString();
    }
    return;
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const remote = event.data.object as Stripe.Subscription;
    const sub =
      store.subscriptions.find((item) => item.stripeSubscriptionId === remote.id) ||
      store.subscriptions.find((item) => item.id === remote.metadata?.subscriptionId);
    if (!sub) return;
    sub.stripeSubscriptionId = remote.id;
    const hasCard = Boolean(sub.paymentMethod);
    sub.status = event.type === "customer.subscription.deleted" ? "canceled" : mapStatus(remote.status, hasCard);
    sub.cancelAtPeriodEnd = remote.cancel_at_period_end;
    const periodEnd = remote.items.data[0]?.current_period_end;
    if (periodEnd) sub.nextBillAt = new Date(periodEnd * 1000).toISOString();
    if (sub.status === "canceled") {
      sub.canceledAt = sub.canceledAt || new Date().toISOString();
      sub.autopay = false;
    }
    sub.updatedAt = new Date().toISOString();
  }
}
