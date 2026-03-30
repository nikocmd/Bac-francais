export interface HunterData {
  level: number;
  xp: number;
  xpToNext: number;
  rank: "E" | "D" | "C" | "B" | "A" | "S";
  title: string;
  stats: {
    INT: number;
    CHA: number;
    WIS: number;
    STR: number;
    LCK: number;
  };
  quests: { id: string; completed: boolean; date: string }[];
  totalAnalyses: number;
  totalOrals: number;
  totalOeuvres: number;
  totalExamens: number;
  notifications: { id: string; message: string; ts: number }[];
}

const XP_PER_LEVEL = 500;

export const RANKS: { min: number; max: number; rank: HunterData["rank"]; title: string; color: string; glow: string }[] = [
  { min: 1,  max: 5,  rank: "E", title: "Élève Novice",       color: "#6b7280", glow: "shadow-gray-500/30" },
  { min: 6,  max: 10, rank: "D", title: "Apprenti Lettré",    color: "#3b82f6", glow: "shadow-blue-500/40" },
  { min: 11, max: 20, rank: "C", title: "Rhétoricien",        color: "#8b5cf6", glow: "shadow-purple-500/40" },
  { min: 21, max: 35, rank: "B", title: "Analyste Confirmé",  color: "#06b6d4", glow: "shadow-cyan-500/50" },
  { min: 36, max: 50, rank: "A", title: "Maître des Lettres", color: "#f59e0b", glow: "shadow-amber-500/60" },
  { min: 51, max: 999,rank: "S", title: "Génie Littéraire",   color: "#FFD700", glow: "shadow-yellow-400/70" },
];

export const DAILY_QUESTS = [
  { id: "analyse", label: "Réalise une analyse linéaire",    xp: 150, stat: "INT" as const, icon: "📖" },
  { id: "oral",    label: "Entraîne-toi à l'oral",           xp: 100, stat: "CHA" as const, icon: "🎤" },
  { id: "oeuvre",  label: "Pose 3 questions sur ton œuvre",  xp: 75,  stat: "WIS" as const, icon: "📚" },
  { id: "examen",  label: "Complète un examen blanc",        xp: 200, stat: "STR" as const, icon: "🎓" },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function getRankInfo(level: number) {
  return RANKS.find(r => level >= r.min && level <= r.max) ?? RANKS[RANKS.length - 1];
}

/* ── LocalStorage (fallback sans compte) ── */
export function loadHunter(): HunterData {
  if (typeof window === "undefined") return defaultHunter();
  const raw = localStorage.getItem("hunter");
  if (!raw) return defaultHunter();
  try { return JSON.parse(raw); } catch { return defaultHunter(); }
}

function defaultHunter(): HunterData {
  const ri = getRankInfo(1);
  return {
    level: 1, xp: 0, xpToNext: XP_PER_LEVEL,
    rank: ri.rank, title: ri.title,
    stats: { INT: 0, CHA: 0, WIS: 0, STR: 0, LCK: 0 },
    quests: [],
    totalAnalyses: 0, totalOrals: 0, totalOeuvres: 0, totalExamens: 0,
    notifications: [],
  };
}

export function saveHunter(h: HunterData) {
  if (typeof window === "undefined") return;
  localStorage.setItem("hunter", JSON.stringify(h));
}

/* ── Supabase sync ── */
export async function loadHunterFromDB(userId: string): Promise<HunterData> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data } = await supabase
    .from("hunter_data")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return defaultHunter();

  return {
    level: data.level ?? 1,
    xp: data.xp ?? 0,
    xpToNext: data.xp_to_next ?? XP_PER_LEVEL,
    rank: data.rank ?? "E",
    title: data.title ?? "Élève Novice",
    stats: data.stats ?? { INT: 0, CHA: 0, WIS: 0, STR: 0, LCK: 0 },
    quests: data.quests ?? [],
    totalAnalyses: data.total_analyses ?? 0,
    totalOrals: data.total_orals ?? 0,
    totalOeuvres: data.total_oeuvres ?? 0,
    totalExamens: data.total_examens ?? 0,
    notifications: [],
  };
}

export async function saveHunterToDB(userId: string, h: HunterData) {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  await supabase.from("hunter_data").upsert({
    user_id: userId,
    level: h.level,
    xp: h.xp,
    xp_to_next: h.xpToNext,
    rank: h.rank,
    title: h.title,
    stats: h.stats,
    quests: h.quests,
    total_analyses: h.totalAnalyses,
    total_orals: h.totalOrals,
    total_oeuvres: h.totalOeuvres,
    total_examens: h.totalExamens,
    updated_at: new Date().toISOString(),
  });
}

/* ── addXP (local + DB si connecté) ── */
export async function addXP(questId: string, userId?: string): Promise<{ hunter: HunterData; leveledUp: boolean }> {
  const quest = DAILY_QUESTS.find(q => q.id === questId);
  if (!quest) return { hunter: loadHunter(), leveledUp: false };

  const h = userId ? await loadHunterFromDB(userId) : loadHunter();
  const today = getToday();

  h.quests = h.quests.filter((q: { date: string }) => q.date === today);
  const alreadyDone = h.quests.find((q: { id: string }) => q.id === questId);

  if (!alreadyDone) {
    h.quests.push({ id: questId, completed: true, date: today });
    h.stats[quest.stat] = Math.min(999, h.stats[quest.stat] + 10);
    if (Math.random() < 0.2) h.stats.LCK = Math.min(999, h.stats.LCK + 5);
  }

  if (questId === "analyse") h.totalAnalyses++;
  if (questId === "oral")    h.totalOrals++;
  if (questId === "oeuvre")  h.totalOeuvres++;
  if (questId === "examen")  h.totalExamens++;

  const xpGain = alreadyDone ? Math.floor(quest.xp * 0.25) : quest.xp;
  h.xp += xpGain;

  let leveledUp = false;
  while (h.xp >= h.xpToNext) {
    h.xp -= h.xpToNext;
    h.level++;
    h.xpToNext = Math.floor(XP_PER_LEVEL * (1 + (h.level - 1) * 0.15));
    leveledUp = true;
  }

  const ri = getRankInfo(h.level);
  h.rank = ri.rank;
  h.title = ri.title;
  h.notifications = [
    { id: Date.now().toString(), message: alreadyDone ? `+${xpGain} XP bonus` : `Quête ! +${xpGain} XP · +10 ${quest.stat}`, ts: Date.now() },
    ...h.notifications.slice(0, 9),
  ];

  if (userId) await saveHunterToDB(userId, h);
  else saveHunter(h);

  return { hunter: h, leveledUp };
}

export function getTodayQuestStatus(h: HunterData) {
  const today = getToday();
  return DAILY_QUESTS.map(q => ({
    ...q,
    done: h.quests.some((hq: { id: string; date: string }) => hq.id === q.id && hq.date === today),
  }));
}
