"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2, RotateCcw, ChevronRight, AlertTriangle, Clock, Shield, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { addXP } from "@/lib/gamification";

interface Critere { nom: string; note: number; sur: number; commentaire: string; }
interface Resultat {
  note_finale: number; mention: string; bilan: string; encouragement: string;
  criteres: Critere[]; points_essentiels_manquants: string[]; reussites: string[];
}
interface UserText { id: string; titre: string; auteur: string; oeuvre: string; texte: string; axe: string; }

type Step = "briefing" | "preparation" | "enregistrement" | "grammaire" | "soumission" | "resultat";

const GUILT_MESSAGES = [
  "Le jury attend. Chaque seconde compte.",
  "Tu ne peux pas te permettre d'abandonner maintenant.",
  "Les autres candidats eux, continuent.",
  "C'est ici que se joue ton avenir.",
  "Abandonne maintenant et tu regretteras le jour du vrai bac.",
];

const PRESSURE_COLORS = (seconds: number) => {
  if (seconds > 480) return { text: "text-red-400", glow: "shadow-[0_0_30px_rgba(239,68,68,0.5)]", border: "border-red-500/60" };
  if (seconds > 240) return { text: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]", border: "border-amber-500/40" };
  return { text: "text-emerald-400", glow: "", border: "border-emerald-500/30" };
};

