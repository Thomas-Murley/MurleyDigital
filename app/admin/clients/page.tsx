import type { Metadata } from "next";
import { StatusPill } from "@/components/status-pill";
import { money, shortDate } from "@/lib/format";
import { getStore } from "@/lib/store";
import type { SubscriptionStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Clients" };

const filters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "awaiting_payment", label: "Needs a card" },
  { id: "active", label: "Active" },
  { id: "past_due", label: "Past due" },
  { id: "paused", label: "Paused" },
  { id: "canceled", label: "Canceled" },
];

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const store = getStore();
  const current = filters.some((item) => item.id === status) ? status! : "all";
  const rows = store.subscriptions.filter((sub) => (current === "all" ? true : sub.status === (current as SubscriptionStatus)));
  return (
    <div className="stack">
      <header className="shell-top">
        <div>
          <p className="kicker">Clients</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Hosting accounts</h1>
        </div>
        <a className="btn btn-solid" href="/admin/invites">
          New invite
        </a>
      </header>
      <div className="filters">
        {filters.map((item) => (
          <a key={item.id} href={item.id === "all" ? "/admin/clients" : `/admin/clients?status=${item.id}`} aria-current={current === item.id ? "true" : undefined}>
            {item.label}
          </a>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="empty">No clients in this view.</p>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Client</th>
                <th>Site</th>
                <th>Monthly</th>
                <th>Next charge</th>
                <th>Card</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sub) => {
                const user = store.users.find((item) => item.id === sub.userId);
                return (
                  <tr key={sub.id}>
                    <td>
                      <a href={`/admin/clients/${sub.userId}`}>{user?.name || "Client"}</a>
                      <div className="fine">{user?.email}</div>
                    </td>
                    <td>
                      {sub.siteName}
                      <div className="fine">{sub.hostingLabel}</div>
                    </td>
                    <td>{money(sub.monthlyAmountCents)}</td>
                    <td>{sub.nextBillAt ? shortDate(sub.nextBillAt) : "Not set"}</td>
                    <td>{sub.paymentMethod ? `•••• ${sub.paymentMethod.last4}` : "None"}</td>
                    <td>
                      <StatusPill status={sub.status} />
                      {sub.cancelAtPeriodEnd ? <div className="fine">Cancels at period end</div> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
