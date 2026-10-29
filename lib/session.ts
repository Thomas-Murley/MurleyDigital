import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { findUser, getSessionSecret, getStore } from "./store";
import type { SessionUser, User } from "./types";

export const SESSION_COOKIE = "murley_session";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;

type Payload = { uid: string; role: User["role"]; exp: number };

function sign(body: string) {
  return createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
}

export function createSessionToken(user: Pick<User, "id" | "role">) {
  const payload: Payload = { uid: user.id, role: user.role, exp: Date.now() + MAX_AGE_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (!payload.uid || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = findUser(getStore(), payload.uid);
  if (!user || user.role !== payload.role) return null;
  return toSessionUser(user);
}
