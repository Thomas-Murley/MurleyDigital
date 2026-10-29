import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { PasswordForm } from "@/components/password-form";
import { updateAdminEmail, updateProfile } from "@/lib/actions";
import { billingMode } from "@/lib/mode";
import { requireAdmin } from "@/lib/guards";
import { stripeAccount } from "@/lib/stripe-billing";
import { findUser, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const admin = await requireAdmin();
  const settings = getStore().settings;
  const user = findUser(getStore(), admin.id);
  const stripe = await stripeAccount();
  const mode = billingMode();
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <header>
        <p className="kicker">Settings</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Studio and access</h1>
      </header>
      <Notice code={notice} />
      <section className="panel stack">
        <h2>Payments</h2>
        {mode === "stripe" && stripe.connected ? (
          <p className="banner banner-ok">Stripe is connected{stripe.livemode ? " in live mode." : " in test mode. Use test cards until you switch to live keys."}</p>
        ) : (
          <p className="banner">
            {"error" in stripe && stripe.error ? stripe.error : "Stripe is not connected."} Demonstration billing is active. Real cards are rejected on purpose.
          </p>
        )}
        <ol className="plain-list">
          <li>Create a Stripe account and copy the secret key.</li>
          <li>Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in the server environment.</li>
          <li>Point a webhook at /api/stripe/webhook for checkout, invoice, and subscription events.</li>
          <li>Restart the server. New invites will then bill through Stripe.</li>
          <li>Optional: call POST /api/cron/billing daily with Authorization: Bearer CRON_SECRET.</li>
        </ol>
        <p className="fine">
          Have a lawyer review the Terms, Privacy, and Billing pages before you rely on them. Portfolio samples and package prices live in lib/content.ts.
        </p>
      </section>
      <form className="form panel" action={updateProfile}>
        <h2>Public details</h2>
        <label className="field">
          <span>Studio name</span>
          <input name="studioName" defaultValue={settings.studioName} required />
        </label>
        <label className="field">
          <span>Legal name</span>
          <input name="legalName" defaultValue={settings.legalName} required />
        </label>
        <label className="field">
          <span>Public email</span>
          <input name="supportEmail" type="email" defaultValue={settings.supportEmail} required />
        </label>
        <div className="split">
          <label className="field">
            <span>Phone</span>
            <input name="phone" defaultValue={settings.phone} />
          </label>
          <label className="field">
            <span>Location line</span>
            <input name="location" defaultValue={settings.location} />
          </label>
        </div>
        <label className="field">
          <span>Tagline</span>
          <input name="tagline" defaultValue={settings.tagline} />
        </label>
        <button className="btn btn-solid" type="submit">
          Save public details
        </button>
      </form>
      <form className="form panel" action={updateAdminEmail}>
        <h2>Login email</h2>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" defaultValue={user?.email || ""} required />
        </label>
        <label className="field">
          <span>Current password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="btn" type="submit">
          Update login email
        </button>
      </form>
      <section className="panel">
        <h2>Password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
