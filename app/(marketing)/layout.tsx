import { CookieNotice } from "@/components/cookie-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { readSession } from "@/lib/session";
import { getProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [profile, user] = await Promise.all([Promise.resolve(getProfile()), readSession()]);
  const account = !user
    ? { href: "/login", label: "Client login" }
    : user.role === "admin"
      ? { href: "/admin", label: "Desk" }
      : { href: "/portal", label: "Your account" };
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: profile.name,
    email: profile.email,
    description: profile.tagline,
    areaServed: "Worldwide",
  };
  return (
    <>
      <div className="frame" aria-hidden="true" />
      <SiteHeader accountHref={account.href} accountLabel={account.label} />
      <main id="content">{children}</main>
      <SiteFooter profile={profile} />
      <CookieNotice />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
