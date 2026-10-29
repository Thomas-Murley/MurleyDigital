import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { readSession } from "@/lib/session";
import { safeNext } from "@/lib/text";

export const metadata: Metadata = { title: "Client login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await readSession();
  if (user) redirect(user.role === "admin" ? "/admin" : "/portal");
  const devHint = process.env.NODE_ENV !== "production";
  return (
    <div className="auth-grid">
      <section className="auth-panel">
        <div>
          <p className="kicker">Client portal</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)" }}>Sign in to hosting.</h1>
        </div>
        <p className="fine">
          Accounts are opened by invitation. If you are starting a project, use the contact form instead of creating an account here.
        </p>
      </section>
      <section className="auth-card">
        <h2>Login</h2>
        <LoginForm next={safeNext(next, "customer") || safeNext(next, "admin") || undefined} />
        {devHint ? (
          <p className="fine" style={{ marginTop: "1rem" }}>
            First-run admin password is written to data/generated-admin-password.txt when ADMIN_PASSWORD is not set.
          </p>
        ) : null}
        <p className="fine">
          <a href="/contact">Contact us</a> · <a href="/billing-terms">Billing terms</a>
        </p>
      </section>
    </div>
  );
}
