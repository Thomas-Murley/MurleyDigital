import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { money, longDate, inviteState } from "@/lib/format";
import { getProfile, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Accept invite" };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const profile = getProfile();
  const invite = getStore().invites.find((item) => item.token === token);
  if (!invite) {
    return (
      <section className="auth-card">
        <h1>This link is not valid.</h1>
        <p>Ask {profile.name} for a new invite. Links are single use and they expire.</p>
        <a className="btn" href="/contact">
          Contact
        </a>
      </section>
    );
  }
  const state = inviteState(invite);
  if (state !== "pending") {
    const copy =
      state === "accepted"
        ? "This invite has already been used. Sign in with the password you chose."
        : state === "expired"
          ? "This invite has expired. Ask the studio for a new link."
          : "This invite was revoked. Ask the studio for a new link.";
    return (
      <section className="auth-card">
        <h1>Invite closed.</h1>
        <p>{copy}</p>
        <div className="cluster">
          <a className="btn btn-solid" href="/login">
            Sign in
          </a>
          <a className="btn" href={`mailto:${profile.email}`}>
            Email the studio
          </a>
        </div>
      </section>
    );
  }
  return (
    <div className="auth-grid">
      <section className="auth-panel">
        <div>
          <p className="kicker">Private invite</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}>{invite.siteName}</h1>
          <p>{invite.hostingLabel}</p>
          <p className="due">
            {money(invite.monthlyAmountCents)}
            <span style={{ color: "rgba(244,239,230,0.7)" }}>/month</span>
          </p>
        </div>
        <div className="fine">
          <p>This rate was set by {profile.name}. It is not something you choose on this page.</p>
          <p>For {invite.email}. Link expires {longDate(invite.expiresAt)}.</p>
          {invite.clientNote ? <p>{invite.clientNote}</p> : null}
        </div>
      </section>
      <section className="auth-card">
        <h2>Create your login</h2>
        <p className="muted">Hello {invite.name}. Choose a password, then you will add a payment method for this monthly amount.</p>
        <SignupForm token={token} />
      </section>
    </div>
  );
}
