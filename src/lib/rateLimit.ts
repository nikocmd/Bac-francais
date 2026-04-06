// In-memory sliding window rate limiter
// Works per Vercel instance — good protection for early stage, upgrade to Upstash Redis for scale

const store = new Map<string, number[]>();

/**
 * Returns true if the request is allowed, false if rate limit exceeded.
 * key        — unique identifier (e.g. `analyse:userId`)
 * max        — max requests allowed in the window (default 5)
 * windowMs   — sliding window in ms (default 60s)
 */
export function checkRateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const prev = store.get(key) ?? [];
  const recent = prev.filter(t => now - t < windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  store.set(key, recent);
  // Cleanup: cap store size to 10k keys to avoid memory leak
  if (store.size > 10_000) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  return true;
}
