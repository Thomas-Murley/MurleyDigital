import type { LegalSection } from "@/lib/legal";
import { legalUpdated } from "@/lib/content";

export function LegalDocument({
  kicker,
  title,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <article className="narrow page-hero" style={{ paddingBottom: "4rem" }}>
      <p className="kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="fine">Last updated {legalUpdated}</p>
      <p className="lede" style={{ margin: "1rem 0 2rem" }}>
        {intro}
      </p>
      <div className="prose">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
