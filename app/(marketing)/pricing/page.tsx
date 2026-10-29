import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { comparison, hostingPresets, packages, pricingFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Project fees and monthly hosting for websites built by Murley Digital.",
};

const columns = ["Ledger", "Atelier", "Mercantile", "Commission"];

export default function PricingPage() {
  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">Pricing</p>
        <h1>Build fees, then a monthly rate.</h1>
        <p className="lede">
          The prices below are for the project. Hosting is separate, set per site from the real cost, and billed only after we send a private invite.
        </p>
      </header>
      <div className="price-grid">
        {packages.map((item) => (
          <article className={item.featured ? "price-card featured" : "price-card"} key={item.id}>
            <p className="kicker">{item.priceNote}</p>
            <h2 style={{ fontSize: "2rem" }}>{item.name}</h2>
            <div className="sum">{item.price}</div>
            <p className="fine">{item.timeline}</p>
            <p>{item.summary}</p>
            <ul>
              {item.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="block">
        <p className="kicker">Side by side</p>
        <h2>What is in each build.</h2>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Included</th>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {row.cells.map((cell, index) => (
                    <td key={`${row.label}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block rule" id="hosting">
        <p className="kicker">Hosting</p>
        <h2>Starting points, not the invoice.</h2>
        <p className="lede">
          These are guides. The number on a client&apos;s invite is the one that gets charged, and we choose it from that site&apos;s hosting cost and the care included. Unused edit time does not roll over. Extra work is quoted first, usually at $150 an hour.
        </p>
        <div className="preset-grid" style={{ marginTop: "1.2rem" }}>
          {hostingPresets.map((preset) => (
            <article className="panel" key={preset.id}>
              <p className="kicker">From ${preset.amount.replace(".00", "")}/month</p>
              <h3>{preset.label}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {preset.detail}
              </p>
            </article>
          ))}
        </div>
        <div className="hosting-band" style={{ marginTop: "1.2rem" }}>
          <div>
            <h2>How a client starts paying.</h2>
            <p className="fine">Accounts are opened by the studio. There is no sign-up button on this site.</p>
          </div>
          <div className="host-steps">
            <div className="host-step">
              <b>1</b>
              <p>We send a private link with the site name and the monthly amount.</p>
            </div>
            <div className="host-step">
              <b>2</b>
              <p>The client creates a password and agrees to the billing terms.</p>
            </div>
            <div className="host-step">
              <b>3</b>
              <p>They add a card. The first period is charged then, and the same amount runs each month.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block rule">
        <p className="kicker">Questions</p>
        <FaqList items={pricingFaq} />
        <div className="cluster" style={{ marginTop: "1.4rem" }}>
          <a className="btn btn-solid" href="/contact">
            Start a project
          </a>
          <a className="btn" href="/billing-terms">
            Read the billing terms
          </a>
        </div>
      </section>
    </div>
  );
}
