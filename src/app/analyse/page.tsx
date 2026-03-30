"use client";
import { useState, useEffect } from "react";
import { BookOpen, Loader2, ChevronDown, ChevronUp, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { addXP } from "@/lib/gamification";

interface Procede {
  procede: string;
  exemple: string;
  effet: string;
}
interface Mouvement {
  numero: number;
  titre: string;
  lignes: string;
  procedes: Procede[];
}
interface Analyse {
  problematique: string;
  introduction: string;
  mouvements: Mouvement[];
  conclusion: string;
  ouverture: string;
}

export default function AnalysePage() {
  const [form, setForm] = useState({ texte: "", titre: "", auteur: "", oeuvre: "", axe: "" });
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openMvt, setOpenMvt] = useState<number | null>(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalyse(null);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setAnalyse(data.analyse);
      setOpenMvt(0);
      const { leveledUp } = await addXP("analyse", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
      // Sauvegarde auto du texte
      if (userId) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { count } = await supabase.from("user_texts").select("*", { count: "exact", head: true }).eq("user_id", userId);
        if ((count ?? 0) < 12) {
          await supabase.from("user_texts").insert({ user_id: userId, titre: form.titre, auteur: form.auteur, oeuvre: form.oeuvre, texte: form.texte, axe: form.axe });
        }
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analyse linéaire</h1>
            <p className="text-[#9ca3af] text-sm">Génère une analyse complète prête pour l&apos;oral du Bac</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#12121a] rounded-2xl border border-[#1e1e2e] p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Auteur</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="ex: Molière"
              value={form.auteur}
              onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Œuvre</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="ex: Dom Juan"
              value={form.oeuvre}
              onChange={e => setForm(f => ({ ...f, oeuvre: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Titre de l&apos;extrait</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="ex: Scène 2, Acte I"
              value={form.titre}
              onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#9ca3af]">Axe de lecture / Problématique (optionnel)</label>
          <input
            className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="ex: Comment Molière fait-il de Dom Juan un personnage séduisant mais dangereux ?"
            value={form.axe}
            onChange={e => setForm(f => ({ ...f, axe: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#9ca3af]">Texte à analyser <span className="text-red-400">*</span></label>
          <textarea
            className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none font-mono leading-relaxed"
            rows={10}
            placeholder="Colle ton texte ici..."
            value={form.texte}
            onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !form.texte.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Analyse en cours..." : "Générer l'analyse"}
        </button>
      </form>

      {/* Result */}
      {analyse && (
        <div className="space-y-5 fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00d9ff] bg-[#0a1543]/80 border border-[#1a9fff]/30 rounded-xl px-4 py-2 w-fit">
            <Zap size={14} className="text-[#FFD700]" />
            +150 XP · +10 INT — Quête accomplie !
          </div>
          {/* Problématique */}
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Problématique</p>
            <p className="text-[#e8e8f0] font-medium text-lg italic">&ldquo;{analyse.problematique}&rdquo;</p>
          </div>

          {/* Introduction */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Introduction</p>
            <p className="text-[#c9c9d4] leading-relaxed text-sm">{analyse.introduction}</p>
          </div>

          {/* Mouvements */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Mouvements du texte</p>
            {analyse.mouvements.map((mvt, i) => (
              <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenMvt(openMvt === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[#1a1a27] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                      {mvt.numero}
                    </span>
                    <div>
                      <p className="font-semibold text-[#e8e8f0]">{mvt.titre}</p>
                      <p className="text-xs text-[#6b7280]">{mvt.lignes}</p>
                    </div>
                  </div>
                  {openMvt === i ? <ChevronUp size={16} className="text-[#6b7280]" /> : <ChevronDown size={16} className="text-[#6b7280]" />}
                </button>
                {openMvt === i && (
                  <div className="px-5 pb-5 space-y-3 border-t border-[#1e1e2e]">
                    {mvt.procedes.map((p, j) => (
                      <div key={j} className="grid md:grid-cols-3 gap-3 pt-3">
                        <div className="bg-[#0a0a0f] rounded-xl p-3">
                          <p className="text-xs font-semibold text-violet-400 mb-1">Procédé</p>
                          <p className="text-sm text-[#e8e8f0] font-medium">{p.procede}</p>
                        </div>
                        <div className="bg-[#0a0a0f] rounded-xl p-3">
                          <p className="text-xs font-semibold text-amber-400 mb-1">Citation</p>
                          <p className="text-sm text-[#e8e8f0] italic">&ldquo;{p.exemple}&rdquo;</p>
                        </div>
                        <div className="bg-[#0a0a0f] rounded-xl p-3">
                          <p className="text-xs font-semibold text-emerald-400 mb-1">Effet</p>
                          <p className="text-sm text-[#c9c9d4]">{p.effet}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion + Ouverture */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Conclusion</p>
              <p className="text-[#c9c9d4] leading-relaxed text-sm">{analyse.conclusion}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Ouverture</p>
              <p className="text-[#c9c9d4] leading-relaxed text-sm">{analyse.ouverture}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
