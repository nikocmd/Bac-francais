import { stripe, PLANS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";

const ALLOWED_PRICE_IDS = new Set([PLANS.premium.priceId].filter(Boolean));
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bacfrancaisai.fr";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

    if (!checkRateLimit(`checkout:${user.id}`, 5, 60_000)) {
      return Response.json({ error: "Trop de requêtes." }, { status: 429 });
    }

    const { priceId } = await request.json();
    if (!priceId) return Response.json({ error: "Price ID requis" }, { status: 400 });

    // Whitelist check — only allow known price IDs
    if (ALLOWED_PRICE_IDS.size > 0 && !ALLOWED_PRICE_IDS.has(priceId)) {
      return Response.json({ error: "Prix invalide — rechargez la page." }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/premium/success`,
      cancel_url: `${APP_URL}/premium`,
      metadata: { supabase_uid: user.id },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[checkout] error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
