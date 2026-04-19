import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const SECRET = "sync-bacfrancais-2026";

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  // Protection par secret header
  const auth = request.headers.get("x-sync-secret");
  if (auth !== SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia" as never,
  });
  const supabase = createAdminClient();

  const results: { email: string; customerId: string; uid: string | null; action: string }[] = [];

  // 1. Récupère toutes les subscriptions actives Stripe
  const subscriptions = await stripe.subscriptions.list({
    status: "active",
    limit: 100,
    expand: ["data.customer"],
  });

  for (const sub of subscriptions.data) {
    const customer = sub.customer as Stripe.Customer;
    const customerId = customer.id;
    const email = customer.email ?? "";

    // 2. Cherche l'utilisateur dans Supabase par stripe_customer_id
    let { data: profile } = await supabase
      .from("profiles")
      .select("id, is_premium")
      .eq("stripe_customer_id", customerId)
      .single();

    // 3. Si pas trouvé par customer_id, cherche par email dans auth.users
    let uid: string | null = profile?.id ?? null;

    if (!profile) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const match = users?.users?.find(u => u.email === email);
      if (match) {
        uid = match.id;
        // Met à jour le stripe_customer_id
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", uid);
      }
    }

    if (uid) {
      // 4. Active le premium
      const { error } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", uid);

      results.push({
        email,
        customerId,
        uid,
        action: error ? `ERREUR: ${error.message}` : "is_premium = true ✅",
      });
    } else {
      results.push({
        email,
        customerId,
        uid: null,
        action: "Utilisateur non trouvé dans Supabase ❌",
      });
    }
  }

  return Response.json({
    total: subscriptions.data.length,
    results,
  });
}
