import type { Profile } from "@/lib/types";
import { Wordmark } from "./wordmark";

export function SiteFooter({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="block rule">
      <div className="wrap split">
        <div>
          <Wordmark large />
          <p className="lede" style={{ marginTop: "1rem" }}>
            {profile.tagline} Design, engineering, and the hosting that follows.
          </p>
          <p className="fine">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            {profile.phone ? ` · ${profile.phone}` : ""}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
        </div>
        <div className="split">
          <div className="stack">
            <a href="/work">Work</a>
            <a href="/services">Services</a>
            <a href="/pricing">Pricing</a>
            <a href="/about">Studio</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="stack">
            <a href="/login">Client login</a>
            <a href="/terms">Terms of service</a>
            <a href="/privacy">Privacy</a>
            <a href="/billing-terms">Billing terms</a>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: "2rem" }}>
        <p className="fine">
          © {year} {profile.legalName}. Project fees are invoiced separately from monthly hosting.
        </p>
      </div>
    </footer>
  );
}
