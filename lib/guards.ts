import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteUrlFromEnv } from "./mode";
import { readSession } from "./session";
import type { SessionUser } from "./types";

export async function requireUser(): Promise<SessionUser | null> {
  return readSession();
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await readSession();
  if (!user || user.role !== "admin") redirect("/login?next=/admin");
  return user;
}

export async function requireCustomer(): Promise<SessionUser> {
  const user = await readSession();
  if (!user || user.role !== "customer") redirect("/login?next=/portal");
  return user;
}

export async function requestOrigin() {
  const fromEnv = siteUrlFromEnv();
  if (fromEnv) return fromEnv;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function clientAddress() {
  const h = await headers();
  return (h.get("x-forwarded-for") || "local").split(",")[0]?.trim() || "local";
}
