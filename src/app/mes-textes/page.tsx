"use client";
import { useEffect, useState } from "react";
import { BookOpen, Trash2, Loader2, Plus } from "lucide-react";
import Link from "next/link";

interface UserText {
  id: string;
  titre: string;
  auteur: string;
  oeuvre: string;
  texte: string;
  axe: string;
  created_at: string;
}

export default function MesTextesPage() {
  const [texts, setTexts] = useState<UserText[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_texts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTexts(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("user_texts").delete().eq("id", id);
    setTexts(prev => prev.filter(t => t.id !== id));
    setDeleting(null);
  }

  const count = texts.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0a1543] border border-[#19327f] shadow-[0_0_15px_rgba(26,159,255,0.2)]">
            <BookOpen size={22} className="text-[#1a9fff]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Mes textes</h1>
            <p className="text-[#6b7280] text-sm">
              {count}/12 textes enregistrés — utilisés dans le mode examen
            </p>
          </div>
        </div>
        <Link href="/analyse"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a9fff]/20 border border-[#1a9fff]/30 text-[#00d9ff] text-sm font-bold hover:bg-[#1a9fff]/30 transition-all">
          <Plus size={15} />
          Ajouter un texte
        </Link>
      </div>

      {/* Jauge */}
      <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-xs text-[#a0b0d0] font-mono">
          <span>Textes enregistrés</span>
          <span className="font-bold text-[#00d9ff]">{count} / 12</span>
        </div>
        <div className="h-2 bg-[#050a2e] border border-[#19327f]/40 rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-700"
            style={{
              width: `${(count / 12) * 100}%`,
              background: count >= 12 ? "linear-gradient(90deg, #FFD700, #fbbf24)" : "linear-gradient(90deg, #1a9fff, #00d9ff)",
            }}
          />
        </div>
        {count >= 12 && (
          <p className="text-xs text-[#FFD700] font-bold">Maximum atteint — supprime un texte pour en ajouter un nouveau</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#1a9fff] animate-spin" />
        </div>
      ) : count === 0 ? (
        <div className="text-center py-20 space-y-6">
          <div className="text-6xl">📚</div>
          <div className="space-y-2">
            <p className="text-white font-black text-xl">Ta bibliothèque est vide</p>
            <p className="text-[#6b7280] text-sm max-w-sm mx-auto leading-relaxed">
              Chaque analyse linéaire que tu génères sauvegarde automatiquement le texte ici.<br />
              Ces textes seront tirés au sort le jour de ton <span className="text-[#1a9fff] font-bold">mode examen</span>.
            </p>
          </div>
          <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
            <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Comment ça marche</p>
            <p className="text-sm text-[#a0b0d0]">① Fais une analyse linéaire de ton texte</p>
            <p className="text-sm text-[#a0b0d0]">② Le texte est sauvegardé ici automatiquement</p>
            <p className="text-sm text-[#a0b0d0]">③ Le mode examen le tire au sort pour te tester</p>
          </div>
          <Link href="/analyse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a9fff] text-[#050a2e] font-black text-sm uppercase tracking-widest hover:bg-[#00d9ff] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
            <Plus size={15} />
            Analyser mon premier texte
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {texts.map((t, i) => (
            <div key={t.id}
              className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 flex items-start gap-4 hover:border-[#1a9fff]/30 transition-all group">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#050a2e] border border-[#19327f]/60 flex items-center justify-center">
                <span className="text-xs font-black text-[#1a9fff] font-mono">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm">{t.titre || "Extrait sans titre"}</span>
                  {t.oeuvre && (
                    <span className="text-xs text-[#6b7280]">— {t.oeuvre}</span>
                  )}
                  {t.auteur && (
                    <span className="text-xs text-[#1a9fff]">{t.auteur}</span>
                  )}
                </div>
                {t.axe && (
                  <p className="text-xs text-[#a0b0d0] italic truncate">{t.axe}</p>
                )}
                <p className="text-xs text-[#2a3a6e] font-mono truncate">{t.texte.slice(0, 100)}...</p>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deleting === t.id}
                className="flex-shrink-0 p-2 rounded-lg text-[#2a3a6e] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                {deleting === t.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
