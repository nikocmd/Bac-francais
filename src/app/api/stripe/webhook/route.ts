import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

// Use service role to bypass RLS
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

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
    if (uid) {
      await supabase.from("profiles").update({ is_premium: true }).eq("id", uid);
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const customerId = subscription.customer as string;

    const isPremium = subscription.status === "active" || subscription.status === "trialing";

    // Find user by stripe_customer_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile) {
      await supabase.from("profiles").update({ is_premium: isPremium }).eq("id", profile.id);
    }
  }

  return Response.json({ received: true });
}
