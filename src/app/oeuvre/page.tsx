"use client";
import { useState, useRef, useEffect } from "react";
import { Library, Loader2, Send, Bot, User, Sparkles, Search, X, CheckCircle, MessageCircle } from "lucide-react";
import { addXP } from "@/lib/gamification";
import Paywall from "@/components/Paywall";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const OEUVRES_PROGRAMME = [
  { titre: "Les Fleurs du mal", auteur: "Charles Baudelaire", parcours: "Alchimie poétique : la boue et l'or" },
  { titre: "Les Contemplations", auteur: "Victor Hugo", parcours: "Les Mémoires d'une âme" },
  { titre: "Alcools", auteur: "Guillaume Apollinaire", parcours: "Modernité poétique ?" },
  { titre: "Mes forêts", auteur: "Hélène Dorion", parcours: "La poésie, la nature, l'intime" },
  { titre: "La Rage de l'expression", auteur: "Francis Ponge", parcours: "Dans l'atelier du poète" },
  { titre: "Cahier d'un retour au pays natal", auteur: "Aimé Césaire", parcours: "La poésie, la nature, l'intime" },
  { titre: "Les Caractères", auteur: "Jean de La Bruyère", parcours: "La comédie sociale" },
  { titre: "Déclaration des droits de la femme et de la citoyenne", auteur: "Olympe de Gouges", parcours: "Écrire et combattre pour l'égalité" },
  { titre: "Manon Lescaut", auteur: "Abbé Prévost", parcours: "Personnages en marge, plaisirs du romanesque" },
  { titre: "La Peau de chagrin", auteur: "Honoré de Balzac", parcours: "Les romans de l'énergie : création et destruction" },
  { titre: "Sido suivi de Les Vrilles de la vigne", auteur: "Colette", parcours: "La célébration du monde" },
  { titre: "Mémoires d'Hadrien", auteur: "Marguerite Yourcenar", parcours: "Soi-même comme un autre" },
  { titre: "Le Malade imaginaire", auteur: "Molière", parcours: "Spectacle et comédie" },
  { titre: "Les Fausses Confidences", auteur: "Marivaux", parcours: "Théâtre et stratagème" },
  { titre: "Le Barbier de Séville", auteur: "Beaumarchais", parcours: "Théâtre et stratagème" },
  { titre: "Oh les beaux jours", auteur: "Samuel Beckett", parcours: "Un théâtre de la condition humaine" },
  { titre: "Juste la fin du monde", auteur: "Jean-Luc Lagarce", parcours: "Crise personnelle, crise familiale" },
  { titre: "Gargantua", auteur: "François Rabelais", parcours: "Rire et savoir" },
  { titre: "Essais (Des Cannibales / Des Coches)", auteur: "Michel de Montaigne", parcours: "Notre monde vient d'en trouver un autre" },
  { titre: "Lettres persanes", auteur: "Montesquieu", parcours: "Le regard éloigné" },
  { titre: "Le Rouge et le Noir", auteur: "Stendhal", parcours: "Le personnage de roman, esthétiques et valeurs" },
  { titre: "Madame Bovary", auteur: "Gustave Flaubert", parcours: "Le personnage de roman, esthétiques et valeurs" },
  { titre: "Les Misérables", auteur: "Victor Hugo", parcours: "Le personnage de roman, esthétiques et valeurs" },
  { titre: "Le Mariage de Figaro", auteur: "Beaumarchais", parcours: "La comédie du valet" },
  { titre: "On ne badine pas avec l'amour", auteur: "Alfred de Musset", parcours: "Les jeux du cœur et de la parole" },
  { titre: "Phèdre", auteur: "Jean Racine", parcours: "Passion et tragédie" },
  { titre: "Hernani", auteur: "Victor Hugo", parcours: "La bataille d'Hernani" },
  { titre: "Candide", auteur: "Voltaire", parcours: "Le conte philosophique" },
  { titre: "L'Ingénu", auteur: "Voltaire", parcours: "Le conte philosophique" },
  { titre: "Les Châtiments", auteur: "Victor Hugo", parcours: "La poésie engagée" },
];

const SUGGESTIONS = [
  "Quels sont les thèmes principaux de cette œuvre ?",
  "Donne-moi 5 questions d'entretien avec les réponses attendues",
  "Explique-moi les personnages principaux",
  "Quel est le mouvement littéraire et le contexte historique ?",
  "Quels extraits mémoriser en priorité pour l'oral ?",
];

const AIDE_SUGGESTIONS = [
  "Je ne sais pas du tout quoi choisir, aide-moi",
  "Quelle œuvre est la plus facile à présenter ?",
  "J'aime le théâtre, que me conseilles-tu ?",
  "Quelle œuvre a le plus de chances de tomber ?",
];

