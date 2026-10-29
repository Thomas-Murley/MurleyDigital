import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { PasswordForm } from "@/components/password-form";
import { requireCustomer } from "@/lib/guards";
import { getProfile } from "@/lib/store";
import { longDate } from "@/lib/format";
import { findUser, getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const session = await requireCustomer();
  const user = findUser(getStore(), session.id);
  const profile = getProfile();
  if (!user) return null;
  return (
    <div className="stack" style={{ maxWidth: 680 }}>
      <header>
        <p className="kicker">Account</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>{user.name}</h1>
      </header>
      <Notice code={notice} />
      <section className="panel">
        <p>
          <strong>Email.</strong> {user.email}
        </p>
        {user.company ? (
          <p>
            <strong>Company.</strong> {user.company}
          </p>
        ) : null}
        <p className="fine">Opened {longDate(user.createdAt)}. To change the name or email on the account, write to {profile.email}.</p>
      </section>
      <section className="panel">
        <h2>Password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
