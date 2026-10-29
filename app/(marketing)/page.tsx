import { FaqList } from "@/components/faq-list";
import { ProjectArt } from "@/components/project-art";
import { homeFaq, marquee, packages, process, projects, reasons, services } from "@/lib/content";

export default function HomePage() {
  const featured = projects.filter((project) => project.featured);
  const loop = [...marquee, ...marquee];
  return (
    <>
      <section className="wrap hero">
        <div className="hero-copy">
          <p className="kicker">Studio for design, engineering, and hosting</p>
          <h1 className="display">
            Websites
            <br />
            that <em>earn</em>
            <br />
            their keep.
          </h1>
          <p className="lede">
            Murley Digital designs and builds sites for businesses that care how they look and what they do. When a site launches, we can host it. You get a private link, set a password, and turn on the monthly payment we agreed.
          </p>
          <div className="cluster hero-actions">
            <a className="btn btn-solid" href="/contact">
              Start a project
            </a>
            <a className="btn" href="/work">
              See the work
            </a>
          </div>
          <div className="hero-facts">
            <p>
              <strong>3 to 12 wks</strong>
              <span>Typical build, depending on the package.</span>
            </p>
            <p>
              <strong>You own it</strong>
              <span>The finished site is yours once the project is paid.</span>
            </p>
            <p>
              <strong>We set the rate</strong>
              <span>Monthly hosting is quoted from the real cost, per site.</span>
            </p>
          </div>
        </div>
        <div className="specimen" aria-hidden="true">
          <div className="specimen-top">
            <i />
            <i />
            <i />
            <span>harborandrye.example</span>
          </div>
          <div className="specimen-stage">
            <div>
              <small>Dinner, two rooms</small>
              <strong>Harbor &amp; Rye</strong>
              <div className="specimen-lines">
                <b />
                <b />
                <b />
              </div>
            </div>
            <div className="specimen-row">
              <span className="chip">Menus</span>
              <span className="chip chip-solid">Reserve a table</span>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="wrap block">
        <div className="section-head">
          <div>
            <p className="kicker">Selected work</p>
            <h2>Sites with a job to do.</h2>
          </div>
          <a className="text-link" href="/work">
            All projects
          </a>
        </div>
        <div className="work-list">
          {featured.map((project, index) => (
            <a className="work-row" href={`/work/${project.slug}`} key={project.slug}>
              <ProjectArt variant={project.art} name={project.name} sector={project.sector} index={String(index + 1).padStart(2, "0")} />
              <div className="work-copy">
                <p className="kicker">
                  {project.sector} · {project.year}
                </p>
                <h2>{project.name}</h2>
                <p>{project.summary}</p>
                <span className="text-link">View project</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="wrap block rule">
        <div className="section-head">
          <div>
            <p className="kicker">What we do</p>
            <h2>Six kinds of work. One studio.</h2>
          </div>
          <a className="text-link" href="/services">
            Services in detail
          </a>
        </div>
        <div className="service-index">
          {services.map((service) => (
            <article className="service-row" key={service.num}>
              <div className="num">{service.num}</div>
              <h3>{service.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap block rule">
        <div className="section-head">
          <div>
            <p className="kicker">Project fees</p>
            <h2>Plain prices for the build.</h2>
          </div>
          <a className="text-link" href="/pricing">
            Compare packages
          </a>
        </div>
        <div className="price-grid">
          {packages.map((item) => (
            <article className={item.featured ? "price-card featured" : "price-card"} key={item.id}>
              <p className="kicker">{item.priceNote}</p>
              <h3>{item.name}</h3>
              <div className="sum">{item.price}</div>
              <p className="fine">{item.timeline}</p>
              <p style={{ margin: 0 }}>{item.summary}</p>
            </article>
          ))}
        </div>
        <p className="fine" style={{ marginTop: "1rem" }}>
          Hosting is not bundled into these fees. It is quoted per site and billed monthly from the client portal.
        </p>
      </section>

      <section className="wrap block rule">
        <div className="hosting-band">
          <div>
            <p className="kicker">Monthly hosting</p>
            <h2>A private account. A rate we choose.</h2>
            <p>
              There is no public sign-up. When a site is ready to stay with us, we send one link. The monthly amount is already on it, based on what that site costs to host and care for.
            </p>
            <a className="btn" href="/pricing#hosting" style={{ background: "transparent", color: "#f4efe6", borderColor: "rgba(244,239,230,0.4)" }}>
              How billing works
            </a>
          </div>
          <div className="host-steps">
            <div className="host-step">
              <b>1</b>
              <p>We agree the monthly rate from the real hosting cost, not from a menu the client clicks.</p>
            </div>
            <div className="host-step">
              <b>2</b>
              <p>We send a private invite. The client sets a password. The link expires, and it cannot be reused.</p>
            </div>
            <div className="host-step">
              <b>3</b>
              <p>They add a card once. The same amount runs each month until they cancel from the portal.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap block rule">
        <div className="section-head">
          <div>
            <p className="kicker">Why people call</p>
            <h2>Usually one of these.</h2>
          </div>
        </div>
        <div className="reason-grid">
          {reasons.map((reason) => (
            <article className="reason" key={reason.title}>
              <h3>{reason.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {reason.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap block rule">
        <div className="section-head">
          <div>
            <p className="kicker">Process</p>
            <h2>From the first note to the monthly bill.</h2>
          </div>
        </div>
        <div className="step-grid">
          {process.map((step) => (
            <article className="step" key={step.num}>
              <div className="num">{step.num}</div>
              <h3>{step.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap block rule">
        <div className="split">
          <div>
            <p className="kicker">Questions</p>
            <h2>Before you write.</h2>
          </div>
          <FaqList items={homeFaq} />
        </div>
      </section>

      <section className="wrap block rule">
        <p className="kicker">Next</p>
        <h2>Tell us what the site has to do.</h2>
        <p className="lede">A few sentences is enough. We reply within two business days and say plainly if we are the right studio.</p>
        <div className="cluster" style={{ marginTop: "1.2rem" }}>
          <a className="btn btn-solid" href="/contact">
            Contact us
          </a>
          <a className="btn" href="/pricing">
            See pricing
          </a>
        </div>
      </section>
    </>
  );
}
