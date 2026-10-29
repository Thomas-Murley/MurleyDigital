export function clip(value: FormDataEntryValue | string | null | undefined, max: number) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max);
}

export function oneLine(value: FormDataEntryValue | string | null | undefined, max: number) {
  return clip(value, max).replace(/\s+/g, " ");
}

export function emailOk(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

export function safeNext(raw: string | null | undefined, role: "admin" | "customer") {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("://")) {
    return null;
  }
  if (role === "admin" && (raw === "/admin" || raw.startsWith("/admin/"))) return raw;
  if (role === "customer" && (raw === "/portal" || raw.startsWith("/portal/"))) return raw;
  return null;
}
