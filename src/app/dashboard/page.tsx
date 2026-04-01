"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BookOpen, Mic, Library, GraduationCap, PenLine, ChevronRight } from "lucide-react";
import {
  loadHunter, loadHunterFromDB, getRankInfo, getTodayQuestStatus,
  DAILY_QUESTS, RANKS, type HunterData,
} from "@/lib/gamification";

/* ── Rank badge ─────────────────────────────────────────────────────── */
const RANK_STYLES: Record<string, string> = {
  E: "border-gray-500 text-gray-400 shadow-[0_0_12px_rgba(107,114,128,0.5)]",
  D: "border-blue-600 text-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.6)]",
  C: "border-purple-500 text-purple-400 shadow-[0_0_16px_rgba(139,92,246,0.6)]",
  B: "border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.7)]",
  A: "border-amber-400 text-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.8)]",
  S: "border-yellow-300 text-yellow-200 shadow-[0_0_28px_rgba(253,224,71,0.9)]",
};
// Past (unlocked but not current) — color sans glow
const RANK_STYLES_PAST: Record<string, string> = {
  E: "border-gray-500/40 text-gray-500/60",
  D: "border-blue-600/40 text-blue-400/60",
  C: "border-purple-500/40 text-purple-400/60",
  B: "border-cyan-400/40 text-cyan-300/60",
  A: "border-amber-400/40 text-amber-300/60",
  S: "border-yellow-300/40 text-yellow-200/60",
};
const RANK_BG: Record<string, string> = {
  E: "bg-gray-900/80",
  D: "bg-blue-950/80",
  C: "bg-purple-950/80",
  B: "bg-cyan-950/80",
  A: "bg-amber-950/80",
  S: "bg-yellow-950/80",
};

/* ── System notification ─────────────────────────────────────────────── */
function SystemNotif({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]"
      style={{ animation: "slideIn 0.3s ease-out" }}>
      <div className="bg-[#0a1543]/95 border border-[#1a9fff]/60 rounded-lg px-5 py-3
        shadow-[0_0_20px_rgba(26,159,255,0.5),0_0_40px_rgba(26,159,255,0.2)]
        backdrop-blur-md max-w-xs">
        <p className="text-xs font-bold text-[#00d9ff] uppercase tracking-widest mb-1">
          ✦ Système
        </p>
        <p className="text-sm text-white font-medium">{message}</p>
      </div>
    </div>
  );
}

/* ── Stat bar ───────────────────────────────────────────────────────── */
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, value / 10);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#a0b0d0] tracking-widest font-bold uppercase text-xs">{label}</span>
        <span className="font-mono text-base font-black" style={{ color }}>{value}</span>
      </div>
      <div className="h-4 bg-[#050a2e] border border-[#19327f]/60 rounded-sm overflow-hidden
        shadow-[inset_0_0_6px_rgba(0,0,0,0.6)]">
        <div
          className="h-full rounded-sm relative overflow-hidden transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 10px ${color}88` }}
        >
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
              animation: "shimmer 2s infinite" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Quest card ─────────────────────────────────────────────────────── */
