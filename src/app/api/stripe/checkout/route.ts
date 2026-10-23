import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rateLimit";

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bacfrancaisai.fr";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

    if (!checkRateLimit(`checkout:${user.id}`, 5, 60_000)) {
      return Response.json({ error: "Trop de requêtes." }, { status: 429 });
    }

    const { plan } = await request.json();
    const selected = PLANS[plan as PlanKey];
    if (!selected?.priceId) return Response.json({ error: "Offre invalide — recharge la page." }, { status: 400 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId: string | null = profile?.stripe_customer_id ?? null;

    // IDs from a previous Stripe account don't exist in the current one.
    if (customerId) {
      const found = await stripe.customers.retrieve(customerId).catch(() => null);
      if (!found || found.deleted) customerId = null;
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
      await createAdminClient()
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Already subscribed: switch the existing subscription instead of creating a second one.
    const existing = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const sub = existing.data[0];
    if (sub) {
      if (sub.items.data[0]?.price.id === selected.priceId) {
        return Response.json({ error: "Tu as déjà cette offre." }, { status: 400 });
      }
      await stripe.subscriptions.update(sub.id, {
        items: [{ id: sub.items.data[0].id, price: selected.priceId }],
        proration_behavior: "create_prorations",
      });
      return Response.json({ url: `${APP_URL}/premium/success` });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: selected.priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${APP_URL}/premium/success`,
      cancel_url: `${APP_URL}/premium`,
      metadata: { supabase_uid: user.id, tier: selected.tier },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[checkout] error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
