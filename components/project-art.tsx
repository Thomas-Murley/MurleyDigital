export function ProjectArt({
  variant,
  name,
  sector,
  index,
  large = false,
}: {
  variant: string;
  name: string;
  sector: string;
  index: string;
  large?: boolean;
}) {
  return (
    <div className={large ? `art art-lg art-${variant}` : `art art-${variant}`}>
      <div className="art-top">
        <span>{index}</span>
        <span>{sector}</span>
      </div>
      {variant === "sable" ? (
        <svg className="art-svg" viewBox="0 0 400 180" aria-hidden="true">
          <path d="M8 140 C 70 140, 90 30, 160 36 S 250 160, 392 48" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="160" cy="36" r="4" fill="currentColor" />
          <circle cx="392" cy="48" r="4" fill="currentColor" />
        </svg>
      ) : variant === "june" ? (
        <svg className="art-svg" viewBox="0 0 400 200" aria-hidden="true">
          <path d="M70 180 V90 A130 130 0 0 1 330 90 V180" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M150 180 V120 H250 V180" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ) : (
        <div className="art-shape" />
      )}
      <div className="art-name">{name}</div>
    </div>
  );
}
