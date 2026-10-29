import "server-only";

export function billingMode(): "stripe" | "demo" {
  if (process.env.BILLING_MODE === "demo") return "demo";
  if (process.env.STRIPE_SECRET_KEY) return "stripe";
  return "demo";
}

export function siteUrlFromEnv() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}
