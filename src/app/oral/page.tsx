"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mic, MicOff, Loader2, Send, Star, CheckCircle,
  AlertCircle, Lightbulb, Zap, RotateCcw
} from "lucide-react";
import { addXP } from "@/lib/gamification";
import Paywall from "@/components/Paywall";

interface Critere { nom: string; note: number; sur: number; commentaire: string; }
interface Feedback {
  note: number; mention: string; appreciation: string;
  points_forts: string[]; axes_amelioration: string[]; conseils: string[]; criteres: Critere[];
}

export default function OralPage() {
  const router = useRouter();
  const [transcription, setTranscription] = useState("");
  const [contexte, setContexte] = useState("");
  const [type, setType] = useState("Explication de texte linéaire");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const client = createClient();
      client.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          setUserId(user.id);
          const { data } = await client.from("profiles").select("is_premium").eq("id", user.id).single();
          setIsPremium(data?.is_premium === true);
        } else {
          router.push("/login"); return;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (recording) {
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  function fmt(s: number) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

  async function sendToGroq(blob: Blob) {
    setTranscribing(true);
    setError("");
    try {
      const form = new FormData();
      form.append("audio", blob, "audio." + (blob.type.includes("mp4") ? "m4a" : "webm"));
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (data.inaudible) { setError("INAUDIBLE"); return; }
      if (data.error) { setError(data.error); return; }
      if (data.text) { setError(""); setTranscription(prev => prev ? prev + " " + data.text : data.text); }
    } catch { setError("Erreur de transcription."); }
    finally { setTranscribing(false); }
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        sendToGroq(blob);
      };
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "NotAllowedError") setError("PERMISSION_DENIED");
      else setError("Impossible d'accéder au micro : " + String(err));
    }
  }

  function stopRecording() {
    try { mediaRecorderRef.current?.stop(); } catch { /* ignore */ }
    setRecording(false);
  }

  function reset() {
    if (recording) stopRecording();
    setTranscription(""); setFeedback(null); setError(""); setTimer(0);
  }

  async function handleSubmit() {
    const text = transcription.trim();
    if (!text) return;
    setLoading(true); setError(""); setFeedback(null);
    try {
      const res = await fetch("/api/oral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: text, contexte, type }),
      });
      const data = await res.json();
      if (data.error === "LIMIT_REACHED") { setLimitReached(true); return; }
      if (data.error) { setError(data.error); return; }
      setFeedback(data.feedback);
      const { leveledUp } = await addXP("oral", userId);
      if (leveledUp) window.dispatchEvent(new CustomEvent("levelup"));
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  const noteColor = (n: number) =>
    n >= 16 ? "text-emerald-400" : n >= 12 ? "text-amber-400" : n >= 10 ? "text-orange-400" : "text-red-400";

  if (isPremium === null) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 size={28} className="animate-spin text-[#1a9fff]" />
    </div>
  );

  if (!isPremium) return (
    <div className="max-w-xl mx-auto px-4 py-20 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Accompagnement oral</h1>
      <p className="text-[#9ca3af] text-sm mb-6">Cette fonctionnalité est réservée aux membres Premium.</p>
      <Paywall title="Fonctionnalité Premium" description="L'accompagnement oral est réservé aux membres Premium." />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25">
          <Mic size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Accompagnement oral</h1>
          <p className="text-[#9ca3af] text-sm">Entraîne-toi à voix haute — l&apos;IA analyse ta prestation</p>
        </div>
      </div>

      <div className="space-y-4 bg-[#12121a] rounded-2xl border border-[#1e1e2e] p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Contexte</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="ex: Dom Juan, Acte II scène 2"
              value={contexte}
              onChange={e => setContexte(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Type d&apos;exercice</label>
            <select
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option>Explication de texte linéaire</option>
              <option>Entretien sur l&apos;œuvre</option>
              <option>Présentation de l&apos;œuvre personnelle</option>
              <option>Question de grammaire</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#9ca3af]">Ta prestation orale</label>
          <div className="flex items-center gap-2">
            {transcription && (
              <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#6b7280] border border-[#2a2a3e] hover:text-[#9ca3af] transition-colors">
                <RotateCcw size={11} /> Effacer
              </button>
            )}
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={transcribing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                recording
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              }`}
            >
              {recording
                ? <><MicOff size={14} />Arrêter ({fmt(timer)})</>
                : transcribing
                  ? <><Loader2 size={14} className="animate-spin" />Transcription…</>
                  : <><Mic size={14} />Parler</>
              }
            </button>
          </div>
        </div>

        {/* Fixed height wave zone */}
        <div className="h-8 flex items-center justify-center gap-1">
          {recording && (
            <>{[...Array(5)].map((_, i) => <div key={i} className="wave-bar" />)}<span className="ml-3 text-sm text-blue-400">Enregistrement… parle fort et articule bien</span></>
          )}
          {transcribing && !recording && (
            <span className="text-sm text-[#6b7280] flex items-center gap-2">
              <Loader2 size={13} className="animate-spin" />Traitement…
            </span>
          )}
        </div>

        <textarea
          className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
          rows={8}
          placeholder="Clique sur 'Parler' pour dicter, ou tape ici directement..."
          value={transcription}
          onChange={e => setTranscription(e.target.value)}
        />

        {error === "PERMISSION_DENIED" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <p className="text-amber-400 text-sm font-semibold">🔒 Accès micro refusé</p>
            <ul className="text-amber-300/80 text-xs space-y-1 list-disc list-inside">
              <li><strong>Chrome/Edge :</strong> cadenas 🔒 dans la barre → Microphone → Autoriser</li>
              <li><strong>Safari iOS :</strong> Réglages → Safari → Microphone → Autoriser</li>
            </ul>
          </div>
        )}

        {error === "INAUDIBLE" && (
          <div className="bg-[#1a0a0a] border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🎙️</span>
            <div>
              <p className="text-red-400 text-sm font-semibold">Contenu inaudible — réenregistre</p>
              <p className="text-red-300/60 text-xs">Parle plus fort et articule bien, micro proche de ta bouche</p>
            </div>
          </div>
        )}

        {limitReached && <Paywall />}
        {error && error !== "PERMISSION_DENIED" && error !== "INAUDIBLE" && !limitReached && (
          <p className="text-amber-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !transcription.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Analyse en cours..." : "Obtenir mon feedback"}
        </button>
      </div>

      {feedback && (
        <div className="space-y-5 fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00d9ff] bg-[#0a1543]/80 border border-[#1a9fff]/30 rounded-xl px-4 py-2 w-fit">
            <Zap size={14} className="text-[#FFD700]" />+100 XP · +10 CHA — Quête accomplie !
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${noteColor(feedback.note)}`}>{feedback.note}</div>
              <div className="text-[#6b7280] text-sm">/20</div>
              <div className={`mt-1 text-sm font-semibold ${noteColor(feedback.note)}`}>{feedback.mention}</div>
            </div>
            <div className="flex-1"><p className="text-[#c9c9d4] leading-relaxed">{feedback.appreciation}</p></div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Détail par critère</p>
            {feedback.criteres?.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#c9c9d4] font-medium">{c.nom}</span>
                  <span className={`font-bold ${noteColor((c.note / c.sur) * 20)}`}>{c.note}/{c.sur}</span>
                </div>
                <div className="w-full bg-[#1e1e2e] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600" style={{ width: `${(c.note / c.sur) * 100}%` }} />
                </div>
                <p className="text-xs text-[#6b7280]">{c.commentaire}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { data: feedback.points_forts, icon: <CheckCircle size={16} className="text-emerald-400" />, label: "Points forts", color: "emerald", marker: <Star size={12} className="text-emerald-400 mt-1 flex-shrink-0" /> },
              { data: feedback.axes_amelioration, icon: <AlertCircle size={16} className="text-orange-400" />, label: "À améliorer", color: "orange", marker: <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span> },
              { data: feedback.conseils, icon: <Lightbulb size={16} className="text-violet-400" />, label: "Conseils", color: "violet", marker: <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span> },
            ].map(({ data, icon, label, color, marker }) => (
              <div key={label} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-2xl p-5`}>
                <div className="flex items-center gap-2 mb-3">{icon}<p className={`text-xs font-semibold text-${color}-400 uppercase tracking-wider`}>{label}</p></div>
                <ul className="space-y-2">{data.map((p, i) => <li key={i} className="text-sm text-[#c9c9d4] flex items-start gap-2">{marker}{p}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
