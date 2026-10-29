import type { Metadata } from "next";
import { ResetForm } from "@/components/reset-form";
import { tokensMatch } from "@/lib/passwords";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const user = getStore().users.find(
    (item) =>
      item.resetTokenHash &&
      item.resetExpiresAt &&
      new Date(item.resetExpiresAt).getTime() > Date.now() &&
      tokensMatch(token, item.resetTokenHash),
  );
  if (!user) {
    return (
      <section className="auth-card">
        <h1>This reset link is not valid.</h1>
        <p>It may have expired. Ask the studio for a new one. Links last 48 hours.</p>
        <a className="btn" href="/login">
          Back to login
        </a>
      </section>
    );
  }
  return (
    <section className="auth-card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <p className="kicker">Password reset</p>
      <h1>Choose a new password.</h1>
      <p className="muted">For {user.email}.</p>
      <ResetForm token={token} />
    </section>
  );
}