export default function ExamenPage() {
  const [step, setStep] = useState<Step>("briefing");
  const [texts, setTexts] = useState<UserText[]>([]);
  const [grammarQuestions, setGrammarQuestions] = useState<string[]>([]);
  const [selectedText, setSelectedText] = useState<UserText | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  const [typeEpreuve, setTypeEpreuve] = useState("Explication de texte linéaire");
  const [transcription, setTranscription] = useState("");
  const [grammarAnswer, setGrammarAnswer] = useState("");
  const [liveText, setLiveText] = useState("");
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const [guiltIdx, setGuiltIdx] = useState(0);
  const [showQuit, setShowQuit] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const guiltRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function loadData() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const [{ data: textsData }, { data: profileData }] = await Promise.all([
        supabase.from("user_texts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("grammar_questions").eq("id", user.id).single(),
      ]);
      setTexts(textsData ?? []);
      setGrammarQuestions(profileData?.grammar_questions ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.lang = "fr-FR"; r.continuous = true; r.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let final = ""; let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setTranscription(final); setLiveText(interim);
    };
    r.onend = () => setRecording(false);
    recognitionRef.current = r;
    return () => { if (timerRef.current) clearInterval(timerRef.current); if (guiltRef.current) clearInterval(guiltRef.current); };
  }, []);

  function tirageSortAndStart() {
    const text = texts[Math.floor(Math.random() * texts.length)];
    const gq = grammarQuestions.length > 0 ? grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)] : null;
    setSelectedText(text);
    setSelectedGrammar(gq);
    setStep("preparation");
  }

  function startRecording() {
    if (!recognitionRef.current) return;
    setTranscription(""); setLiveText(""); setTimer(0);
    recognitionRef.current.start();
    setRecording(true);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    guiltRef.current = setInterval(() => setGuiltIdx(i => (i + 1) % GUILT_MESSAGES.length), 8000);
  }

  function stopRecording() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (guiltRef.current) clearInterval(guiltRef.current);
    setLiveText("");
  }

  async function submitExamen() {
    const text = transcription.trim();
    if (!text || !selectedText) return;
    setStep("soumission");
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcription: text,
          grammarAnswer: grammarAnswer.trim(),
          grammarQuestion: selectedGrammar ?? "",
          oeuvre: selectedText.oeuvre,
          auteur: selectedText.auteur,
          texte: selectedText.texte,
          typeEpreuve,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setStep("grammaire"); return; }
      setResultat(data.resultat);
      setStep("resultat");
      const { leveledUp } = await addXP("examen", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
    } catch {
      setError("Erreur réseau.");
      setStep("grammaire");
    } finally {
      setSubmitting(false);
    }
  }

  const reset = useCallback(() => {
    setStep("briefing");
    setSelectedText(null); setSelectedGrammar(null);
    setTranscription(""); setLiveText(""); setTimer(0);
    setResultat(null); setError(""); setRecording(false);
    setGuiltIdx(0); setShowQuit(false); setGrammarAnswer("");
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const noteColor = (n: number) => n >= 16 ? "text-emerald-400" : n >= 12 ? "text-amber-400" : n >= 10 ? "text-orange-400" : "text-red-400";
  const noteBg = (n: number) => n >= 16 ? "bg-emerald-500/10 border-emerald-500/30" : n >= 12 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
  const pressure = PRESSURE_COLORS(timer);

  if (loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <Loader2 size={28} className="text-[#1a9fff] animate-spin" />
    </div>
  );

  /* ── BLOQUÉ ── */
  if (!loading && texts.length === 0) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="p-5 rounded-full bg-[#0a1543]/80 border border-[#19327f]/60 w-fit mx-auto">
            <Lock size={36} className="text-[#2a3a6e]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Mode verrouillé</h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Le mode examen nécessite au moins un texte enregistré.<br />
            Fais d&apos;abord une analyse linéaire — le texte sera sauvegardé automatiquement.
          </p>
        </div>
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 text-left space-y-3">
          <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">Pour débloquer</p>
          <div className="flex items-start gap-3 text-sm text-[#a0b0d0]">
            <span className="text-[#1a9fff] font-bold flex-shrink-0">1.</span>
            Va dans <Link href="/analyse" className="text-[#1a9fff] font-bold hover:text-[#00d9ff]">Analyse linéaire</Link>
          </div>
          <div className="flex items-start gap-3 text-sm text-[#a0b0d0]">
            <span className="text-[#1a9fff] font-bold flex-shrink-0">2.</span>
            Colle un de tes textes au programme et génère l&apos;analyse
          </div>
          <div className="flex items-start gap-3 text-sm text-[#a0b0d0]">
            <span className="text-[#1a9fff] font-bold flex-shrink-0">3.</span>
            Le texte sera sauvegardé dans <Link href="/mes-textes" className="text-[#1a9fff] font-bold hover:text-[#00d9ff]">Mes textes</Link>
          </div>
          <div className="flex items-start gap-3 text-sm text-[#a0b0d0]">
            <span className="text-[#1a9fff] font-bold flex-shrink-0">4.</span>
            Ajoute tes questions de grammaire dans <Link href="/profile" className="text-[#1a9fff] font-bold hover:text-[#00d9ff]">ton profil</Link>
          </div>
        </div>
        <Link href="/analyse"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
          <BookOpen size={16} />
          Faire une analyse linéaire
        </Link>
      </div>
    </div>
  );

  /* ── BRIEFING ── */
  if (step === "briefing") return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="text-6xl">⚖️</div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Salle d&apos;examen</h1>
          <p className="text-[#a0b0d0] text-sm leading-relaxed">
            Tu entres dans un environnement de simulation officielle.<br />
            Il n&apos;y a pas de retour en arrière. Il n&apos;y a pas de pause.<br />
            Le jury ne répète pas.
          </p>
        </div>
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 text-left space-y-3">
          <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Déroulement</p>
          {[
            `Un texte parmi tes ${texts.length} texte(s) sera tiré au sort`,
            "Tu as 10 minutes de prestation — le jury note sans pitié",
            grammarQuestions.length > 0 ? `Une question de grammaire parmi tes ${grammarQuestions.length} question(s) sera posée` : "Aucune question de grammaire configurée (profil)",
            "Quitter = échec automatique",
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#a0b0d0]">
              <span className="text-[#FFD700] font-bold flex-shrink-0">{i + 1}.</span>
              {r}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Type d&apos;épreuve</label>
          <select
            value={typeEpreuve} onChange={e => setTypeEpreuve(e.target.value)}
            className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 transition-colors">
            <option>Explication de texte linéaire</option>
            <option>Entretien sur l&apos;œuvre personnelle</option>
            <option>Commentaire littéraire</option>
          </select>
        </div>
        <button onClick={tirageSortAndStart}
          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.5)]">
          Tirage au sort — Entrer dans la salle
        </button>
      </div>
    </div>
  );

  /* ── PREPARATION ── */
  if (step === "preparation" && selectedText) return (
    <div className="min-h-screen bg-[#050510] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🔇</div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase">Ton texte</h2>
          <p className="text-[#6b7280] text-sm">Épreuve : <span className="text-[#00d9ff] font-bold">{typeEpreuve}</span></p>
        </div>

        <div className="bg-[#0a1543]/80 border border-[#FFD700]/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-white font-black">{selectedText.titre || "Extrait"}</p>
              <p className="text-[#1a9fff] text-sm">{selectedText.auteur} {selectedText.oeuvre ? `— ${selectedText.oeuvre}` : ""}</p>
            </div>
            {selectedText.axe && (
              <p className="text-xs text-[#a0b0d0] italic max-w-xs text-right">{selectedText.axe}</p>
            )}
          </div>
          <div className="border-t border-[#19327f]/40 pt-4">
            <p className="text-sm text-[#c9c9d4] leading-relaxed whitespace-pre-wrap font-mono">{selectedText.texte}</p>
          </div>
        </div>

        {selectedGrammar && (
          <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5">
            <p className="text-xs font-black text-[#a0b0d0] uppercase tracking-widest mb-2">Question de grammaire</p>
            <p className="text-[#e8e8f0] text-sm font-medium">{selectedGrammar}</p>
            <p className="text-[#6b7280] text-xs mt-2">Tu devras répondre après ta prestation orale</p>
          </div>
        )}

        <div className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-2xl p-5 space-y-2 text-sm text-[#a0b0d0]">
          <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest mb-3">Rappels</p>
          <p>→ Introduction : situer le texte, annoncer la problématique et le plan</p>
          <p>→ Suivre le mouvement du texte ligne par ligne</p>
          <p>→ Conclure avec une ouverture</p>
          <p>→ Parle clairement, vise 8 à 10 minutes</p>
        </div>

        <button
          onClick={() => { setStep("enregistrement"); startRecording(); }}
          className="w-full py-5 rounded-xl font-black text-lg uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <Mic size={20} className="inline mr-2" />
          Commencer la prestation
        </button>
        {!supported && (
          <p className="text-orange-400 text-xs text-center">Micro non disponible — tu pourras taper ta réponse</p>
        )}
      </div>
    </div>
  );

  /* ── ENREGISTREMENT ── */
  if (step === "enregistrement") return (
    <div className="min-h-screen bg-[#050510] px-4 py-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: recording ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.07) 0%, transparent 70%)" : "none" }} />

      <div className="max-w-2xl mx-auto space-y-5 relative z-10">
        {/* Timer bar */}
        <div className={`flex items-center justify-between bg-[#0a1543]/90 border ${pressure.border} rounded-xl px-5 py-3 ${pressure.glow}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${recording ? "bg-red-500 animate-pulse" : "bg-[#6b7280]"}`} />
            <span className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">
              {recording ? "PRESTATION EN COURS" : "EN PAUSE"}
            </span>
          </div>
          <div className={`font-mono font-black text-2xl ${pressure.text}`}>
            <Clock size={14} className="inline mr-1" />
            {fmt(timer)}
          </div>
        </div>

        {recording && (
          <p className="text-center text-[#6b7280] text-xs italic animate-pulse">
            &ldquo;{GUILT_MESSAGES[guiltIdx]}&rdquo;
          </p>
        )}

        {/* Texte de référence (réduit) */}
        {selectedText && (
          <details className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-xl">
            <summary className="px-4 py-2.5 text-xs font-bold text-[#a0b0d0] cursor-pointer uppercase tracking-widest">
              📄 {selectedText.titre || "Texte"} — {selectedText.auteur}
            </summary>
            <div className="px-4 pb-4 pt-2 border-t border-[#19327f]/30">
              <p className="text-xs text-[#a0b0d0] leading-relaxed whitespace-pre-wrap font-mono">{selectedText.texte}</p>
            </div>
          </details>
        )}

        {/* Transcription */}
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 min-h-[160px] max-h-[250px] overflow-y-auto">
          <p className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest mb-3">Transcription</p>
          {transcription || liveText ? (
            <p className="text-sm text-[#c9c9d4] leading-relaxed">
              {transcription}
              {liveText && <span className="text-[#6b7280] italic"> {liveText}</span>}
            </p>
          ) : (
            <p className="text-[#2a3a6e] text-sm italic">Ta voix apparaîtra ici...</p>
          )}
        </div>

        {!supported && (
          <textarea
            className="w-full bg-[#0a1543]/80 border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 resize-none"
            rows={6} placeholder="Tape ta prestation ici..." value={transcription}
            onChange={e => setTranscription(e.target.value)} />
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="flex gap-3">
          {supported && (recording ? (
            <button onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0a1543] border border-[#19327f] text-[#a0b0d0] font-bold transition-all hover:border-[#1a9fff]/40">
              <MicOff size={18} /> Pause
            </button>
          ) : (
            <button onClick={startRecording}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Mic size={18} /> {timer === 0 ? "Parler" : "Reprendre"}
            </button>
          ))}
          {transcription.trim() && !recording && (
            <button onClick={() => selectedGrammar ? setStep("grammaire") : submitExamen()}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
              <ChevronRight size={18} />
              {selectedGrammar ? "Question de grammaire" : "Soumettre au jury"}
            </button>
          )}
        </div>

        <div className="text-center">
          <button onClick={() => setShowQuit(true)} className="text-xs text-[#2a3a6e] hover:text-red-400 transition-colors">
            Abandonner l&apos;examen
          </button>
        </div>

        {showQuit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur px-4">
            <div className="bg-[#0a1543] border border-red-500/40 rounded-2xl p-8 max-w-sm w-full space-y-5 text-center shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              <AlertTriangle size={36} className="text-red-400 mx-auto" />
              <h3 className="text-xl font-black text-white">Tu veux vraiment abandonner ?</h3>
              <p className="text-[#a0b0d0] text-sm leading-relaxed">
                Les élèves qui abandonnent leurs simulations échouent 3 fois plus souvent le jour J.<br />
                <span className="text-red-400 font-bold">Tu es si proche de terminer.</span>
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowQuit(false)}
                  className="py-3 rounded-xl bg-[#1a9fff] text-[#050a2e] font-black uppercase tracking-widest text-sm">
                  Continuer l&apos;examen
                </button>
                <button onClick={reset} className="py-2 text-xs text-[#2a3a6e] hover:text-red-400 transition-colors">
                  Abandonner quand même
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ── GRAMMAIRE ── */
  if (step === "grammaire" && selectedGrammar) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">📝</div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase">Question de grammaire</h2>
          <p className="text-[#6b7280] text-sm">Dernière étape avant le verdict du jury</p>
        </div>
        <div className="bg-[#0a1543]/80 border border-[#FFD700]/20 rounded-2xl p-6 space-y-4">
          <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Question posée par le jury</p>
          <p className="text-white font-bold text-lg">{selectedGrammar}</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Ta réponse</label>
          <textarea
            value={grammarAnswer} onChange={e => setGrammarAnswer(e.target.value)}
            className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors resize-none"
            rows={5} placeholder="Écris ta réponse ici..." />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={submitExamen} disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)] disabled:opacity-50">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
          {submitting ? "Délibération..." : "Soumettre au jury"}
        </button>
      </div>
    </div>
  );

  /* ── SOUMISSION ── */
  if (step === "soumission") return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <Loader2 size={48} className="text-[#1a9fff] animate-spin mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-widest uppercase">Le jury délibère</h2>
          <p className="text-[#6b7280] text-sm">Analyse de ta prestation en cours...</p>
        </div>
      </div>
    </div>
  );

  /* ── RÉSULTAT ── */
  if (step === "resultat" && resultat) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold text-[#00d9ff] uppercase tracking-widest">✦ Verdict du jury ✦</p>
        <div className={`text-8xl font-black ${noteColor(resultat.note_finale)}`}>{resultat.note_finale}</div>
        <p className="text-[#6b7280]">/20</p>
        <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-black border ${noteBg(resultat.note_finale)} ${noteColor(resultat.note_finale)}`}>
          {resultat.mention}
        </div>
        {selectedText && (
          <p className="text-xs text-[#6b7280] mt-2">{selectedText.titre} — {selectedText.auteur}</p>
        )}
      </div>

      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-5 space-y-2">
        <p className="text-xs font-bold text-[#FFD700] uppercase tracking-widest mb-3">Bilan du jury</p>
        <p className="text-[#c9c9d4] leading-relaxed text-sm">{resultat.bilan}</p>
        <p className="text-[#a78bfa] italic text-sm mt-2">{resultat.encouragement}</p>
      </div>

      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Critères de notation</p>
        {resultat.criteres?.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[#c9c9d4] font-medium">{c.nom}</span>
              <span className={`font-black ${noteColor((c.note / c.sur) * 20)}`}>{c.note}/{c.sur}</span>
            </div>
            <div className="w-full bg-[#050a2e] border border-[#19327f]/40 rounded-sm h-2">
              <div className="h-2 rounded-sm transition-all" style={{ width: `${(c.note / c.sur) * 100}%`, background: "linear-gradient(90deg, #1a9fff, #00d9ff)" }} />
            </div>
            <p className="text-xs text-[#6b7280]">{c.commentaire}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">✓ Réussites</p>
          <ul className="space-y-2">
            {resultat.reussites?.map((r, i) => (
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2"><span className="text-emerald-400 flex-shrink-0">✓</span>{r}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">✗ Points manquants</p>
          <ul className="space-y-2">
            {resultat.points_essentiels_manquants?.map((p, i) => (
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2"><span className="text-red-400 flex-shrink-0">✗</span>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a1543] hover:bg-[#19327f]/30 border border-[#19327f] text-[#e8e8f0] font-bold transition-all">
        <RotateCcw size={16} /> Recommencer un examen
      </button>
    </div>
  );

  return null;
}
