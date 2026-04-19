import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";

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
    .select("is_premium, free_uses")
    .eq("id", user.id)
    .single();

  return Response.json({
    isPremium: data?.is_premium === true,
    used: data?.free_uses ?? 0,
    limit: 1,
  });
}
