"use client";
import { useEffect, useState } from "react";
import { BookOpen, Trash2, Loader2, Plus, BarChart2, ChevronDown, ChevronUp, Library, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EXAMPLE_ANALYSE = {
  id: "__example__",
  titre: "Le Dormeur du Val",
  auteur: "Arthur Rimbaud",
  oeuvre: "Poésies (1870)",
  axe: "Comment Rimbaud utilise-t-il l'harmonie trompeuse du cadre naturel pour dénoncer les horreurs de la guerre ?",
  savedAt: "",
  analyse: {
    problematique: "Comment Rimbaud utilise-t-il l'harmonie trompeuse du cadre naturel pour dénoncer les horreurs de la guerre ?",
    introduction: "Arthur Rimbaud écrit ce sonnet en 1870, à l'âge de 16 ans, en pleine guerre franco-prussienne. Le poème se présente d'abord comme un tableau bucolique avant de basculer brutalement dans l'horreur de la mort.",
    mouvements: [
      {
        numero: 1,
        titre: "Un tableau idyllique de la nature",
        lignes: "v. 1–4",
        procedes: [
          { procede: "Personnification", exemple: "où chante une rivière", effet: "La nature est dotée d'une voix — cette animation crée une atmosphère de paix qui sera cruellement démentie." },
          { procede: "Métaphore filée", exemple: "un trou de verdure", effet: "L'image du 'trou' est ambiguë : cocon protecteur ou fosse ? Ce mot anticipe inconsciemment la mort." },
          { procede: "Harmonie imitative", exemple: "chante une rivière / mousse de rayons", effet: "Les sonorités douces créent une musicalité apaisante qui endort la méfiance du lecteur." },
          { procede: "Accumulation sensorielle", exemple: "mousse de rayons / haillons d'argent", effet: "L'accumulation d'éléments lumineux et sonores sature l'espace de beauté, instaurant une douceur trompeuse." },
          { procede: "Hyperbole", exemple: "le soleil, de la montagne fière, / Luit", effet: "Le soleil 'fier' brille sur un mort — l'ironie souligne par contraste le froid du soldat." },
        ],
      },
      {
        numero: 2,
        titre: "Le portrait ambigu du soldat endormi",
        lignes: "v. 5–11",
        procedes: [
          { procede: "Euphémisme / litote", exemple: "Dort ; il est étendu dans l'herbe", effet: "Le verbe 'dort', répété, euphémise 'est mort'. Il retarde la révélation et maintient l'illusion." },
          { procede: "Apostrophe à la nature", exemple: "Nature, berce-le chaudement : il a froid", effet: "'Il a froid' est un indice implacable : on ne dit pas d'un dormant qu'il a froid." },
          { procede: "Oxymore", exemple: "Pâle dans son lit vert", effet: "Le lit est à la fois tombe et berceau. La pâleur du visage tranche avec la vivacité du cadre." },
          { procede: "Comparaison pathétique", exemple: "Souriant comme sourirait un enfant malade", effet: "Le rapprochement soldat/enfant dénonce l'absurdité de mourir si jeune à la guerre." },
          { procede: "Enjambement", exemple: "Souriant comme / Sourirait un enfant", effet: "La coupe crée une suspension du sens — comme si Rimbaud hésitait à prononcer ce qu'il voit." },
        ],
      },
      {
        numero: 3,
        titre: "La révélation brutale de la mort",
        lignes: "v. 12–14",
        procedes: [
          { procede: "Rupture de ton (chute)", exemple: "Il a deux trous rouges au côté droit", effet: "Le vocabulaire clinique tranche avec la douceur poétique. La mort est crue, réaliste, militaire." },
          { procede: "Ironie dramatique", exemple: "Tranquille. Il a deux trous rouges", effet: "'Tranquille' place juste avant la révélation crée une ironie mordante : c'est la tranquillité de la mort." },
          { procede: "Zeugme", exemple: "la main sur sa poitrine, / Tranquille.", effet: "Le point final isolé mime l'arrêt brutal de la vie." },
          { procede: "Négation restrictive", exemple: "Les parfums ne font pas frissonner sa narine", effet: "La tournure négative dit ce que le corps ne fait plus — preuve de mort avec une froideur clinique." },
          { procede: "Antithèse lumière / froid", exemple: "Il dort dans le soleil […] il a froid", effet: "Le paradoxe final est absolu : la nature indifférente éclaire un cadavre sans le réchauffer." },
        ],
      },
    ],
    conclusion: "Rimbaud construit un véritable piège poétique : le lecteur est bercé par onze vers d'une nature paradisiaque puis frappé de plein fouet par la réalité de la guerre. La beauté du cadre n'est pas une consolation, c'est une accusation.",
    ouverture: "Ce sonnet est un réquisitoire contre la guerre franco-prussienne de 1870. En choisissant un soldat inconnu, Rimbaud universalise la tragédie — le 'dormeur du val' pourrait être n'importe quel jeune homme sacrifié.",
  },
};

interface UserText {
  id: string;
  titre: string;
  auteur: string;
  oeuvre: string;
  texte: string;
  axe: string;
  created_at: string;
}

interface Procede { procede: string; exemple: string; effet: string; }
interface Mouvement { numero: number; titre: string; lignes: string; procedes: Procede[]; }
interface OeuvreQuestion {
  id: string;
  oeuvre: string;
  auteur: string;
  question: string;
  reponse: string;
  savedAt: string;
}

interface SavedAnalyse {
  id: string;
  titre: string;
  auteur: string;
  oeuvre: string;
  axe: string;
  savedAt: string;
  analyse: { problematique: string; introduction: string; mouvements: Mouvement[]; conclusion: string; ouverture: string; };
}

type Tab = "textes" | "analyses" | "questions";

export default function MesTextesPage() {
  const router = useRouter();
  const [texts, setTexts] = useState<UserText[]>([]);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalyse[]>([]);
  const [oeuvreQuestions, setOeuvreQuestions] = useState<OeuvreQuestion[]>([]);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("textes");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [maxTexts, setMaxTexts] = useState(16);
  const [filiere, setFiliere] = useState<"general" | "stmg">("general");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setAuthed(true);
      const [{ data }, { data: profile }] = await Promise.all([
        supabase.from("user_texts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("filiere").eq("id", user.id).single(),
      ]);
      setTexts(data ?? []);
      const f = profile?.filiere === "stmg" ? "stmg" : "general";
      setFiliere(f);
      setMaxTexts(f === "stmg" ? 12 : 16);
      try {
        const stored = JSON.parse(localStorage.getItem("saved_analyses") || "[]");
        setSavedAnalyses(stored);
      } catch {}
      try {
        const stored = JSON.parse(localStorage.getItem("oeuvre_questions") || "[]");
        setOeuvreQuestions(stored);
      } catch {}
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

  function deleteAnalyse(id: string) {
    const updated = savedAnalyses.filter(a => a.id !== id);
    setSavedAnalyses(updated);
    try { localStorage.setItem("saved_analyses", JSON.stringify(updated)); } catch {}
  }

  function deleteQuestion(id: string) {
    const updated = oeuvreQuestions.filter(q => q.id !== id);
    setOeuvreQuestions(updated);
    try { localStorage.setItem("oeuvre_questions", JSON.stringify(updated)); } catch {}
  }

  const count = texts.length;

  if (!authed) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 size={28} className="text-[#1a9fff] animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0a1543] border border-[#19327f] shadow-[0_0_15px_rgba(26,159,255,0.2)]">
            <BookOpen size={22} className="text-[#1a9fff]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Données sauvegardées</h1>
            <p className="text-[#6b7280] text-sm">
              {count}/{maxTexts} textes enregistrés — utilisés dans le mode examen
            </p>
          </div>
        </div>
        <Link href="/analyse"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a9fff]/20 border border-[#1a9fff]/30 text-[#00d9ff] text-sm font-bold hover:bg-[#1a9fff]/30 transition-all">
          <Plus size={15} />
          Ajouter un texte
        </Link>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#050a2e] border border-[#19327f]/60 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("textes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "textes"
              ? "bg-[#0a1543] border border-[#19327f] text-[#00d9ff] shadow-[0_0_10px_rgba(26,159,255,0.2)]"
              : "text-[#6b7280] hover:text-[#a0b0d0]"
          }`}>
          <BookOpen size={14} />
          Mes textes
        </button>
        <button
          onClick={() => setActiveTab("analyses")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "analyses"
              ? "bg-[#0a1543] border border-[#19327f] text-[#00d9ff] shadow-[0_0_10px_rgba(26,159,255,0.2)]"
              : "text-[#6b7280] hover:text-[#a0b0d0]"
          }`}>
          <BarChart2 size={14} />
          Mes analyses
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "questions"
              ? "bg-[#0a1543] border border-[#19327f] text-[#00d9ff] shadow-[0_0_10px_rgba(26,159,255,0.2)]"
              : "text-[#6b7280] hover:text-[#a0b0d0]"
          }`}>
          <Library size={14} />
          Œuvre
        </button>
      </div>

      {/* Jauge */}
      <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-xs text-[#a0b0d0] font-mono">
          <span>Textes enregistrés</span>
          <span className="font-bold text-[#00d9ff]">{count} / {maxTexts}</span>
        </div>
        <div className="h-2 bg-[#050a2e] border border-[#19327f]/40 rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-700"
            style={{
              width: `${(count / maxTexts) * 100}%`,
              background: count >= maxTexts ? "linear-gradient(90deg, #FFD700, #fbbf24)" : "linear-gradient(90deg, #1a9fff, #00d9ff)",
            }}
          />
        </div>
        {count >= maxTexts && (
          <p className="text-xs text-[#FFD700] font-bold">Maximum atteint — supprime un texte pour en ajouter un nouveau</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#1a9fff] animate-spin" />
        </div>
      ) : activeTab === "textes" ? (
        /* ── Mes textes tab ── */
        count === 0 ? (
          <div className="text-center py-16 space-y-5">
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
        )
      ) : activeTab === "analyses" ? (
        /* ── Mes analyses tab ── */
        <div className="space-y-3">
          {/* Carte exemple — toujours présente, ne compte pas dans le quota */}
          {(() => {
            const a = EXAMPLE_ANALYSE;
            const isOpen = expandedId === a.id;
            return (
              <div className="border-2 border-violet-500/40 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/5 to-[#0c0c18] group">
                <button
                  onClick={() => setExpandedId(isOpen ? null : a.id)}
                  className="w-full flex items-center gap-4 p-5 text-left">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
                    <Sparkles size={14} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{a.titre}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa]">{a.oeuvre}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 uppercase tracking-widest">Exemple</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <span>{a.auteur}</span>
                      <span className="italic truncate max-w-xs">{a.axe}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-violet-400/60 font-mono">Ne compte pas</span>
                    {isOpen ? <ChevronUp size={16} className="text-[#a78bfa]" /> : <ChevronDown size={16} className="text-[#6b7280]" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-violet-500/20 p-5 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">Problématique</p>
                      <p className="text-sm text-[#e2e8f0] italic">{a.analyse.problematique}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-[#00d9ff] uppercase tracking-widest">Mouvements</p>
                      {a.analyse.mouvements.map((m) => (
                        <div key={m.numero} className="bg-[#050a2e] border border-[#19327f]/40 rounded-xl p-3 space-y-1">
                          <p className="text-xs font-bold text-white">Mvt {m.numero} — {m.titre} <span className="text-[#6b7280] font-normal">({m.lignes})</span></p>
                          {m.procedes.map((p, j) => (
                            <p key={j} className="text-xs text-[#a0b0d0]">
                              <span className="text-[#a78bfa] font-bold">{p.procede}</span>
                              {p.exemple && <span className="text-[#6b7280]"> — « {p.exemple} »</span>}
                              {p.effet && <span className="text-[#9ca3af]"> → {p.effet}</span>}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-[#a78bfa] uppercase tracking-widest">Conclusion</p>
                      <p className="text-sm text-[#a0b0d0]">{a.analyse.conclusion}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Analyses réelles de l'utilisateur */}
          {savedAnalyses.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-[#0a1543]/40 border border-[#19327f]/40 rounded-2xl">
              <p className="text-[#6b7280] text-sm">Tes analyses générées apparaîtront ici automatiquement.</p>
              <Link href="/analyse" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a78bfa] text-[#050a2e] font-black text-sm uppercase tracking-widest hover:bg-[#c4b5fd] transition-all">
                <Plus size={14} /> Faire une analyse
              </Link>
            </div>
          ) : (
            savedAnalyses.map((a, i) => {
              const isOpen = expandedId === a.id;
              return (
                <div key={a.id} className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl overflow-hidden hover:border-[#a78bfa]/30 transition-all group">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : a.id)}
                    className="w-full flex items-center gap-4 p-5 text-left">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#050a2e] border border-[#19327f]/60 flex items-center justify-center">
                      <span className="text-xs font-black text-[#a78bfa] font-mono">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm">{a.titre || "Extrait sans titre"}</span>
                        {a.oeuvre && <span className="text-xs px-2 py-0.5 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa]">{a.oeuvre}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                        {a.auteur && <span>{a.auteur}</span>}
                        {a.axe && <span className="italic truncate max-w-xs">{a.axe}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-[#2a3a6e]">{new Date(a.savedAt).toLocaleDateString("fr-FR")}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteAnalyse(a.id); }}
                        className="p-1.5 rounded-lg text-[#2a3a6e] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                      {isOpen ? <ChevronUp size={16} className="text-[#a78bfa]" /> : <ChevronDown size={16} className="text-[#6b7280]" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#19327f]/60 p-5 space-y-4">
                      {a.analyse.problematique && (
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">Problématique</p>
                          <p className="text-sm text-[#e2e8f0] italic">{a.analyse.problematique}</p>
                        </div>
                      )}
                      {a.analyse.mouvements?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-[#00d9ff] uppercase tracking-widest">Mouvements</p>
                          {a.analyse.mouvements.map((m) => (
                            <div key={m.numero} className="bg-[#050a2e] border border-[#19327f]/40 rounded-xl p-3 space-y-1">
                              <p className="text-xs font-bold text-white">Mvt {m.numero} — {m.titre} <span className="text-[#6b7280] font-normal">(l. {m.lignes})</span></p>
                              {m.procedes.map((p, j) => (
                                <p key={j} className="text-xs text-[#a0b0d0]">
                                  <span className="text-[#a78bfa] font-bold">{p.procede}</span>
                                  {p.exemple && <span className="text-[#6b7280]"> — « {p.exemple} »</span>}
                                  {p.effet && <span className="text-[#9ca3af]"> → {p.effet}</span>}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {a.analyse.conclusion && (
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#a78bfa] uppercase tracking-widest">Conclusion</p>
                          <p className="text-sm text-[#a0b0d0]">{a.analyse.conclusion}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : activeTab === "questions" ? (
        /* ── Mes questions oeuvre tab ── */
        oeuvreQuestions.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">📖</div>
            <p className="text-white font-black text-xl">Aucune question sauvegardée</p>
            <p className="text-[#6b7280] text-sm max-w-sm mx-auto">Dans l&apos;onglet Œuvre, clique sur &quot;Sauvegarder&quot; sous une réponse de l&apos;IA pour la retrouver ici.</p>
            <Link href="/oeuvre" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all">
              <Library size={15} /> Aller à l&apos;œuvre
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {oeuvreQuestions.map((q, i) => (
              <div key={q.id} className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group">
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">#{i + 1}</span>
                        <span className="text-white font-bold text-sm">{q.oeuvre}</span>
                        {q.auteur && <span className="text-xs text-[#6b7280]">— {q.auteur}</span>}
                      </div>
                      {q.question && (
                        <p className="text-xs text-[#a0b0d0] italic">&quot;{q.question}&quot;</p>
                      )}
                      <p className="text-xs text-[#2a3a6e] font-mono">{new Date(q.savedAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <button onClick={() => deleteQuestion(q.id)}
                      className="flex-shrink-0 p-2 rounded-lg text-[#2a3a6e] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="bg-[#050a2e] border border-[#19327f]/40 rounded-xl p-3">
                    <p className="text-sm text-[#c9c9d4] leading-relaxed whitespace-pre-wrap">{q.reponse}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
