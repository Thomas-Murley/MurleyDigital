import type { Metadata } from "next";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "4rem 0" }}>
      <Wordmark />
      <p className="kicker" style={{ marginTop: "3rem" }}>
        404
      </p>
      <h1 className="display" style={{ fontSize: "clamp(3rem, 7vw, 5.2rem)" }}>
        This page is not on the site.
      </h1>
      <p className="lede">The link may be old. The work, the prices, and the client portal are still here.</p>
      <div className="cluster" style={{ marginTop: "1.4rem" }}>
        <a className="btn btn-solid" href="/">
          Back home
        </a>
        <a className="btn" href="/contact">
          Contact
        </a>
      </div>
    </main>
  );
}
