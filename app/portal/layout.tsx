import { logout } from "@/lib/actions";
import { SideNav } from "@/components/side-nav";
import { Wordmark } from "@/components/wordmark";
import { requireCustomer } from "@/lib/guards";
import { syncBilling } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCustomer();
  await syncBilling();
  return (
    <div className="shell">
      <aside className="side">
        <Wordmark inverse href="/portal" />
        <SideNav
          items={[
            { href: "/portal", label: "Overview" },
            { href: "/portal/billing", label: "Billing" },
            { href: "/portal/account", label: "Account" },
          ]}
        />
        <div className="side-foot">
          <p className="fine" style={{ color: "rgba(244,239,230,0.7)", margin: 0 }}>
            {user.name}
            <br />
            {user.email}
          </p>
          <a href="/">Back to the site</a>
          <form action={logout}>
            <button className="btn btn-small" type="submit">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="shell-main">{children}</div>
    </div>
  );
}
