import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { longDate, money } from "@/lib/format";
import { requireCustomer } from "@/lib/guards";
import { getProfile, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Invoice" };

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireCustomer();
  const store = getStore();
  const invoice = store.invoices.find((item) => item.id === id && item.userId === user.id);
  if (!invoice) notFound();
  const profile = getProfile();
  const sub = store.subscriptions.find((item) => item.id === invoice.subscriptionId);
  return (
    <article className="sheet">
      <div className="sheet-top">
        <div>
          <p className="kicker">{profile.name}</p>
          <h1 style={{ fontSize: "2.4rem" }}>{invoice.number}</h1>
          <p className="fine">{profile.email}</p>
        </div>
        {invoice.status === "paid" ? <div className="stamp">Paid</div> : <StatusPill status={invoice.status} />}
      </div>
      <div className="split" style={{ marginTop: "1.4rem" }}>
        <p>
          <strong>Billed to</strong>
          <br />
          {user.name}
          <br />
          {user.email}
        </p>
        <p>
          <strong>Date</strong>
          <br />
          {longDate(invoice.createdAt)}
          <br />
          {invoice.paidAt ? `Paid ${longDate(invoice.paidAt)}` : "Not paid"}
        </p>
      </div>
      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table className="data">
          <thead>
            <tr>
              <th>Description</th>
              <th>Period</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {invoice.description}
                {sub ? (
                  <>
                    <br />
                    <span className="fine">{sub.hostingLabel}</span>
                  </>
                ) : null}
              </td>
              <td>
                {longDate(invoice.periodStart)} to {longDate(invoice.periodEnd)}
              </td>
              <td>{money(invoice.amountCents)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="due" style={{ fontSize: "2.4rem", marginTop: "1rem" }}>
        {money(invoice.amountCents)}
      </p>
      <p className="fine">
        {invoice.last4 ? `Card ending ${invoice.last4}. ` : ""}
        Hosting invoices are in US dollars. Questions: {profile.email}.
      </p>
      <p className="no-print">
        <a className="btn" href="/portal">
          Back to overview
        </a>
      </p>
    </article>
  );
}
