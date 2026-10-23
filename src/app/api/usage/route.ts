import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { BASIC_LIMITS, getMonthlyUsage } from "@/lib/usage";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Non connecté" }, { status: 401 });
  }

  if (!checkRateLimit(`usage:${user.id}`, 30, 60_000)) {
    return Response.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_premium, plan, free_uses")
    .eq("id", user.id)
    .single();

  const isPaid = data?.is_premium === true;
  const plan = !isPaid ? "free" : data?.plan === "basic" ? "basic" : "premium";

  return Response.json({
    isPremium: isPaid,
    plan,
    used: data?.free_uses ?? 0,
    limit: 1,
    monthly: plan === "basic" ? await getMonthlyUsage(user.id) : null,
    limits: plan === "basic" ? BASIC_LIMITS : null,
  });
}
