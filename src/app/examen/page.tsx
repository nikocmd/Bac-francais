"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2, RotateCcw, ChevronRight, AlertTriangle, Clock, Shield } from "lucide-react";
import { addXP } from "@/lib/gamification";

interface Critere { nom: string; note: number; sur: number; commentaire: string; }
interface Resultat {
  note_finale: number; mention: string; bilan: string; encouragement: string;
  criteres: Critere[]; points_essentiels_manquants: string[]; reussites: string[];
}
type Step = "briefing" | "config" | "preparation" | "enregistrement" | "soumission" | "resultat";

const GUILT_MESSAGES = [
  "Le jury attend. Chaque seconde compte.",
  "Tu ne peux pas te permettre d'abandonner maintenant.",
  "Les autres candidats eux, continuent.",
  "C'est ici que se joue ton avenir.",
  "Abandonne maintenant et tu regretteras le jour du vrai bac.",
];

const PRESSURE_COLORS = (seconds: number) => {
  if (seconds < 120) return { text: "text-red-400", glow: "shadow-[0_0_30px_rgba(239,68,68,0.6)]", border: "border-red-500/60" };
  if (seconds < 300) return { text: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]", border: "border-amber-500/40" };
  return { text: "text-emerald-400", glow: "", border: "border-emerald-500/30" };
};

