import type { Metadata } from "next";
import { getProfile } from "@/lib/store";

export const metadata: Metadata = {
  title: "Studio",
  description: "How Murley Digital works: a small studio for websites and the hosting that follows.",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const profile = getProfile();
  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">Studio</p>
        <h1>A small studio, on purpose.</h1>
        <p className="lede">
          {profile.name} takes a few builds at a time. You talk to the people doing the work. The site is designed for the business in front of us, then engineered so it can be hosted without drama.
        </p>
      </header>
      <div className="split">
        <section className="prose">
          <h2>How we are set up</h2>
          <p>
            Strategy, design, and engineering live in the same studio. That keeps the site from being a picture that cannot be built, or a build that ignored the picture.
          </p>
          <p>
            We work remotely{profile.location ? ` (${profile.location.toLowerCase()})` : ""}. Projects start with a written scope. Hosting, if you want it, starts with a private invite and a monthly amount we set.
          </p>
          <h2>What you keep</h2>
          <p>
            The domain stays in your registrar. After the project fee is paid, you own the final design and the content made for you. We keep the right to show the work unless we agree otherwise before launch.
          </p>
        </section>
        <aside className="stack">
          <article className="panel">
            <p className="kicker">Tools</p>
            <p>Design in the browser and in Figma. Builds are usually Next.js, with a CMS when you need to edit. Hosting is something we can actually watch.</p>
          </article>
          <article className="panel">
            <p className="kicker">Contact</p>
            <p>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {profile.phone ? (
                <>
                  <br />
                  {profile.phone}
                </>
              ) : null}
            </p>
            <a className="btn btn-solid" href="/contact">
              Contact us
            </a>
          </article>
          <article className="panel">
            <p className="kicker">Clients</p>
            <p>If you already have a hosting account, sign in. New accounts are invitation only.</p>
            <a className="btn" href="/login">
              Client login
            </a>
          </article>
        </aside>
      </div>
    </div>
  );
}
