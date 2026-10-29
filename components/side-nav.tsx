"use client";

import { usePathname } from "next/navigation";

export function SideNav({ items }: { items: { href: string; label: string; badge?: number }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Desk">
      {items.map((item) => {
        const current = item.href === "/admin" || item.href === "/portal" ? path === item.href : path === item.href || path.startsWith(`${item.href}/`);
        return (
          <a key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
            <span>{item.label}</span>
            {item.badge ? <span className="badge">{item.badge}</span> : null}
          </a>
        );
      })}
    </nav>
  );
}
