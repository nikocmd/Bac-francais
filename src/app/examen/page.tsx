"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2, RotateCcw, ChevronRight, AlertTriangle, Clock, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { addXP } from "@/lib/gamification";
import Paywall from "@/components/Paywall";

interface Critere { nom: string; note: number; sur: number; commentaire: string; }
interface Resultat {
  note_finale: number; mention: string; bilan: string; encouragement: string;
  criteres: Critere[]; points_essentiels_manquants: string[]; reussites: string[];
}
interface UserText { id: string; titre: string; auteur: string; oeuvre: string; texte: string; axe: string; }

type Step = "briefing" | "preparation" | "explication" | "grammaire" | "oeuvre" | "soumission" | "resultat";

const GUILT_MESSAGES = [
  "Le jury attend. Chaque seconde compte.",
  "Tu ne peux pas te permettre d'abandonner maintenant.",
  "Les autres candidats eux, continuent.",
  "C'est ici que se joue ton avenir.",
  "Abandonne maintenant et tu regretteras le jour du vrai bac.",
];

interface RecordingUIProps {
  target: "explication" | "oeuvre";
  title: string; subtitle: string; duration: string;
  trans: string; timer: number; recording: boolean; transcribing: boolean;
  guiltIdx: number; limitReached: boolean; error: string; showQuit: boolean;
  selectedText: { titre: string; auteur: string; texte: string } | null;
  onNext: () => void; nextLabel: string;
  startRecording: (t: "explication" | "oeuvre") => void;
  stopRecording: () => void;
  setTranscription: (v: string) => void;
  setShowQuit: (v: boolean) => void;
  reset: () => void;
  fmt: (s: number) => string;
}

