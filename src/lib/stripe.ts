import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2026-03-25.dahlia",
});

export const PLANS = {
  premium: {
    priceId: process.env.STRIPE_PRICE_PREMIUM || "",
    name: "Premium",
    price: "9.99€/mois",
  },
};
