import { Wordmark } from "@/components/wordmark";

export const dynamic = "force-dynamic";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="frame" aria-hidden="true" />
      <header className="nav">
        <div className="wrap nav-bar" style={{ gridTemplateColumns: "auto 1fr auto" }}>
          <Wordmark />
          <span />
          <a className="nav-login" href="/contact">
            Contact
          </a>
        </div>
      </header>
      <main id="content" className="auth-main">
        <div className="wrap">{children}</div>
      </main>
    </>
  );
}
