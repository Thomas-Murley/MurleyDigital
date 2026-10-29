import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArt } from "@/components/project-art";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project" };
  return { title: project.name, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  return (
    <article className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">
          <a href="/work">Work</a> · {project.sector} · {project.year}
        </p>
        <h1>{project.name}</h1>
        <p className="lede">{project.summary}</p>
      </header>
      <ProjectArt large variant={project.art} name={project.name} sector={project.sector} index={String(index + 1).padStart(2, "0")} />
      <ul className="metrics">
        {project.metrics.map((metric) => (
          <li key={metric.label}>
            <strong>{metric.value}</strong>
            <span className="muted">{metric.label}</span>
          </li>
        ))}
      </ul>
      <div className="split">
        <section>
          <h2>The problem</h2>
          <p>{project.challenge}</p>
        </section>
        <section>
          <h2>What we made</h2>
          <p>{project.approach}</p>
        </section>
      </div>
      <section style={{ marginTop: "1.5rem" }}>
        <h2>What changed</h2>
        <p className="measure">{project.outcome}</p>
      </section>
      <section style={{ marginTop: "1.5rem" }}>
        <h2>Scope</h2>
        <ul className="plain-list">
          {project.scope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="fine">Services: {project.services.join(", ")}.</p>
      </section>
      <a className="case-next" href={`/work/${next.slug}`}>
        <span>Next project</span>
        <strong className="serif" style={{ fontSize: "1.6rem" }}>
          {next.name}
        </strong>
      </a>
    </article>
  );
}
