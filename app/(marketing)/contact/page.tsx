import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getProfile } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a website project with Murley Digital.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  const profile = getProfile();
  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">Contact</p>
        <h1>Tell us about the site.</h1>
        <p className="lede">What it needs to do is more useful than a long brief. We reply within two business days.</p>
      </header>
      <div className="split">
        <div className="stack">
          {sent ? (
            <p className="banner banner-ok" role="status">
              Received. We will write back at the email you gave us.
            </p>
          ) : (
            <ContactForm />
          )}
        </div>
        <aside className="stack">
          <article className="panel">
            <p className="kicker">Email</p>
            <p>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            {profile.phone ? <p>{profile.phone}</p> : null}
            <p className="fine">{profile.location}</p>
          </article>
          <article className="panel">
            <p className="kicker">Useful to include</p>
            <ul className="plain-list">
              <li>The job the site has to do</li>
              <li>A rough budget, even if it is a range</li>
              <li>When you would like to launch</li>
              <li>A link to what you have today, if there is one</li>
            </ul>
          </article>
          <article className="panel">
            <p className="kicker">Already a client?</p>
            <p>Hosting accounts are not created here. Use the login if we sent you a link.</p>
            <a className="btn" href="/login">
              Client login
            </a>
          </article>
        </aside>
      </div>
    </div>
  );
}