function RecordingUI({
  target, title, subtitle, duration, trans, timer, recording, transcribing,
  guiltIdx, limitReached, error, showQuit, selectedText,
  onNext, nextLabel, startRecording, stopRecording, setTranscription, setShowQuit, reset, fmt,
}: RecordingUIProps) {
  const timerColor = timer > 720 ? "text-red-400" : timer > 480 ? "text-amber-400" : "text-emerald-400";
  return (
    <div className="min-h-screen bg-[#050510] px-4 py-6 relative">
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: recording ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 70%)" : "none" }} />
      <div className="max-w-2xl mx-auto space-y-5 relative z-10">
        <div className="flex items-center justify-between bg-[#0a1543]/90 border border-[#19327f]/60 rounded-xl px-5 py-3">
          <div>
            <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">{title}</p>
            <p className="text-xs text-[#6b7280]">{subtitle} · Durée conseillée : {duration}</p>
          </div>
          <div className={`font-mono font-black text-2xl ${timerColor}`}>
            <Clock size={14} className="inline mr-1" />{fmt(timer)}
          </div>
        </div>
        {recording && (
          <p className="text-center text-[#6b7280] text-xs italic animate-pulse">&ldquo;{GUILT_MESSAGES[guiltIdx]}&rdquo;</p>
        )}
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
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 min-h-[160px] max-h-[250px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            {recording && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <p className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Transcription</p>
          </div>
          {trans || transcribing ? (
            <p className="text-sm text-[#c9c9d4] leading-relaxed">
              {trans}{transcribing && !trans && <span className="text-[#6b7280] italic">Transcription en cours…</span>}
            </p>
          ) : (
            <p className="text-[#2a3a6e] text-sm italic">Ta voix apparaîtra ici...</p>
          )}
        </div>
        <textarea
          className="w-full bg-[#0a1543]/40 border border-[#19327f]/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 resize-none"
          rows={3} placeholder="Tu peux aussi taper ici..." value={trans}
          onChange={e => setTranscription(e.target.value)} />
        {limitReached && <Paywall />}
        {error && !limitReached && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div className="flex gap-3">
          {recording ? (
            <button onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0a1543] border border-[#19327f] text-[#a0b0d0] font-bold transition-all hover:border-[#1a9fff]/40">
              <MicOff size={18} /> Arrêter
            </button>
          ) : transcribing ? (
            <button disabled className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0a1543] border border-[#19327f] text-[#6b7280] font-bold opacity-60 cursor-wait">
              <Loader2 size={18} className="animate-spin" /> Transcription…
            </button>
          ) : (
            <button onClick={() => startRecording(target)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Mic size={18} /> {timer === 0 && !trans ? "Commencer" : "Reprendre"}
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!trans.trim() || recording || transcribing}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest transition-all
              disabled:bg-[#0a1543] disabled:border disabled:border-[#19327f]/40 disabled:text-[#2a3a6e] disabled:cursor-not-allowed
              enabled:bg-[#1a9fff] enabled:hover:bg-[#00d9ff] enabled:text-[#050a2e] enabled:shadow-[0_0_20px_rgba(26,159,255,0.4)]">
            <ChevronRight size={18} /> {nextLabel}
          </button>
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
                Les élèves qui abandonnent échouent 3x plus souvent le jour J.<br />
                <span className="text-red-400 font-bold">Tu es si proche de terminer.</span>
              </p>
              <button onClick={() => setShowQuit(false)} className="w-full py-3 rounded-xl bg-[#1a9fff] text-[#050a2e] font-black uppercase tracking-widest text-sm">
                Continuer l&apos;examen
              </button>
              <button onClick={reset} className="w-full py-2 text-xs text-[#2a3a6e] hover:text-red-400 transition-colors">
                Abandonner quand même
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExamenPage() {
  const [step, setStep] = useState<Step>("briefing");
  const [mode, setMode] = useState<"complet" | "rapide">("complet");
  const [texts, setTexts] = useState<UserText[]>([]);
  const [grammarQuestions, setGrammarQuestions] = useState<string[]>([]);
  const [selectedText, setSelectedText] = useState<UserText | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<string>("");
  const [explicationTranscription, setExplicationTranscription] = useState("");
  const [grammarAnswer, setGrammarAnswer] = useState("");
  const [oeuvreTranscription, setOeuvreTranscription] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [prepTimer, setPrepTimer] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [guiltIdx, setGuiltIdx] = useState(0);
  const [showQuit, setShowQuit] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [recordingTarget, setRecordingTarget] = useState<"explication" | "oeuvre">("explication");
  const [generatingGrammar, setGeneratingGrammar] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const guiltRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        const [{ data: textsData }, { data: profileData }] = await Promise.all([
          supabase.from("user_texts").select("*").eq("user_id", user.id),
          supabase.from("profiles").select("grammar_questions, is_premium").eq("id", user.id).single(),
        ]);
        setTexts(textsData ?? []);
        setGrammarQuestions(profileData?.grammar_questions ?? []);
        setIsPremium(profileData?.is_premium === true);
      } finally { setLoading(false); }
    }
    loadData();
  }, []);

  async function sendToGroq(blob: Blob, target: "explication" | "oeuvre") {
    setTranscribing(true);
    setError("");
    try {
      const form = new FormData();
      form.append("audio", blob, "audio." + (blob.type.includes("mp4") ? "m4a" : "webm"));
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (data.inaudible) { setError("INAUDIBLE"); return; }
      if (data.text) {
        setError("");
        if (target === "explication") setExplicationTranscription(prev => prev ? prev + " " + data.text : data.text);
        else setOeuvreTranscription(prev => prev ? prev + " " + data.text : data.text);
      }
    } catch { /* silently ignore */ }
    finally { setTranscribing(false); }
  }

  async function tirageSortAndStart() {
    const text = texts[Math.floor(Math.random() * texts.length)];
    const topic = grammarQuestions.length > 0 ? grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)] : "";
    setSelectedText(text);
    setSelectedGrammar("");
    const prepDuration = mode === "rapide" ? 5 * 60 : 30 * 60;
    setPrepTimer(prepDuration);
    setStep("preparation");
    prepRef.current = setInterval(() => {
      setPrepTimer(t => {
        if (t <= 1) { if (prepRef.current) clearInterval(prepRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    // Génération IA de la question de grammaire en arrière-plan
    if (topic) {
      setGeneratingGrammar(true);
      try {
        const res = await fetch("/api/grammaire-gen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sujet: topic }),
        });
        const data = await res.json();
        if (data.question) setSelectedGrammar(data.question);
        else setSelectedGrammar(topic);
      } catch {
        setSelectedGrammar(topic);
      } finally {
        setGeneratingGrammar(false);
      }
    }
  }

  async function startRecording(target: "explication" | "oeuvre") {
    setRecordingTarget(target);
    setTimer(0);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        sendToGroq(blob, target);
      };
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      guiltRef.current = setInterval(() => setGuiltIdx(i => (i + 1) % GUILT_MESSAGES.length), 8000);
    } catch { /* mic denied — user can type manually */ }
  }

  function stopRecording() {
    try { mediaRecorderRef.current?.stop(); } catch { /* ignore */ }
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (guiltRef.current) clearInterval(guiltRef.current);
  }

  async function submitExamen() {
    if (!selectedText) return;
    setStep("soumission"); setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          explicationTranscription: explicationTranscription.trim(),
          oeuvreTranscription: oeuvreTranscription.trim(),
          grammarQuestion: selectedGrammar,
          grammarAnswer: grammarAnswer.trim(),
          oeuvre: selectedText.oeuvre,
          auteur: selectedText.auteur,
          texte: selectedText.texte,
        }),
      });
      const data = await res.json();
      if (data.error === "LIMIT_REACHED") { setLimitReached(true); setStep("oeuvre"); return; }
      if (data.error) { setError(data.error); setStep("oeuvre"); return; }
      setResultat(data.resultat);
      setStep("resultat");
      const { leveledUp } = await addXP("examen", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
    } catch { setError("Erreur réseau."); setStep("oeuvre"); }
    finally { setSubmitting(false); }
  }

  const reset = useCallback(() => {
    setStep("briefing"); setSelectedText(null); setSelectedGrammar("");
    setExplicationTranscription(""); setOeuvreTranscription("");
    setGrammarAnswer(""); setTimer(0); setPrepTimer(0);
    setResultat(null); setError(""); setRecording(false); setTranscribing(false); setShowQuit(false);
    if (prepRef.current) clearInterval(prepRef.current);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const noteColor = (n: number, sur: number) => { const r = (n / sur) * 20; return r >= 16 ? "text-emerald-400" : r >= 12 ? "text-amber-400" : r >= 10 ? "text-orange-400" : "text-red-400"; };
  const noteBg = (n: number) => n >= 16 ? "bg-emerald-500/10 border-emerald-500/30" : n >= 12 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
  const prepColor = prepTimer < 60 ? "text-red-400" : prepTimer < 300 ? "text-amber-400" : "text-[#00d9ff]";

  if (isPremium === false) return (
    <div className="max-w-xl mx-auto px-4 py-20 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Mode Examen</h1>
      <p className="text-[#9ca3af] text-sm mb-6">Cette fonctionnalité est réservée aux membres Premium.</p>
      <Paywall title="Fonctionnalité Premium" description="Le mode examen est réservé aux membres Premium. Passe Premium pour simuler les conditions réelles du Bac avec notation BOEN." />
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="text-5xl animate-pulse">⚖️</div>
        <p className="text-[#1a9fff] font-black tracking-widest uppercase text-sm animate-pulse">Préparation de la salle d&apos;examen...</p>
      </div>
    </div>
  );

  /* ── BLOQUÉ ── */
  if (texts.length === 0) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="p-5 rounded-full bg-[#0a1543]/80 border border-[#19327f]/60 w-fit mx-auto">
            <Lock size={36} className="text-[#2a3a6e]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Mode verrouillé</h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Le mode examen nécessite au moins un texte enregistré.<br />
            Fais une analyse linéaire pour sauvegarder un texte.
          </p>
        </div>
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 text-left space-y-3">
          <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">Pour débloquer</p>
          <p className="text-sm text-[#a0b0d0]">① <Link href="/analyse" className="text-[#1a9fff] font-bold">Analyse linéaire</Link> → le texte est sauvegardé auto</p>
          <p className="text-sm text-[#a0b0d0]">② <Link href="/profile" className="text-[#1a9fff] font-bold">Profil</Link> → ajoute tes questions de grammaire</p>
          <p className="text-sm text-[#a0b0d0]">③ Reviens ici pour lancer l&apos;examen</p>
        </div>
        <Link href="/analyse" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
          <BookOpen size={16} /> Faire une analyse linéaire
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
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Oral du Bac</h1>
          <p className="text-[#a0b0d0] text-sm leading-relaxed">
            Simulation officielle — barème BOEN 2024
          </p>
        </div>

        {/* Barème */}
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 text-left space-y-4">
          <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Déroulement officiel</p>
          <div className="space-y-2">
            <p className="text-xs text-[#00d9ff] font-bold uppercase tracking-widest">Partie 1 — 12 points</p>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 text-sm text-[#a0b0d0]">
              <span>Lecture du texte + Explication linéaire</span><span className="text-[#6b7280]">12 min</span><span className="text-[#1a9fff] font-bold">10 pts</span>
              <span>Question de grammaire</span><span className="text-[#6b7280]">—</span><span className="text-[#1a9fff] font-bold">2 pts</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-[#00d9ff] font-bold uppercase tracking-widest">Partie 2 — 8 points</p>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 text-sm text-[#a0b0d0]">
              <span>Présentation de l&apos;œuvre</span><span className="text-[#6b7280]">4 min</span><span className="text-[#1a9fff] font-bold">8 pts</span>
            </div>
          </div>
          <div className="border-t border-[#19327f]/40 pt-2 flex justify-between text-sm">
            <span className="text-white font-bold">Total</span>
            <span className="text-[#FFD700] font-black">20 points</span>
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-3">
          <p className="text-xs text-[#a0b0d0] font-bold uppercase tracking-widest">Choisis ton mode</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMode("complet")}
              className={`p-4 rounded-xl border text-left transition-all ${mode === "complet"
                ? "bg-[#1a9fff]/10 border-[#1a9fff]/60 shadow-[0_0_15px_rgba(26,159,255,0.2)]"
                : "bg-[#0a1543]/60 border-[#19327f]/40 hover:border-[#19327f]"}`}>
              <p className="text-white font-black text-sm">⏱ Complet</p>
              <p className="text-[#6b7280] text-xs mt-1">30 min de préparation</p>
              <p className="text-[#6b7280] text-xs">Conditions réelles</p>
            </button>
            <button onClick={() => setMode("rapide")}
              className={`p-4 rounded-xl border text-left transition-all ${mode === "rapide"
                ? "bg-[#FFD700]/10 border-[#FFD700]/40 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                : "bg-[#0a1543]/60 border-[#19327f]/40 hover:border-[#19327f]"}`}>
              <p className="text-white font-black text-sm">⚡ Rapide</p>
              <p className="text-[#6b7280] text-xs mt-1">5 min de préparation</p>
              <p className="text-[#6b7280] text-xs">Entraînement express</p>
            </button>
          </div>
        </div>

        <div className="text-xs text-[#6b7280]">
          {texts.length} texte(s) disponible(s) · {grammarQuestions.length} question(s) de grammaire
        </div>

        {grammarQuestions.length === 0 ? (
          <div className="space-y-3">
            <div className="bg-[#2a0a0a]/80 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
              <Lock size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-1">
                <p className="text-red-400 font-black text-sm">Mode Examen bloqué</p>
                <p className="text-[#a0b0d0] text-xs leading-relaxed">
                  Tu n&apos;as pas encore renseigné tes questions de grammaire. Elles sont obligatoires pour simuler le vrai oral du Bac.
                </p>
              </div>
            </div>
            <Link href="/profile"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FFD700] hover:bg-yellow-300 text-[#050a2e] transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              <BookOpen size={16} /> Configurer mes questions
            </Link>
          </div>
        ) : (
          <button onClick={tirageSortAndStart}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.5)]">
            Tirage au sort — Entrer dans la salle
          </button>
        )}
      </div>
    </div>
  );

  /* ── PREPARATION ── */
  if (step === "preparation" && selectedText) return (
    <div className="min-h-screen bg-[#050510] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Timer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-[#a0b0d0] font-bold uppercase tracking-widest">
            {mode === "rapide" ? "⚡ Mode rapide" : "⏱ Mode complet"} — Préparation
          </p>
          <div className={`text-6xl font-mono font-black ${prepColor}`}>{fmt(prepTimer)}</div>
          {prepTimer === 0 && <p className="text-red-400 text-sm font-bold animate-pulse">Temps écoulé — lance ta prestation !</p>}
        </div>

        {/* Texte tiré au sort */}
        <div className="bg-[#0a1543]/80 border border-[#FFD700]/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-[#FFD700] font-black uppercase tracking-widest mb-1">Texte tiré au sort</p>
              <p className="text-white font-black">{selectedText.titre || "Extrait"}</p>
              <p className="text-[#1a9fff] text-sm">{selectedText.auteur} {selectedText.oeuvre ? `— ${selectedText.oeuvre}` : ""}</p>
            </div>
          </div>
          {selectedText.axe && <p className="text-xs text-[#a0b0d0] italic">{selectedText.axe}</p>}
          <div className="border-t border-[#19327f]/40 pt-4">
            <p className="text-sm text-[#c9c9d4] leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">{selectedText.texte}</p>
          </div>
        </div>

        {/* Question de grammaire */}
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5">
          <p className="text-xs font-black text-[#a0b0d0] uppercase tracking-widest mb-2">Question de grammaire (à préparer)</p>
          {generatingGrammar ? (
            <div className="flex items-center gap-2 text-[#6b7280] text-sm">
              <Loader2 size={14} className="animate-spin" /> Génération de la question…
            </div>
          ) : selectedGrammar ? (
            <p className="text-[#e8e8f0] text-sm font-medium">{selectedGrammar}</p>
          ) : (
            <p className="text-[#2a3a6e] text-sm italic">Aucune question de grammaire</p>
          )}
        </div>

        {/* Rappels */}
        <div className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-2xl p-5 space-y-2 text-sm text-[#a0b0d0]">
          <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest mb-2">Déroulement</p>
          <p>① Lecture du texte + Explication linéaire (12 min, 10 pts)</p>
          <p>② Question de grammaire (2 pts)</p>
          <p>③ Présentation de ton œuvre (4 min, 8 pts)</p>
        </div>

        <button onClick={() => { if (prepRef.current) clearInterval(prepRef.current); setStep("explication"); }}
          className="w-full py-5 rounded-xl font-black text-lg uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <Mic size={20} className="inline mr-2" />
          Commencer la prestation — Partie 1
        </button>
      </div>
    </div>
  );

  const sharedRecordingProps = {
    timer, recording, transcribing, guiltIdx, limitReached, error, showQuit,
    selectedText, startRecording, stopRecording, setShowQuit, reset, fmt,
  };

  /* ── EXPLICATION (Partie 1) ── */
  if (step === "explication") return (
    <RecordingUI
      {...sharedRecordingProps}
      target="explication"
      title="✦ Partie 1 — Explication linéaire"
      subtitle="Lecture + explication du texte · 10 points"
      duration="12 min"
      trans={explicationTranscription}
      setTranscription={setExplicationTranscription}
      onNext={() => { setTimer(0); setStep("grammaire"); }}
      nextLabel="Question de grammaire"
    />
  );

  /* ── GRAMMAIRE ── */
  if (step === "grammaire") return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest">✦ Partie 1 — Question de grammaire</p>
          <h2 className="text-xl font-black text-white">2 points</h2>
        </div>
        {selectedGrammar ? (
          <>
            <div className="bg-[#0a1543]/80 border border-[#FFD700]/20 rounded-2xl p-6">
              <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest mb-3">Question du jury</p>
              <p className="text-white font-bold text-lg">{selectedGrammar}</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Ta réponse</label>
              <textarea value={grammarAnswer} onChange={e => setGrammarAnswer(e.target.value)}
                className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors resize-none"
                rows={5} placeholder="Écris ta réponse..." />
            </div>
          </>
        ) : (
          <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-6 text-center">
            <p className="text-[#6b7280] text-sm">Aucune question de grammaire configurée dans ton profil.</p>
            <p className="text-[#2a3a6e] text-xs mt-2">Tu peux en ajouter dans ton profil pour la prochaine fois.</p>
          </div>
        )}
        <button onClick={() => { setTimer(0); setStep("oeuvre"); }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
          <ChevronRight size={16} /> Partie 2 — Présentation de l&apos;œuvre
        </button>
      </div>
    </div>
  );

  /* ── OEUVRE (Partie 2) ── */
  if (step === "oeuvre") return (
    <RecordingUI
      {...sharedRecordingProps}
      target="oeuvre"
      title="✦ Partie 2 — Présentation de l'œuvre"
      subtitle={`${selectedText?.oeuvre || "Œuvre"} · 8 points`}
      duration="4 min"
      trans={oeuvreTranscription}
      setTranscription={setOeuvreTranscription}
      onNext={submitExamen}
      nextLabel="Soumettre au jury"
    />
  );

  /* ── SOUMISSION ── */
  if (step === "soumission") return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <Loader2 size={48} className="text-[#1a9fff] animate-spin mx-auto" />
        <h2 className="text-xl font-black text-white tracking-widest uppercase">Le jury délibère</h2>
        <p className="text-[#6b7280] text-sm">Analyse de ta prestation en cours...</p>
      </div>
    </div>
  );

  /* ── RÉSULTAT ── */
  if (step === "resultat" && resultat) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold text-[#00d9ff] uppercase tracking-widest">✦ Verdict du jury ✦</p>
        <div className={`text-8xl font-black ${resultat.note_finale >= 16 ? "text-emerald-400" : resultat.note_finale >= 12 ? "text-amber-400" : resultat.note_finale >= 10 ? "text-orange-400" : "text-red-400"}`}>
          {resultat.note_finale}
        </div>
        <p className="text-[#6b7280]">/20</p>
        <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-black border ${noteBg(resultat.note_finale)} ${resultat.note_finale >= 16 ? "text-emerald-400" : resultat.note_finale >= 12 ? "text-amber-400" : resultat.note_finale >= 10 ? "text-orange-400" : "text-red-400"}`}>
          {resultat.mention}
        </div>
        {selectedText && <p className="text-xs text-[#6b7280] mt-2">{selectedText.titre} — {selectedText.auteur}</p>}
      </div>

      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-5 space-y-2">
        <p className="text-xs font-bold text-[#FFD700] uppercase tracking-widest mb-3">Bilan du jury</p>
        <p className="text-[#c9c9d4] leading-relaxed text-sm">{resultat.bilan}</p>
        <p className="text-[#a78bfa] italic text-sm mt-2">{resultat.encouragement}</p>
      </div>

      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Barème officiel</p>
        {resultat.criteres?.map((c, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[#c9c9d4] font-medium">{c.nom}</span>
              <span className={`font-black ${noteColor(c.note, c.sur)}`}>{c.note}/{c.sur}</span>
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
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2"><span className="text-emerald-400">✓</span>{r}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">✗ Points manquants</p>
          <ul className="space-y-2">
            {resultat.points_essentiels_manquants?.map((p, i) => (
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2"><span className="text-red-400">✗</span>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a1543] hover:bg-[#19327f]/30 border border-[#19327f] text-[#e8e8f0] font-bold transition-all">
        <RotateCcw size={16} /> Recommencer un examen
      </button>
    </div>
  );

  return null;
}
