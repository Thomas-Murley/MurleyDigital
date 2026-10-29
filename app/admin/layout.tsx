import { logout } from "@/lib/actions";
import { SideNav } from "@/components/side-nav";
import { Wordmark } from "@/components/wordmark";
import { billingMode } from "@/lib/mode";
import { requireAdmin } from "@/lib/guards";
import { getStore } from "@/lib/store";
import { syncBilling } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  await syncBilling();
  const store = getStore();
  const unread = store.messages.filter((message) => !message.readAt).length;
  const awaiting = store.subscriptions.filter((sub) => sub.status === "awaiting_payment").length;
  const fresh = getStore().users.find((user) => user.id === admin.id);
  return (
    <div className="shell">
      <aside className="side">
        <Wordmark inverse href="/admin" />
        <SideNav
          items={[
            { href: "/admin", label: "Overview" },
            { href: "/admin/invites", label: "Invites" },
            { href: "/admin/clients", label: "Clients", badge: awaiting || undefined },
            { href: "/admin/messages", label: "Messages", badge: unread || undefined },
            { href: "/admin/settings", label: "Settings" },
          ]}
        />
        <div className="side-foot">
          <p className="fine" style={{ color: "rgba(244,239,230,0.7)", margin: 0 }}>
            {fresh?.email}
            <br />
            {billingMode() === "stripe" ? "Stripe connected" : "Demo billing"}
          </p>
          <a href="/">View the site</a>
          <form action={logout}>
            <button className="btn btn-small" type="submit">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="shell-main">
        {fresh?.mustChangePassword ? (
          <p className="banner banner-bad" style={{ marginBottom: "1rem" }}>
            This admin password was generated for first run. Change it in Settings before you send the site to anyone.
          </p>
        ) : null}
        {billingMode() === "demo" ? (
          <p className="banner" style={{ marginBottom: "1rem" }}>
            Card billing is in demonstration mode. Clients can rehearse with a test card, but banks are not charged. Add Stripe keys before you send a live invite.
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
