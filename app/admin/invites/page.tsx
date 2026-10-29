import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { InviteForm } from "@/components/invite-form";
import { Notice } from "@/components/notice";
import { StatusPill } from "@/components/status-pill";
import { revokeInvite } from "@/lib/actions";
import { inviteState, longDate, money } from "@/lib/format";
import { requestOrigin } from "@/lib/guards";
import { getProfile, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Invites" };

export default async function InvitesPage({ searchParams }: { searchParams: Promise<{ notice?: string; created?: string }> }) {
  const { notice, created } = await searchParams;
  const store = getStore();
  const origin = await requestOrigin();
  const profile = getProfile();
  const highlight = store.invites.find((invite) => invite.id === created);
  return (
    <div className="stack">
      <header>
        <p className="kicker">Invites</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Send a private link.</h1>
        <p className="lede">There is no public sign-up. You set the monthly hosting amount. The client only sets a password and a card.</p>
      </header>
      <Notice code={notice} />
      {highlight && inviteState(highlight) === "pending" ? (
        <InviteDraft invite={highlight} origin={origin} studio={profile.name} />
      ) : null}
      <InviteForm />
      <section>
        <h2>All invites</h2>
        {store.invites.length === 0 ? (
          <p className="empty">No invites yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Site</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {store.invites.map((invite) => {
                  const state = inviteState(invite);
                  const url = `${origin}/invite/${invite.token}`;
                  return (
                    <tr key={invite.id}>
                      <td>
                        {invite.name}
                        <div className="fine">{invite.email}</div>
                      </td>
                      <td>
                        {invite.siteName}
                        <div className="fine">Expires {longDate(invite.expiresAt)}</div>
                      </td>
                      <td>{money(invite.monthlyAmountCents)}</td>
                      <td>
                        <StatusPill status={state} />
                      </td>
                      <td>
                        {state === "pending" ? (
                          <div className="row-actions">
                            <CopyButton value={url} label="Copy link" />
                            <form action={revokeInvite}>
                              <input type="hidden" name="id" value={invite.id} />
                              <button className="btn btn-small" type="submit">
                                Revoke
                              </button>
                            </form>
                          </div>
                        ) : state === "accepted" && invite.acceptedUserId ? (
                          <a href={`/admin/clients/${invite.acceptedUserId}`}>Open client</a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InviteDraft({
  invite,
  origin,
  studio,
}: {
  invite: { token: string; name: string; email: string; siteName: string; monthlyAmountCents: number; expiresAt: string };
  origin: string;
  studio: string;
}) {
  const url = `${origin}/invite/${invite.token}`;
  const draft = `Hello ${invite.name},

Your hosting account for ${invite.siteName} is ready. Open this private link to set a password and add a payment method for ${money(invite.monthlyAmountCents)} per month:

${url}

The link expires on ${longDate(invite.expiresAt)} and only works for ${invite.email}.

${studio}`;
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Link ready</h2>
        <div className="row-actions">
          <CopyButton value={url} label="Copy link" />
          <CopyButton value={draft} label="Copy email" />
        </div>
      </div>
      <p className="fine">Copy this once and send it yourself. The app does not send email.</p>
      <pre className="email-draft">{draft}</pre>
    </section>
  );
}