function QuestCard({ quest, done, onClick }: {
  quest: typeof DAILY_QUESTS[number] & { done: boolean };
  done: boolean;
  onClick: () => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    analyse: <BookOpen size={16} />, oral: <Mic size={16} />,
    oeuvre: <Library size={16} />, examen: <GraduationCap size={16} />,
  };
  const hrefs: Record<string, string> = {
    analyse: "/analyse", oral: "/oral", oeuvre: "/oeuvre", examen: "/examen",
  };
  return (
    <div className={`relative border rounded-lg p-4 transition-all duration-300 group
      ${done
        ? "bg-[#0a1543]/40 border-[#19327f]/30 opacity-60"
        : "bg-[#0a1543]/80 border-l-4 border-[#FFD700]/60 border-r-[#19327f]/40 border-t-[#19327f]/40 border-b-[#19327f]/40 hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
      }`}>
      {done && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#0a1543]/60 z-10">
          <span className="text-[#00d9ff] font-bold text-sm tracking-widest">✦ ACCOMPLIE ✦</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded ${done ? "bg-[#19327f]/30 text-[#6b7280]" : "bg-[#FFD700]/10 text-[#FFD700]"}`}>
            {icons[quest.id]}
          </span>
          <span className={`text-sm font-bold tracking-wide ${done ? "text-[#6b7280]" : "text-[#e8e8f0]"}`}>
            {quest.label}
          </span>
        </div>
        <span className="text-xs font-bold font-mono text-[#00d9ff]">+{quest.xp} XP</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#a0b0d0]">Récompense : +10 {{ INT: "Acuité", CHA: "Éloquence", WIS: "Érudition", STR: "Rigueur", LCK: "Destin" }[quest.stat]}</span>
        {!done && (
          <Link href={hrefs[quest.id]} onClick={onClick}
            className="flex items-center gap-1 text-xs text-[#1a9fff] hover:text-[#00d9ff] font-bold transition-colors">
            Commencer <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Main dashboard ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const [hunter, setHunter] = useState<HunterData | null>(null);
  const [notif, setNotif] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    setHunter(loadHunter());
    async function syncFromDB() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [h, { data: profile }] = await Promise.all([
            loadHunterFromDB(user.id),
            supabase.from("profiles").select("avatar_url, username").eq("id", user.id).single(),
          ]);
          setHunter(h);
          if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
          if (profile?.username) setUsername(profile.username);
        }
      } catch { /* garde les données locales */ }
    }
    syncFromDB();
  }, []);

  const dismissNotif = useCallback(() => setNotif(null), []);

  if (!hunter) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="text-[#1a9fff] text-lg font-mono tracking-widest animate-pulse">
        SYSTÈME EN COURS DE CHARGEMENT...
      </div>
    </div>
  );

  const ri = getRankInfo(hunter.level);
  const xpPct = Math.round((hunter.xp / hunter.xpToNext) * 100);
  const quests = getTodayQuestStatus(hunter);
  const doneTodayCount = quests.filter(q => q.done).length;

  return (
    <div className="min-h-screen bg-[#050510] px-4 py-8">
      {/* Animated background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(26,159,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,159,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      {/* Notification */}
      {notif && <SystemNotif message={notif} onDone={dismissNotif} />}

      {/* Level up overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
          onClick={() => setShowLevelUp(false)}>
          <div className="text-center space-y-4 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-7xl">⚡</div>
            <div className="text-4xl font-black text-[#FFD700] tracking-widest"
              style={{ textShadow: "0 0 30px #FFD700, 0 0 60px #FFD700" }}>
              LEVEL UP !
            </div>
            <div className="text-xl text-[#00d9ff] font-bold tracking-widest">
              NIVEAU {hunter.level} ATTEINT
            </div>
            <div className="text-[#a0b0d0] text-sm">Appuie n&apos;importe où pour continuer</div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10 space-y-6">

        {/* ── Header / Hunter Card ───────────────────────────── */}
        <div className="bg-[#0a1543]/90 border border-[#19327f] rounded-xl p-6
          shadow-[0_0_30px_rgba(25,50,127,0.4)] backdrop-blur">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

            {/* Avatar + rank */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#0a1543] to-[#19327f]
                flex items-center justify-center border-2 ${RANK_STYLES[hunter.rank]}
                shadow-[0_0_30px_rgba(26,159,255,0.4)] overflow-hidden`}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <PenLine size={36} className="text-[#1a9fff]" />
                )}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded border-2 flex items-center
                justify-center text-sm font-black ${RANK_BG[hunter.rank]} ${RANK_STYLES[hunter.rank]}`}>
                {hunter.rank}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-black tracking-widest uppercase px-3 py-0.5 rounded border text-[#00d9ff] border-[#1a9fff]/60 bg-[#1a9fff]/10"
                  style={{ boxShadow: "0 0 12px rgba(26,159,255,0.3)" }}>
                  {ri.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700] font-mono font-bold text-2xl">LV.{hunter.level}</span>
                <span className="text-[#6b7280] text-sm">·</span>
                <span className={`font-black text-sm ${RANK_STYLES[hunter.rank].split(" ")[1]}`}>
                  Rang {hunter.rank}
                </span>
              </div>

              {/* XP Bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-[#a0b0d0] font-mono">
                  <span>EXP</span>
                  <span>{hunter.xp} / {hunter.xpToNext} ({xpPct}%)</span>
                </div>
                <div className="h-4 bg-[#050a2e] border border-[#19327f]/60 rounded-sm overflow-hidden
                  shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] relative">
                  <div
                    className="h-full rounded-sm relative overflow-hidden transition-all duration-1000"
                    style={{
                      width: `${xpPct}%`,
                      background: "linear-gradient(90deg, #1a9fff, #00d9ff)",
                      boxShadow: "0 0 15px rgba(26,159,255,0.8), 0 0 5px rgba(0,217,255,0.6)",
                    }}>
                    <div className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                        animation: "shimmer 2s infinite",
                      }} />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 font-mono tracking-widest">
                    {xpPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 text-center min-w-fit">
              {[
                { l: "Analyses", v: hunter.totalAnalyses, c: "#a78bfa" },
                { l: "Oraux", v: hunter.totalOrals, c: "#38bdf8" },
                { l: "Œuvres", v: hunter.totalOeuvres, c: "#34d399" },
                { l: "Examens", v: hunter.totalExamens, c: "#fbbf24" },
              ].map(({ l, v, c }) => (
                <div key={l} className="bg-[#050a2e]/80 border border-[#19327f]/50 rounded-lg px-3 py-2">
                  <div className="font-mono font-black text-xl" style={{ color: c }}>{v}</div>
                  <div className="text-[10px] text-[#6b7280] uppercase tracking-widest">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats + Quêtes ─────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Stats window */}
          <div className="bg-[#0a1543]/90 border border-[#19327f] rounded-xl p-5
            shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur space-y-4">
            <div className="flex items-center gap-2 border-b border-[#19327f]/40 pb-3">
              <span className="text-[#FFD700] text-xs font-black uppercase tracking-widest">
                ✦ Mes statistiques
              </span>
            </div>
            <StatBar label="ACUITÉ" value={hunter.stats.INT} color="#a78bfa" />
            <StatBar label="ÉLOQUENCE" value={hunter.stats.CHA} color="#38bdf8" />
            <StatBar label="ÉRUDITION" value={hunter.stats.WIS} color="#34d399" />
            <StatBar label="RIGUEUR" value={hunter.stats.STR} color="#f87171" />
            <StatBar label="DESTIN" value={hunter.stats.LCK} color="#fbbf24" />
          </div>

          {/* Quêtes journalières */}
          <div className="bg-[#0a1543]/90 border border-[#19327f] rounded-xl p-5
            shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur space-y-4">
            <div className="flex items-center justify-between border-b border-[#19327f]/40 pb-3">
              <span className="text-[#FFD700] text-xs font-black uppercase tracking-widest">
                ✦ Quêtes du jour
              </span>
              <span className="text-xs font-mono text-[#00d9ff]">{doneTodayCount}/4 accomplies</span>
            </div>
            <div className="space-y-3">
              {quests.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  done={q.done}
                  onClick={() => {
                    // Quest will be validated when user completes action on the page
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Rang suivant ──────────────────────────────────── */}
        <div className="bg-[#0a1543]/90 border border-[#19327f] rounded-xl p-5
          shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur">
          <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest mb-4">
            ✦ Progression des Rangs
          </p>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {RANKS.map((rankInfo) => {
              const r = rankInfo.rank;
              const allRanks = ["E","D","C","B","A","S"];
              const isCurrentOrPast = allRanks.indexOf(r) <= allRanks.indexOf(hunter.rank);
              const isCurrent = r === hunter.rank;
              return (
                <div key={r} className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[70px]">
                  <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center
                    font-black text-xl transition-all
                    ${isCurrent
                      ? `${RANK_BG[r]} ${RANK_STYLES[r]}`
                      : isCurrentOrPast
                        ? `${RANK_BG[r]} ${RANK_STYLES_PAST[r]}`
                        : "bg-[#050a2e] border-[#19327f]/30 text-[#2a3a6e]"
                    }`}>
                    {r}
                  </div>
                  <span className={`text-[9px] font-bold tracking-wider text-center leading-tight ${
                    isCurrent ? "text-[#00d9ff]" : isCurrentOrPast ? "text-[#a0b0d0]/70" : "text-[#2a3a6e]"
                  }`}>
                    {rankInfo.title.split(" ").slice(-1)[0]}
                  </span>
                  {isCurrent && <span className="text-[7px] font-bold tracking-widest text-[#FFD700] animate-pulse">ACTUEL</span>}
                </div>
              );
            })}
            <div className="ml-4 flex-1 min-w-[150px]">
              <p className="text-xs text-[#a0b0d0]">
                {hunter.rank === "S"
                  ? "Rang maximum atteint — Tu es un Génie Littéraire !"
                  : `Prochain rang dans ${hunter.xpToNext - hunter.xp} XP`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Raccourcis ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/analyse", icon: BookOpen, label: "Analyse", color: "#a78bfa", quest: "analyse" },
            { href: "/oral",    icon: Mic,      label: "Oral",    color: "#38bdf8", quest: "oral" },
            { href: "/oeuvre",  icon: Library,  label: "Œuvre",   color: "#34d399", quest: "oeuvre" },
            { href: "/examen",  icon: GraduationCap, label: "Examen", color: "#fbbf24", quest: "examen" },
          ].map(({ href, icon: Icon, label, color, quest }) => {
            const q = quests.find(q => q.id === quest);
            return (
              <Link key={href} href={href}
                className="group bg-[#0a1543]/80 border border-[#19327f]/60 rounded-xl p-5
                  hover:border-[#1a9fff]/60 transition-all duration-200 text-center
                  hover:shadow-[0_0_20px_rgba(26,159,255,0.2)] flex flex-col items-center gap-3">
                <div className="p-3 rounded-lg border border-[#19327f]/40 group-hover:border-[#1a9fff]/40 transition-colors"
                  style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className="text-sm font-bold text-[#e8e8f0] tracking-wide">{label}</span>
                {q?.done
                  ? <span className="text-[9px] text-[#00d9ff] font-bold tracking-widest">✦ FAIT</span>
                  : <span className="text-[9px] text-[#FFD700] font-bold tracking-widest">QUÊTE DISPO</span>}
              </Link>
            );
          })}
        </div>

      </div>

    </div>
  );
}
