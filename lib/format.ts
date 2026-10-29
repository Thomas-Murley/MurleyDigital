import type { Invite } from "./types";

export function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function longDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function addMonths(iso: string, months: number) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const target = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth() + months,
      1,
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds(),
    ),
  );
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString();
}

export function dollarsToCents(input: string): number | null {
  const cleaned = input.trim().replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const [d, c = ""] = cleaned.split(".");
  const cents = Number(d) * 100 + Number((c + "00").slice(0, 2));
  if (!Number.isSafeInteger(cents)) return null;
  return cents;
}

export type InviteState = "pending" | "accepted" | "expired" | "revoked";

export function inviteState(invite: Invite, now = Date.now()): InviteState {
  if (invite.revokedAt) return "revoked";
  if (invite.acceptedAt) return "accepted";
  if (new Date(invite.expiresAt).getTime() < now) return "expired";
  return "pending";
}

export function brandLabel(brand: string) {
  const map: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    discover: "Discover",
    card: "Card",
  };
  return map[brand] || brand.charAt(0).toUpperCase() + brand.slice(1);
}
