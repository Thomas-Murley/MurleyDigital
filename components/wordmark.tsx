"use client";

export function Wordmark({
  inverse = false,
  href = "/",
  large = false,
}: {
  inverse?: boolean;
  href?: string;
  large?: boolean;
}) {
  const className = `logo-link${inverse ? " inverse" : ""}${large ? " large" : ""}`;
  return (
    <a className={className} href={href}>
      <img src="/logo.png" alt="Murley Digital" width={910} height={640} />
    </a>
  );
}
