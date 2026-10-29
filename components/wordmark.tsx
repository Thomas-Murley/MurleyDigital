"use client";

export function Wordmark({ inverse = false, href = "/" }: { inverse?: boolean; href?: string }) {
  return (
    <a className={inverse ? "wordmark inverse" : "wordmark"} href={href}>
      <span className="mark" aria-hidden="true">
        M
      </span>
      <span>Murley</span>
      <small>Digital</small>
    </a>
  );
}
