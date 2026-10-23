import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquante");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
});

export type PlanKey = "basic_monthly" | "basic_annual" | "premium";
export type PlanTier = "basic" | "premium";

export const PLANS: Record<PlanKey, { priceId: string; tier: PlanTier }> = {
  basic_monthly: { priceId: process.env.STRIPE_PRICE_BASIC || "", tier: "basic" },
  basic_annual: { priceId: process.env.STRIPE_PRICE_BASIC_ANNUAL || "", tier: "basic" },
  premium: { priceId: process.env.STRIPE_PRICE_PREMIUM || "", tier: "premium" },
};

export function tierFromPriceId(priceId: string | undefined): PlanTier | null {
  if (!priceId) return null;
  return Object.values(PLANS).find(p => p.priceId === priceId)?.tier ?? null;
}
