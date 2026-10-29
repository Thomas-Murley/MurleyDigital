import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { StatusPill } from "@/components/status-pill";
import { invoicesFor, subscriptionFor } from "@/lib/billing";
import { brandLabel, longDate, money, shortDate } from "@/lib/format";
import { requireCustomer } from "@/lib/guards";
import { getStore } from "@/lib/store";
import { requestCancellation } from "@/lib/actions";

export const metadata: Metadata = { title: "Your hosting" };

export default async function PortalHome({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const user = await requireCustomer();
  const store = getStore();
  const sub = subscriptionFor(store, user.id);
  const invoices = invoicesFor(store, user.id).slice(0, 8);
  if (!sub) {
    return (
      <section className="empty">
        <h1>No hosting account yet.</h1>
        <p>This login is not attached to a site. Contact the studio and we will connect it.</p>
      </section>
    );
  }
  return (
    <div className="stack">
      <header className="shell-top">
        <div>
          <p className="kicker">Hosting</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>{sub.siteName}</h1>
        </div>
        <StatusPill status={sub.status} />
      </header>
      <Notice code={notice} />
      {sub.status === "awaiting_payment" ? (
        <div className="banner">
          Add a payment method to start monthly hosting at {money(sub.monthlyAmountCents)}. The amount was set by the studio.
          <div style={{ marginTop: "0.7rem" }}>
            <a className="btn btn-solid" href="/portal/billing">
              Set up payment
            </a>
          </div>
        </div>
      ) : null}
      {sub.status === "past_due" ? (
        <div className="banner banner-bad">The last charge did not go through. Update the card to keep the site online.</div>
      ) : null}
      {sub.cancelAtPeriodEnd && sub.status !== "canceled" ? (
        <div className="banner">
          Cancellation is in motion. Service continues
          {sub.nextBillAt ? ` through ${longDate(sub.nextBillAt)}` : " through the period already paid"}. No further charge is scheduled after that.
        </div>
      ) : null}
      <div className="stats">
        <div className="stat">
          <strong>{money(sub.monthlyAmountCents)}</strong>
          <span>per month · {sub.hostingLabel}</span>
        </div>
        <div className="stat">
          <strong>{sub.nextBillAt ? shortDate(sub.nextBillAt) : "Not scheduled"}</strong>
          <span>{sub.autopay ? "Next automatic charge" : "Autopay is off"}</span>
        </div>
        <div className="stat">
          <strong>{sub.paymentMethod ? `•••• ${sub.paymentMethod.last4}` : "None"}</strong>
          <span>{sub.paymentMethod ? brandLabel(sub.paymentMethod.brand) : "No card on file"}</span>
        </div>
        <div className="stat">
          <strong>{sub.processor === "stripe" ? "Stripe" : "Studio ledger"}</strong>
          <span>How charges are recorded</span>
        </div>
      </div>
      <section className="panel">
        <div className="section-head">
          <h2>Invoices</h2>
          <a className="text-link" href="/portal/billing">
            Manage billing
          </a>
        </div>
        {invoices.length === 0 ? (
          <p className="muted">No invoices yet. The first one is created when a card is added.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <a href={`/portal/invoices/${invoice.id}`}>{invoice.number}</a>
                    </td>
                    <td>
                      {shortDate(invoice.periodStart)} to {shortDate(invoice.periodEnd)}
                    </td>
                    <td>{money(invoice.amountCents)}</td>
                    <td>
                      <StatusPill status={invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {sub.status === "active" || sub.status === "past_due" || sub.status === "paused" ? (
        <section className="danger-zone">
          <h2>Cancel hosting</h2>
          <p className="muted">
            Requesting cancellation stops the next charge. The site stays up through the time you have already paid. We do not refund a partial month.
          </p>
          {sub.cancelAtPeriodEnd ? (
            <p>A cancellation is already requested.</p>
          ) : (
            <form action={requestCancellation}>
              <button className="btn" type="submit">
                Request cancellation
              </button>
            </form>
          )}
        </section>
      ) : null}
    </div>
  );
}
