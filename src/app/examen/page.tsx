"use client";
import { useState, useRef, useEffect } from "react";
import { GraduationCap, Mic, MicOff, Loader2, RotateCcw, CheckCircle, XCircle, Zap } from "lucide-react";
import { addXP } from "@/lib/gamification";

interface Critere {
  nom: string;
  note: number;
  sur: number;
  commentaire: string;
}
interface Resultat {
  note_finale: number;
  mention: string;
  bilan: string;
  encouragement: string;
  criteres: Critere[];
  points_essentiels_manquants: string[];
  reussites: string[];
}

type Step = "config" | "enregistrement" | "resultat";

export default function ExamenPage() {
  const [step, setStep] = useState<Step>("config");
  const [form, setForm] = useState({ oeuvre: "", auteur: "", texte: "", typeEpreuve: "Explication de texte linéaire" });
  const [transcription, setTranscription] = useState("");
  const [liveText, setLiveText] = useState("");
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startRecording() {
    if (!recognitionRef.current) return;
    setTranscription("");
    setLiveText("");
    setTimer(0);
    recognitionRef.current.start();
    setRecording(true);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  }

  function stopRecording() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setLiveText("");
  }

  async function submitExamen() {
    const text = transcription.trim();
    if (!text) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: text, ...form }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResultat(data.resultat);
      setStep("resultat");
      const { leveledUp } = await addXP("examen", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("config");
    setTranscription("");
    setLiveText("");
    setTimer(0);
    setResultat(null);
    setError("");
    setRecording(false);
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const noteColor = (n: number) =>
    n >= 16 ? "text-emerald-400" : n >= 12 ? "text-amber-400" : n >= 10 ? "text-orange-400" : "text-red-400";

  const noteBg = (n: number) =>
    n >= 16 ? "bg-emerald-500/10 border-emerald-500/30" : n >= 12 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg shadow-amber-500/25">
          <GraduationCap size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mode examen</h1>
          <p className="text-[#9ca3af] text-sm">Simulation officielle du jury — notation selon les critères du Bac</p>
        </div>
      </div>

      {/* Step 1 — Config */}
      {step === "config" && (
        <div className="space-y-4 bg-[#12121a] rounded-2xl border border-[#1e1e2e] p-6 fade-in">
          <p className="text-sm text-[#9ca3af]">Configure les conditions de l&apos;examen avant de commencer.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9ca3af]">Œuvre</label>
              <input
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="ex: Les Fleurs du Mal"
                value={form.oeuvre}
                onChange={e => setForm(f => ({ ...f, oeuvre: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9ca3af]">Auteur</label>
              <input
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="ex: Baudelaire"
                value={form.auteur}
                onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Type d&apos;épreuve</label>
            <select
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              value={form.typeEpreuve}
              onChange={e => setForm(f => ({ ...f, typeEpreuve: e.target.value }))}
            >
              <option>Explication de texte linéaire</option>
              <option>Entretien sur l&apos;œuvre personnelle</option>
              <option>Commentaire littéraire</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Texte soumis (optionnel)</label>
            <textarea
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
              rows={5}
              placeholder="Colle le texte que tu dois expliquer..."
              value={form.texte}
              onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setStep("enregistrement")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all"
          >
            <GraduationCap size={16} />
            Commencer l&apos;examen
          </button>
        </div>
      )}

      {/* Step 2 — Enregistrement */}
      {step === "enregistrement" && (
        <div className="space-y-6 fade-in">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center space-y-1">
            <p className="text-amber-400 font-semibold">🎓 Examen en cours</p>
            <p className="text-[#9ca3af] text-sm">{form.typeEpreuve} — {form.oeuvre || "Œuvre non précisée"}</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className={`text-5xl font-mono font-bold ${recording ? "text-amber-400" : "text-[#6b7280]"}`}>
              {fmt(timer)}
            </div>
            <p className="text-[#6b7280] text-sm mt-1">Durée recommandée : 8-10 min</p>
          </div>

          {/* Wave animation */}
          {recording && (
            <div className="flex items-center justify-center gap-1 py-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="wave-bar" style={{ height: "8px", animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={!supported}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-lg transition-all shadow-lg shadow-amber-500/25"
              >
                <Mic size={20} />
                {timer === 0 ? "Démarrer ma prestation" : "Reprendre"}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all"
              >
                <MicOff size={20} />
                Terminer ma prestation
              </button>
            )}
          </div>

          {/* Transcription preview */}
          {(transcription || liveText) && (
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 max-h-48 overflow-y-auto">
              <p className="text-xs font-semibold text-[#6b7280] mb-2">Transcription en direct</p>
              <p className="text-sm text-[#c9c9d4] leading-relaxed">
                {transcription}
                {liveText && <span className="text-[#6b7280] italic"> {liveText}</span>}
              </p>
            </div>
          )}

          {/* Manual input fallback */}
          {!supported && (
            <div className="space-y-2">
              <p className="text-sm text-orange-400">Micro non supporté. Tape ta prestation ici :</p>
              <textarea
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none"
                rows={6}
                value={transcription}
                onChange={e => setTranscription(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {transcription.trim() && !recording && (
            <div className="flex justify-center gap-4">
              <button
                onClick={submitExamen}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition-all"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
                {loading ? "Notation en cours..." : "Soumettre au jury IA"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Résultat */}
      {step === "resultat" && resultat && (
        <div className="space-y-6 fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00d9ff] bg-[#0a1543]/80 border border-[#1a9fff]/30 rounded-xl px-4 py-2 w-fit">
            <Zap size={14} className="text-[#FFD700]" />
            +200 XP · +10 STR — Examen accompli !
          </div>
          {/* Note finale */}
          <div className={`rounded-2xl border p-8 text-center space-y-3 ${noteBg(resultat.note_finale)}`}>
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Note finale</p>
            <div className={`text-8xl font-bold ${noteColor(resultat.note_finale)}`}>{resultat.note_finale}</div>
            <p className="text-[#6b7280]">/20</p>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${noteBg(resultat.note_finale)} ${noteColor(resultat.note_finale)}`}>
              {resultat.mention}
            </div>
          </div>

          {/* Bilan */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Bilan du jury</p>
            <p className="text-[#c9c9d4] leading-relaxed">{resultat.bilan}</p>
            <p className="mt-3 text-violet-400 italic text-sm">{resultat.encouragement}</p>
          </div>

          {/* Critères */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Détail des critères</p>
            {resultat.criteres?.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#c9c9d4] font-medium">{c.nom}</span>
                  <span className={`font-bold ${noteColor((c.note / c.sur) * 20)}`}>{c.note}/{c.sur}</span>
                </div>
                <div className="w-full bg-[#1e1e2e] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all"
                    style={{ width: `${(c.note / c.sur) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[#6b7280]">{c.commentaire}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-emerald-400" />
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Réussites</p>
              </div>
              <ul className="space-y-2">
                {resultat.reussites?.map((r, i) => (
                  <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2">
                    <span className="text-emerald-400 flex-shrink-0">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-red-400" />
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Points manquants</p>
              </div>
              <ul className="space-y-2">
                {resultat.points_essentiels_manquants?.map((p, i) => (
                  <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a27] hover:bg-[#1e1e2e] border border-[#2a2a3e] text-[#e8e8f0] font-semibold transition-all"
          >
            <RotateCcw size={16} />
            Recommencer un examen
          </button>
        </div>
      )}
    </div>
  );
}
