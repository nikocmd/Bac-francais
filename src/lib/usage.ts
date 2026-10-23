import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const FREE_LIMIT = 1;

export type Feature = "analyse" | "oral" | "oeuvre" | "examen";

export const BASIC_LIMITS: Record<Feature, number> = {
  analyse: 10,
  oral: 10,
  oeuvre: 20,
  examen: 5,
};

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("is_premium, plan, free_uses")
    .eq("id", user.id)
    .single();
  return { userId: user.id, isPaid: data?.is_premium === true, plan: data?.plan as string | null, freeUses: data?.free_uses ?? 0 };
}

async function monthlyCount(userId: string, feature: Feature) {
  const { data } = await createAdminClient()
    .from("usage_counters")
    .select("count")
    .eq("user_id", userId)
    .eq("month", currentMonth())
    .eq("feature", feature)
    .maybeSingle();
  return data?.count ?? 0;
}

// Free users get FREE_LIMIT uses only for features where allowFree is true.
export async function checkFeature(feature: Feature, allowFree = false): Promise<{ allowed: boolean; userId: string | null; reason?: "FREE" | "QUOTA" }> {
  const p = await getProfile();
  if (!p) return { allowed: false, userId: null, reason: "FREE" };

  if (!p.isPaid) {
    const allowed = allowFree && p.freeUses < FREE_LIMIT;
    return { allowed, userId: p.userId, reason: allowed ? undefined : "FREE" };
  }

  if (p.plan !== "basic") return { allowed: true, userId: p.userId };

  const used = await monthlyCount(p.userId, feature);
  const allowed = used < BASIC_LIMITS[feature];
  return { allowed, userId: p.userId, reason: allowed ? undefined : "QUOTA" };
}

export async function recordUse(userId: string, feature: Feature) {
  const admin = createAdminClient();
  const month = currentMonth();
  const { data: profile } = await admin.from("profiles").select("is_premium, free_uses").eq("id", userId).single();

  if (!profile?.is_premium) {
    await admin.from("profiles").update({ free_uses: (profile?.free_uses ?? 0) + 1 }).eq("id", userId);
    return;
  }

  const count = await monthlyCount(userId, feature);
  await admin.from("usage_counters").upsert({ user_id: userId, month, feature, count: count + 1 });
}

export async function getMonthlyUsage(userId: string): Promise<Record<Feature, number>> {
  const { data } = await createAdminClient()
    .from("usage_counters")
    .select("feature, count")
    .eq("user_id", userId)
    .eq("month", currentMonth());
  const out: Record<Feature, number> = { analyse: 0, oral: 0, oeuvre: 0, examen: 0 };
  for (const row of data ?? []) out[row.feature as Feature] = row.count;
  return out;
}

// Feature allowed for any paid plan, no quota (e.g. transcription, grammar generation).
export async function requirePaid(): Promise<{ allowed: boolean; userId: string | null }> {
  const p = await getProfile();
  return { allowed: !!p?.isPaid, userId: p?.userId ?? null };
}
