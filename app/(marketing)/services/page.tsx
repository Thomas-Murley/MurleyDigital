import type { Metadata } from "next";
import { process, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Marketing sites, stores, web tools, content systems, and hosting from Murley Digital.",
};

export default function ServicesPage() {
  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">Services</p>
        <h1>What we can do.</h1>
        <p className="lede">
          We design and build the site, then we can keep it online. The build is a project. Hosting is a monthly amount we set for that site.
        </p>
      </header>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {services.map((service) => (
          <article className="panel" key={service.num}>
            <p className="kicker">{service.num}</p>
            <h2>{service.title}</h2>
            <p className="measure">{service.text}</p>
            <p>
              <strong>A good fit if. </strong>
              {service.fit}
            </p>
            <ul className="plain-list">
              {service.delivers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <section className="block">
        <p className="kicker">What we do not do</p>
        <div className="reason-grid">
          <article className="reason">
            <h3>Template installs</h3>
            <p className="muted">We will not resell a theme as a custom site.</p>
          </article>
          <article className="reason">
            <h3>Holding your domain</h3>
            <p className="muted">The domain stays in your registrar. We can be a technical contact.</p>
          </article>
          <article className="reason">
            <h3>Ads management</h3>
            <p className="muted">We will set up analytics. We do not run ad accounts.</p>
          </article>
          <article className="reason">
            <h3>Guaranteed rankings</h3>
            <p className="muted">We ship the search foundations. Nobody honest can sell a ranking.</p>
          </article>
        </div>
      </section>
      <section>
        <p className="kicker">How an engagement moves</p>
        <div className="step-grid">
          {process.map((step) => (
            <article className="step" key={step.num}>
              <div className="num">{step.num}</div>
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="cluster" style={{ marginTop: "1.4rem" }}>
          <a className="btn btn-solid" href="/contact">
            Contact us
          </a>
          <a className="btn" href="/pricing">
            See pricing
          </a>
        </div>
      </section>
    </div>
  );
}
