import { stripe, tierFromPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return Response.json({ error: "Signature invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.supabase_uid;
    const tier = session.metadata?.tier === "basic" ? "basic" : "premium";
    if (uid) {
      await supabase.from("profiles").update({ is_premium: true, plan: tier }).eq("id", uid);
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const customerId = subscription.customer as string;

    const isActive = subscription.status === "active" || subscription.status === "trialing";
    const tier = tierFromPriceId(subscription.items.data[0]?.price.id) ?? "premium";

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ is_premium: isActive, plan: isActive ? tier : null })
        .eq("id", profile.id);
    }
  }

  return Response.json({ received: true });
}
