import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { Notice } from "@/components/notice";
import { StatusPill } from "@/components/status-pill";
import {
  cancelSubscriptionNow,
  createResetLink,
  keepSubscription,
  pauseSubscription,
  updateClientDetails,
  updateMonthlyAmount,
} from "@/lib/actions";
import { longDate, money, shortDate } from "@/lib/format";
import { requestOrigin } from "@/lib/guards";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; token?: string }>;
}) {
  const { id } = await params;
  const { notice, token } = await searchParams;
  const store = getStore();
  const user = store.users.find((item) => item.id === id && item.role === "customer");
  const sub = store.subscriptions.find((item) => item.userId === id);
  if (!user || !sub) notFound();
  const invoices = store.invoices.filter((invoice) => invoice.userId === id);
  const origin = await requestOrigin();
  const dollars = (sub.monthlyAmountCents / 100).toFixed(2);
  return (
    <div className="stack">
      <header className="shell-top">
        <div>
          <p className="kicker">
            <a href="/admin/clients">Clients</a>
          </p>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>{user.name}</h1>
          <p className="muted">
            {user.email}
            {user.company ? ` · ${user.company}` : ""}
          </p>
        </div>
        <StatusPill status={sub.status} />
      </header>
      <Notice code={notice} />
      {sub.cancelRequestedAt && sub.status !== "canceled" ? (
        <div className="banner">
          Cancellation requested {longDate(sub.cancelRequestedAt)}. The site stays up through the paid period unless you end it now.
        </div>
      ) : null}
      {notice === "reset-ready" && token ? (
        <section className="panel">
          <div className="section-head">
            <h2>Password reset link</h2>
            <CopyButton value={`${origin}/reset/${token}`} label="Copy reset link" />
          </div>
          <pre className="email-draft">{`${origin}/reset/${token}`}</pre>
          <p className="fine">Send this to {user.email}. It expires in 48 hours and replaces any older reset link.</p>
        </section>
      ) : null}
      <div className="stats">
        <div className="stat">
          <strong>{money(sub.monthlyAmountCents)}</strong>
          <span>Current monthly rate</span>
        </div>
        <div className="stat">
          <strong>{sub.nextBillAt ? shortDate(sub.nextBillAt) : "None"}</strong>
          <span>Next charge</span>
        </div>
        <div className="stat">
          <strong>{sub.paymentMethod ? `•••• ${sub.paymentMethod.last4}` : "None"}</strong>
          <span>{sub.paymentMethod ? `${sub.paymentMethod.brand} · exp ${sub.paymentMethod.expMonth}/${sub.paymentMethod.expYear}` : "No card"}</span>
        </div>
        <div className="stat">
          <strong>{sub.processor === "stripe" ? "Stripe" : "Demo"}</strong>
          <span>Processor for this account</span>
        </div>
      </div>
      <section className="split">
        <form className="form panel" action={updateMonthlyAmount}>
          <h2>Monthly amount</h2>
          <p className="fine">Applies on the next charge. Tell the client at least 14 days before that date. They cannot edit this number.</p>
          <input type="hidden" name="userId" value={user.id} />
          <label className="field">
            <span>USD per month</span>
            <input name="amount" defaultValue={dollars} inputMode="decimal" required />
          </label>
          <button className="btn btn-solid" type="submit">
            Save rate
          </button>
        </form>
        <form className="form panel" action={updateClientDetails}>
          <h2>Site</h2>
          <input type="hidden" name="userId" value={user.id} />
          <label className="field">
            <span>Site name</span>
            <input name="siteName" defaultValue={sub.siteName} required />
          </label>
          <label className="field">
            <span>Plan name</span>
            <input name="hostingLabel" defaultValue={sub.hostingLabel} required />
          </label>
          <label className="field">
            <span>Internal note</span>
            <textarea name="adminNote" defaultValue={sub.adminNote} />
          </label>
          <button className="btn" type="submit">
            Save details
          </button>
        </form>
      </section>
      <section className="panel">
        <h2>Invoices</h2>
        {invoices.length === 0 ? (
          <p className="muted">No invoices yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.number}</td>
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
      <section className="panel row-actions">
        <form action={createResetLink}>
          <input type="hidden" name="userId" value={user.id} />
          <button className="btn" type="submit">
            Create password reset link
          </button>
        </form>
        {sub.status !== "canceled" ? (
          <form action={pauseSubscription}>
            <input type="hidden" name="userId" value={user.id} />
            <button className="btn" type="submit">
              {sub.status === "paused" ? "Resume hosting" : "Pause hosting"}
            </button>
          </form>
        ) : null}
        {sub.cancelAtPeriodEnd ? (
          <form action={keepSubscription}>
            <input type="hidden" name="userId" value={user.id} />
            <button className="btn" type="submit">
              Keep hosting
            </button>
          </form>
        ) : null}
      </section>
      {sub.status !== "canceled" ? (
        <section className="danger-zone">
          <h2>End hosting now</h2>
          <p className="muted">Stops future charges immediately. It does not refund a period that was already paid.</p>
          <form action={cancelSubscriptionNow}>
            <input type="hidden" name="userId" value={user.id} />
            <button className="btn" type="submit">
              Cancel now
            </button>
          </form>
        </section>
      ) : (
        <p className="fine">Canceled {sub.canceledAt ? longDate(sub.canceledAt) : ""}.</p>
      )}
    </div>
  );
}
