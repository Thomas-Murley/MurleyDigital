import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { StatusPill } from "@/components/status-pill";
import { runBillingNow } from "@/lib/actions";
import { monthlyRecurringCents } from "@/lib/billing";
import { money, shortDate } from "@/lib/format";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Desk" };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const store = getStore();
  const active = store.subscriptions.filter((sub) => sub.status === "active").length;
  const waiting = store.subscriptions.filter((sub) => sub.status === "awaiting_payment").length;
  const pendingInvites = store.invites.filter(
    (invite) => !invite.acceptedAt && !invite.revokedAt && new Date(invite.expiresAt).getTime() > Date.now(),
  ).length;
  const unread = store.messages.filter((message) => !message.readAt).length;
  return (
    <div className="stack">
      <header className="shell-top">
        <div>
          <p className="kicker">Desk</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Hosting, in one place.</h1>
        </div>
        <form action={runBillingNow}>
          <button className="btn" type="submit">
            Run billing now
          </button>
        </form>
      </header>
      <Notice code={notice} />
      <div className="stats">
        <div className="stat">
          <strong>{money(monthlyRecurringCents(store))}</strong>
          <span>Monthly recurring, active and past due</span>
        </div>
        <div className="stat">
          <strong>{active}</strong>
          <span>Active clients</span>
        </div>
        <div className="stat">
          <strong>{waiting}</strong>
          <span>Waiting on a card</span>
        </div>
        <div className="stat">
          <strong>{pendingInvites}</strong>
          <span>Open invites · {unread} unread</span>
        </div>
      </div>
      <section className="split">
        <article className="panel">
          <div className="section-head">
            <h2>Recent clients</h2>
            <a className="text-link" href="/admin/clients">
              All clients
            </a>
          </div>
          {store.subscriptions.length === 0 ? (
            <div className="empty">
              <p>No clients yet. Create an invite when a site is ready to host. You choose the monthly amount. They get a private link.</p>
              <a className="btn btn-solid" href="/admin/invites">
                Create an invite
              </a>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {store.subscriptions.slice(0, 6).map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <a href={`/admin/clients/${sub.userId}`}>{sub.siteName}</a>
                        <div className="fine">{sub.hostingLabel}</div>
                      </td>
                      <td>{money(sub.monthlyAmountCents)}</td>
                      <td>
                        <StatusPill status={sub.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
        <article className="panel">
          <h2>Activity</h2>
          {store.events.length === 0 ? (
            <p className="muted">Nothing yet.</p>
          ) : (
            <ul className="event-list">
              {store.events.slice(0, 8).map((event) => (
                <li key={event.id}>
                  <span>{event.href ? <a href={event.href}>{event.message}</a> : event.message}</span>
                  <time dateTime={event.at}>{shortDate(event.at)}</time>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
