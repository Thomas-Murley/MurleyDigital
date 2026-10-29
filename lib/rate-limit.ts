const buckets = new Map<string, { n: number; reset: number }>();

export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  current.n += 1;
  return current.n > max;
}
