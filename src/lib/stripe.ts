import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2026-03-25.dahlia",
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY || "",
    name: "Premium Mensuel",
    price: "4.99€/mois",
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY || "",
    name: "Premium Annuel",
    price: "29.99€/an",
    badge: "-50%",
  },
};
