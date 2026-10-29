"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "./wordmark";

const links = [
  ["/work", "Work"],
  ["/services", "Services"],
  ["/pricing", "Pricing"],
  ["/about", "Studio"],
  ["/contact", "Contact"],
];

export function SiteHeader({ accountHref, accountLabel }: { accountHref: string; accountLabel: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <header className="nav">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="wrap nav-bar">
        <Wordmark />
        <nav id="primary-nav" className={open ? "nav-links open" : "nav-links"} aria-label="Primary">
          {links.map(([href, label]) => {
            const current = path === href || path.startsWith(`${href}/`);
            return (
              <a key={href} href={href} aria-current={current ? "page" : undefined}>
                {label}
              </a>
            );
          })}
          <a className="nav-only-mobile" href={accountHref}>
            {accountLabel}
          </a>
          <a className="btn btn-solid nav-only-mobile" href="/contact">
            Start a project
          </a>
        </nav>
        <div className="nav-actions">
          <a className="nav-login" href={accountHref}>
            {accountLabel}
          </a>
          <a className="btn btn-solid nav-cta" href="/contact">
            Start a project
          </a>
          <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
