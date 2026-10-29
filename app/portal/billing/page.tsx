import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { PaymentForm } from "@/components/payment-form";
import { startStripeCheckout } from "@/lib/actions";
import { subscriptionFor } from "@/lib/billing";
import { billingMode } from "@/lib/mode";
import { brandLabel, longDate, money } from "@/lib/format";
import { requireCustomer } from "@/lib/guards";
import { completeCheckout } from "@/lib/sync";
import { findUser, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; notice?: string; checkout?: string; session_id?: string }>;
}) {
  const query = await searchParams;
  const user = await requireCustomer();
  let checkoutNote = "";
  if (query.session_id && query.checkout === "success") {
    const result = await completeCheckout(user.id, query.session_id);
    if (result && "error" in result && result.error) checkoutNote = result.error;
  }
  const sub = subscriptionFor(getStore(), user.id);
  const full = findUser(getStore(), user.id);
  if (!sub || !full) {
    return <p className="empty">No hosting account is attached to this login.</p>;
  }
  const live = billingMode() === "stripe" && sub.processor === "stripe";
  return (
    <div className="stack">
      <header>
        <p className="kicker">Billing</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Monthly payment</h1>
      </header>
      <Notice code={query.notice} />
      {query.welcome ? (
        <p className="banner banner-ok" role="status">
          Account ready for {sub.siteName}. Add a payment method for {money(sub.monthlyAmountCents)} a month. That amount was set by the studio.
        </p>
      ) : null}
      {query.checkout === "cancel" ? <p className="banner">Card setup was canceled. Nothing was charged.</p> : null}
      {checkoutNote ? <p className="form-error">{checkoutNote}</p> : null}
      <div className="pay-layout">
        <section className="panel">
          <p className="kicker">{sub.hostingLabel}</p>
          <h2>{sub.siteName}</h2>
          <p className="due">
            {money(sub.monthlyAmountCents)}
            <span>/month</span>
          </p>
          <p className="fine">
            {sub.nextBillAt ? `Next charge ${longDate(sub.nextBillAt)}.` : "The first period is charged when a card is added."}{" "}
            {sub.paymentMethod
              ? `Current card: ${brandLabel(sub.paymentMethod.brand)} ending ${sub.paymentMethod.last4}.`
              : "No card on file yet."}
          </p>
          <p className="fine">You cannot change this amount here. If it looks wrong, contact the studio before you add a card.</p>
        </section>
        <section className="panel">
          {sub.status === "canceled" ? (
            <p>This subscription has ended. Contact the studio if the site should come back online.</p>
          ) : live ? (
            <form action={startStripeCheckout} className="stack">
              <p>
                {sub.paymentMethod
                  ? "Replace the card on Stripe. Replacing it does not charge an extra month."
                  : "You will leave this page for a secure Stripe checkout, then come back. Stripe stores the card. We store the brand, last four, and expiry."}
              </p>
              <button className="btn btn-solid" type="submit">
                {sub.paymentMethod ? "Update card on Stripe" : "Set up monthly payment"}
              </button>
            </form>
          ) : (
            <>
              <div className="banner" style={{ marginBottom: "0.9rem" }}>
                Card billing is not connected to a payment network. Do not enter a real card. This rehearsal saves brand, last four, and expiry only.
              </div>
              <PaymentForm
                amountCents={sub.monthlyAmountCents}
                siteName={sub.siteName}
                defaultName={full.name}
                replacing={Boolean(sub.paymentMethod)}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
