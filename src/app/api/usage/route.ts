import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ isPremium: false, used: 0, limit: 1 });
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
