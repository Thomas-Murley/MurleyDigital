import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string, hash: string) {
  try {
    const next = Buffer.from(hashToken(token), "hex");
    const prev = Buffer.from(hash, "hex");
    if (next.length !== prev.length) return false;
    return timingSafeEqual(next, prev);
  } catch {
    return false;
  }
}

export function randomToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}
