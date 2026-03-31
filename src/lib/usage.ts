import { createClient } from "@/lib/supabase/server";

const FREE_LIMIT = 1;

export async function checkUsage(): Promise<{ allowed: boolean; isPremium: boolean; used: number; userId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, isPremium: false, used: 0, userId: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, free_uses")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.is_premium === true;
  const used = profile?.free_uses ?? 0;

  if (isPremium) {
    return { allowed: true, isPremium: true, used, userId: user.id };
  }

  return { allowed: used < FREE_LIMIT, isPremium: false, used, userId: user.id };
}

// Use this for features that require premium (0 free uses)
export async function requirePremium(): Promise<{ allowed: boolean; userId: string | null }> {
  const usage = await checkUsage();
  return { allowed: usage.isPremium, userId: usage.userId };
}

export async function incrementUsage(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("free_uses")
    .eq("id", userId)
    .single();

  await supabase
    .from("profiles")
    .update({ free_uses: (data?.free_uses ?? 0) + 1 })
    .eq("id", userId);
}
