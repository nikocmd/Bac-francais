import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const SECRET = "sync-bacfrancais-2026";

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const auth = request.headers.get("x-sync-secret");
  if (auth !== SECRET) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = createAdminClient();

  // Lister tous les users Supabase
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const users = data.users.map(u => ({
    id: u.id,
    email: u.email,
  }));

  // Lister tous les profiles avec stripe_customer_id
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, stripe_customer_id, is_premium");

  return Response.json({ users, profiles });
}

export async function POST(request: Request) {
  const auth = request.headers.get("x-sync-secret");
  if (auth !== SECRET) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia" as never,
  });
  const supabase = createAdminClient();

  const results: { email: string; customerId: string; uid: string | null; action: string }[] = [];

  // Liste tous les users Supabase pour matching
  const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const allUsers = authData?.users ?? [];

  // Récupère toutes les subscriptions actives Stripe
  const subscriptions = await stripe.subscriptions.list({
    status: "active",
    limit: 100,
    expand: ["data.customer"],
  });

  for (const sub of subscriptions.data) {
    const customer = sub.customer as Stripe.Customer;
    const customerId = customer.id;
    const email = customer.email ?? "";

    // Cherche par stripe_customer_id dans profiles
    let { data: profile } = await supabase
      .from("profiles")
      .select("id, is_premium")
      .eq("stripe_customer_id", customerId)
      .single();

    let uid: string | null = profile?.id ?? null;

    // Si pas trouvé, cherche par email dans auth users
    if (!uid) {
      const match = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (match) {
        uid = match.id;
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", uid);
      }
    }

    if (uid) {
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

  return Response.json({ total: subscriptions.data.length, results });
}