export default function OeuvrePage() {
  // Oeuvre selection
  const [oeuvre, setOeuvre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // AI helper chat
  const [aideMessages, setAideMessages] = useState<Message[]>([]);
  const [aideInput, setAideInput] = useState("");
  const [aideLoading, setAideLoading] = useState(false);
  const [showAide, setShowAide] = useState(false);
  // Main chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const aideBottomRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [limitReached, setLimitReached] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const canConfirm = oeuvre.trim().length >= 3 && auteur.trim().length >= 2;

  const filteredOeuvres = searchQuery.trim()
    ? OEUVRES_PROGRAMME.filter(o =>
        o.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.auteur.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : OEUVRES_PROGRAMME.slice(0, 8);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    aideBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aideMessages]);

  useEffect(() => {
    async function loadSavedOeuvre() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsPremium(false); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("oeuvre_choisie, auteur_choisi, is_premium").eq("id", user.id).single();
      setIsPremium(data?.is_premium === true);
      if (data?.oeuvre_choisie && data?.auteur_choisi) {
        setOeuvre(data.oeuvre_choisie);
        setAuteur(data.auteur_choisi);
        setConfirmed(true);
      }
    }
    loadSavedOeuvre();
  }, []);

  async function sendAideMessage(question: string) {
    if (!question.trim() || aideLoading) return;
    const userMsg: Message = { role: "user", content: question };
    setAideMessages(prev => [...prev, userMsg]);
    setAideInput("");
    setAideLoading(true);
    try {
      const res = await fetch("/api/oeuvre-aide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          contexte: aideMessages.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n"),
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setAideMessages(prev => [...prev, { role: "assistant", content: data.reponse }]);
      }
    } catch { /* ignore */ }
    finally { setAideLoading(false); }
  }

  async function sendMessage(question: string) {
    if (!question.trim() || !confirmed) return;
    const userMsg: Message = { role: "user", content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/oeuvre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          oeuvre,
          auteur,
          contexte: messages.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n"),
        }),
      });
      const data = await res.json();
      if (data.error === "LIMIT_REACHED") { setLimitReached(true); return; }
      if (data.error) { setError(data.error); return; }
      setMessages(prev => [...prev, { role: "assistant", content: data.reponse }]);
      await addXP("oeuvre", userId);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setConfirmed(true);
    setShowAide(false);
    if (userId) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("profiles").update({
        oeuvre_choisie: oeuvre.trim(),
        auteur_choisi: auteur.trim(),
      }).eq("id", userId);
    }
  }

  async function handleReset() {
    if (userId) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("profiles").update({ oeuvre_choisie: null, auteur_choisi: null }).eq("id", userId);
    }
    setOeuvre("");
    setAuteur("");
    setConfirmed(false);
    setMessages([]);
    setShowAide(false);
    setAideMessages([]);
  }

  if (isPremium === null) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-[#9ca3af]" /></div>;
  if (!isPremium) return (
    <div className="max-w-xl mx-auto px-4 py-20 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Œuvre personnelle</h1>
      <p className="text-[#9ca3af] text-sm mb-6">Cette fonctionnalité est réservée aux membres Premium.</p>
      <Paywall title="Fonctionnalité Premium" description="L'accompagnement œuvre est réservé aux membres Premium. Passe Premium pour accéder aux analyses, questions d'entretien et aide IA." />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25">
          <Library size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Œuvre personnelle</h1>
          <p className="text-[#9ca3af] text-sm">Pose toutes tes questions sur ton œuvre au programme</p>
        </div>
      </div>

      {/* Œuvre config */}
      <div className="flex-shrink-0 bg-[#12121a] rounded-2xl border border-[#1e1e2e] p-4 space-y-3">
        {!confirmed ? (
          <div className="space-y-4">
            {/* Search dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="text-sm font-medium text-emerald-400 mb-2 block">Choisis ton œuvre au programme</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                <input
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Recherche une œuvre ou un auteur..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              {showDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-[#12121a] border border-[#2a2a3e] rounded-xl shadow-xl max-h-[280px] overflow-y-auto">
                  {filteredOeuvres.map((o, i) => (
                    <button key={i} onClick={() => { setOeuvre(o.titre); setAuteur(o.auteur); setSearchQuery(""); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 transition-colors border-b border-[#1e1e2e] last:border-0">
                      <p className="text-sm text-white font-medium">{o.titre}</p>
                      <p className="text-xs text-[#9ca3af]">{o.auteur} · <span className="text-emerald-400/70">{o.parcours}</span></p>
                    </button>
                  ))}
                  {filteredOeuvres.length === 0 && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-[#6b7280]">Aucun résultat — saisis manuellement ci-dessous</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Manual inputs */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#9ca3af]">Titre de l&apos;œuvre</label>
                <input className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="ex: Les Fleurs du mal" value={oeuvre} onChange={e => setOeuvre(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && canConfirm) handleConfirm(); }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#9ca3af]">Auteur</label>
                <input className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="ex: Charles Baudelaire" value={auteur} onChange={e => setAuteur(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && canConfirm) handleConfirm(); }} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleConfirm} disabled={!canConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all">
                <CheckCircle size={16} /> Valider cette œuvre
              </button>
              <button onClick={() => setShowAide(!showAide)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  showAide
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "bg-[#0a0a0f] border-[#2a2a3e] text-[#9ca3af] hover:border-amber-500/40 hover:text-amber-400"
                }`}>
                <MessageCircle size={16} /> {showAide ? "Fermer l'aide" : "L'IA m'aide à choisir"}
              </button>
            </div>

            {!canConfirm && (oeuvre.trim() || auteur.trim()) && (
              <p className="text-xs text-[#6b7280]">Renseigne le titre complet et l&apos;auteur pour valider</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-400" />
              <div>
                <p className="text-white font-bold">{oeuvre}</p>
                <p className="text-sm text-[#9ca3af]">{auteur}</p>
              </div>
            </div>
            <button onClick={handleReset}
              className="p-2 rounded-lg hover:bg-[#2a2a3e] transition-colors text-[#6b7280] hover:text-white">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* AI Aide Chat (before confirmation) */}
      {showAide && !confirmed && (
        <div className="flex-shrink-0 bg-[#0a0a0f] rounded-2xl border border-amber-500/20 overflow-hidden" style={{ maxHeight: "350px" }}>
          <div className="px-4 py-2.5 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-2">
            <Bot size={14} className="text-amber-400" />
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Conseiller IA — Aide au choix</p>
          </div>
          <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "220px" }}>
            {aideMessages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#6b7280]">Dis-moi ce que tu aimes, je te conseille une œuvre :</p>
                <div className="flex flex-wrap gap-2">
                  {AIDE_SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendAideMessage(s)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 hover:bg-amber-500/20 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {aideMessages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  msg.role === "user" ? "bg-amber-600" : "bg-[#1e1e2e]"
                }`}>
                  {msg.role === "user" ? <User size={10} className="text-white" /> : <Bot size={10} className="text-amber-400" />}
                </div>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-amber-600 text-white"
                    : "bg-[#12121a] border border-[#1e1e2e] text-[#c9c9d4]"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {aideLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1e1e2e] flex items-center justify-center">
                  <Bot size={10} className="text-amber-400" />
                </div>
                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl px-3 py-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={aideBottomRef} />
          </div>
          <div className="p-3 border-t border-amber-500/20">
            <div className="flex gap-2">
              <input className="flex-1 bg-[#12121a] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Demande conseil à l'IA..."
                value={aideInput} onChange={e => setAideInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendAideMessage(aideInput); } }} />
              <button onClick={() => sendAideMessage(aideInput)} disabled={aideLoading || !aideInput.trim()}
                className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {!confirmed && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <Library size={40} className="text-[#2a2a3e]" />
            <p className="text-[#6b7280] text-sm">Sélectionne et valide ton œuvre pour commencer</p>
            <p className="text-[#4a4a5e] text-xs">Tu peux demander conseil à l&apos;IA si tu hésites</p>
          </div>
        )}
        {confirmed && messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-center text-[#6b7280] text-sm py-4">
              Pose ta première question sur <span className="text-emerald-400 font-medium">{oeuvre}</span>
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-sm text-[#9ca3af] hover:text-[#e8e8f0]"
                >
                  <Sparkles size={12} className="inline mr-2 text-emerald-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === "user"
                ? "bg-emerald-600"
                : "bg-[#1e1e2e] border border-[#2a2a3e]"
            }`}>
              {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-emerald-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-emerald-600 text-white rounded-tr-sm"
                : "bg-[#12121a] border border-[#1e1e2e] text-[#c9c9d4] rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e1e2e] border border-[#2a2a3e] flex items-center justify-center">
              <Bot size={14} className="text-emerald-400" />
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        {limitReached && <div className="mb-3"><Paywall /></div>}
        {error && !limitReached && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex gap-3">
          <input
            className="flex-1 bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder={confirmed ? "Pose ta question sur l'œuvre..." : "Valide d'abord ton œuvre ci-dessus"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && confirmed) { e.preventDefault(); sendMessage(input); } }}
            disabled={!confirmed}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim() || !confirmed}
            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
