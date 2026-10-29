import type { Metadata } from "next";
import { ProjectArt } from "@/components/project-art";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected websites designed and built by Murley Digital.",
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ sector?: string }> }) {
  const { sector } = await searchParams;
  const sectors = ["All", ...Array.from(new Set(projects.map((project) => project.sector)))];
  const visible = !sector || sector === "All" ? projects : projects.filter((project) => project.sector === sector);
  return (
    <div className="wrap" style={{ paddingBottom: "4rem" }}>
      <header className="page-hero">
        <p className="kicker">{String(projects.length).padStart(2, "0")} projects</p>
        <h1>Selected work.</h1>
        <p className="lede">Marketing sites, shops, and a few places that needed the booking to live on the site itself.</p>
      </header>
      <div className="filters" aria-label="Filter by sector">
        {sectors.map((item) => {
          const on = (sector || "All") === item;
          const href = item === "All" ? "/work" : `/work?sector=${encodeURIComponent(item)}`;
          return (
            <a key={item} href={href} aria-current={on ? "true" : undefined}>
              {item}
            </a>
          );
        })}
      </div>
      <div className="work-list">
        {visible.map((project, index) => (
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
      {visible.length === 0 ? <p className="empty">Nothing in that sector yet.</p> : null}
    </div>
  );
}