export default function ExamenPage() {
  const [step, setStep] = useState<Step>("briefing");
  const [form, setForm] = useState({ oeuvre: "", auteur: "", texte: "", typeEpreuve: "Explication de texte linéaire" });
  const [transcription, setTranscription] = useState("");
  const [liveText, setLiveText] = useState("");
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [loading, setLoading] = useState(false);
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
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.lang = "fr-FR";
    r.continuous = true;
    r.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setTranscription(final);
      setLiveText(interim);
    };
    r.onend = () => setRecording(false);
    recognitionRef.current = r;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (guiltRef.current) clearInterval(guiltRef.current);
    };
  }, []);

  function startRecording() {
    if (!recognitionRef.current) return;
    setTranscription("");
    setLiveText("");
    setTimer(0);
    recognitionRef.current.start();
    setRecording(true);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    guiltRef.current = setInterval(() => {
      setGuiltIdx(i => (i + 1) % GUILT_MESSAGES.length);
    }, 8000);
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
    if (!text) return;
    setStep("soumission");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: text, ...form }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setStep("enregistrement"); return; }
      setResultat(data.resultat);
      setStep("resultat");
      const { leveledUp } = await addXP("examen", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
    } catch {
      setError("Erreur réseau.");
      setStep("enregistrement");
    } finally {
      setLoading(false);
    }
  }

  const reset = useCallback(() => {
    setStep("briefing");
    setTranscription("");
    setLiveText("");
    setTimer(0);
    setResultat(null);
    setError("");
    setRecording(false);
    setGuiltIdx(0);
    setShowQuit(false);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const noteColor = (n: number) => n >= 16 ? "text-emerald-400" : n >= 12 ? "text-amber-400" : n >= 10 ? "text-orange-400" : "text-red-400";
  const noteBg = (n: number) => n >= 16 ? "bg-emerald-500/10 border-emerald-500/30" : n >= 12 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
  const pressure = PRESSURE_COLORS(600 - timer);

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
        <div className="bg-[#0a1543]/80 border border-[#FFD700]/20 rounded-2xl p-5 space-y-3 text-left">
          <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">⚠ Règles de la salle</p>
          {[
            "Tu as 10 minutes de prestation. Le temps s'affiche en permanence.",
            "L'IA joue le rôle du jury — elle note sans pitié.",
            "Quitter en cours de simulation = échec automatique.",
            "Chaque examen complété rapporte de l'XP et renforce ton rang.",
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#a0b0d0]">
              <span className="text-[#FFD700] font-bold flex-shrink-0">{i + 1}.</span>
              {r}
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep("config")}
          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.5)]"
        >
          J&apos;accepte les conditions — Entrer dans la salle
        </button>
      </div>
    </div>
  );

  /* ── CONFIG ── */
  if (step === "config") return (
    <div className="min-h-screen bg-[#050510] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-[#19327f]/40 pb-4">
          <Shield size={20} className="text-[#1a9fff]" />
          <h2 className="text-lg font-black text-white tracking-widest uppercase">Configuration de l&apos;épreuve</h2>
        </div>
        <div className="space-y-4 bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Œuvre</label>
              <input
                className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                placeholder="ex: Les Fleurs du Mal"
                value={form.oeuvre}
                onChange={e => setForm(f => ({ ...f, oeuvre: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Auteur</label>
              <input
                className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                placeholder="ex: Baudelaire"
                value={form.auteur}
                onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Type d&apos;épreuve</label>
            <select
              className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
              value={form.typeEpreuve}
              onChange={e => setForm(f => ({ ...f, typeEpreuve: e.target.value }))}
            >
              <option>Explication de texte linéaire</option>
              <option>Entretien sur l&apos;œuvre personnelle</option>
              <option>Commentaire littéraire</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Texte soumis (optionnel)</label>
            <textarea
              className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1a9fff]/60 transition-colors resize-none"
              rows={4}
              placeholder="Colle le texte à expliquer..."
              value={form.texte}
              onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
            />
          </div>
        </div>
        <button
          onClick={() => setStep("preparation")}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]"
        >
          Passer en salle — Démarrer la préparation
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  /* ── PREPARATION ── */
  if (step === "preparation") return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-5xl animate-pulse">🔇</div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">Silence dans la salle</h2>
          <p className="text-[#a0b0d0] text-sm">
            Épreuve : <span className="text-[#00d9ff] font-bold">{form.typeEpreuve}</span><br />
            {form.oeuvre && <><span className="text-white">{form.oeuvre}</span> — <span className="text-[#a0b0d0]">{form.auteur}</span></>}
          </p>
        </div>
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 space-y-2 text-sm text-[#a0b0d0] text-left">
          <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest mb-3">Rappels avant de commencer</p>
          <p>→ Commence par une introduction qui pose la problématique</p>
          <p>→ Suis le mouvement du texte ligne par ligne</p>
          <p>→ Conclus avec une ouverture</p>
          <p>→ Parle clairement, sans t&apos;arrêter trop longtemps</p>
        </div>
        <button
          onClick={() => { setStep("enregistrement"); startRecording(); }}
          disabled={!supported && !true}
          className="w-full py-5 rounded-xl font-black text-lg uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse"
        >
          <Mic size={20} className="inline mr-2" />
          Commencer la prestation
        </button>
        {!supported && (
          <p className="text-orange-400 text-xs">Micro non disponible — tu pourras taper ta réponse manuellement</p>
        )}
      </div>
    </div>
  );

  /* ── ENREGISTREMENT ── */
  if (step === "enregistrement") return (
    <div className="min-h-screen bg-[#050510] px-4 py-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: recording ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 70%)" : "radial-gradient(ellipse at 50% 0%, rgba(26,159,255,0.05) 0%, transparent 70%)" }} />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Status bar */}
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

        {/* Message de culpabilité */}
        {recording && (
          <div className="text-center py-2">
            <p className="text-[#6b7280] text-xs italic animate-pulse">
              &ldquo;{GUILT_MESSAGES[guiltIdx]}&rdquo;
            </p>
          </div>
        )}

        {/* Transcription */}
        <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-5 min-h-[200px] max-h-[300px] overflow-y-auto">
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
            rows={6}
            placeholder="Tape ta prestation ici..."
            value={transcription}
            onChange={e => setTranscription(e.target.value)}
          />
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Boutons */}
        <div className="flex gap-3">
          {supported && (
            recording ? (
              <button onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0a1543] border border-[#19327f] text-[#a0b0d0] font-bold transition-all hover:border-[#1a9fff]/40">
                <MicOff size={18} />
                Pause
              </button>
            ) : (
              <button onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <Mic size={18} />
                {timer === 0 ? "Parler" : "Reprendre"}
              </button>
            )
          )}

          {transcription.trim() && !recording && (
            <button onClick={submitExamen} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
              <ChevronRight size={18} />
              Soumettre au jury
            </button>
          )}
        </div>

        {/* Quitter */}
        <div className="text-center">
          <button onClick={() => setShowQuit(true)}
            className="text-xs text-[#2a3a6e] hover:text-red-400 transition-colors">
            Abandonner l&apos;examen
          </button>
        </div>

        {/* Modal de culpabilité */}
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
                <button onClick={reset}
                  className="py-2 text-xs text-[#2a3a6e] hover:text-red-400 transition-colors">
                  Abandonner quand même
                </button>
              </div>
            </div>
          </div>
        )}
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
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0">✓</span>{r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">✗ Points manquants</p>
          <ul className="space-y-2">
            {resultat.points_essentiels_manquants?.map((p, i) => (
              <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0">✗</span>{p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a1543] hover:bg-[#19327f]/30 border border-[#19327f] text-[#e8e8f0] font-bold transition-all">
        <RotateCcw size={16} />
        Recommencer un examen
      </button>
    </div>
  );

  return null;
}
