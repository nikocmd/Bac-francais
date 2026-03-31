"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Send, Star, CheckCircle, AlertCircle, Lightbulb, Zap } from "lucide-react";
import { addXP } from "@/lib/gamification";
import Paywall from "@/components/Paywall";

interface Critere { nom: string; note: number; sur: number; commentaire: string; }
interface Feedback {
  note: number; mention: string; appreciation: string;
  points_forts: string[]; axes_amelioration: string[]; conseils: string[]; criteres: Critere[];
}

export default function OralPage() {
  const [transcription, setTranscription] = useState("");
  const [liveText, setLiveText] = useState("");
  const [contexte, setContexte] = useState("");
  const [type, setType] = useState("Explication de texte linéaire");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [timer, setTimer] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recogRef = useRef<any>(null);
  const activeRef = useRef(false);
  const finalRef = useRef("");
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
          setIsPremium(false);
        }
      });
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) setSupported(false);
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

  function newSession() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR || !activeRef.current) return;

    const r = new SR();
    r.lang = "fr-FR";
    r.continuous = true;
    r.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let fin = ""; let tmp = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript;
        else tmp += e.results[i][0].transcript;
      }
      if (fin) { finalRef.current += fin + " "; setTranscription(finalRef.current); }
      setLiveText(tmp);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (e: any) => {
      setLiveText("");
      if (e.error === "no-speech") return; // silence — onend relance
      activeRef.current = false;
      setRecording(false);
      if (e.error === "not-allowed") {
        setError("🔒 Permission micro refusée. Clique sur le cadenas dans la barre d'adresse de ton navigateur et autorise le microphone, puis réessaie.");
      } else if (e.error === "network") {
        setError("Pas de connexion internet — la reconnaissance vocale en nécessite une.");
      } else {
        setError("Erreur micro : " + e.error);
      }
    };

    r.onend = () => {
      setLiveText("");
      if (activeRef.current) {
        setTimeout(newSession, 150); // Chrome s'arrête sur les silences — on relance
      } else {
        setRecording(false);
      }
    };

    recogRef.current = r;
    try { r.start(); } catch { /* instance déjà démarrée */ }
  }

  function toggle() {
    if (activeRef.current) {
      activeRef.current = false;
      try { recogRef.current?.stop(); } catch { /* ignore */ }
      setRecording(false);
      setLiveText("");
    } else {
      activeRef.current = true;
      finalRef.current = "";
      setTranscription("");
      setLiveText("");
      setError("");
      setRecording(true);
      newSession();
    }
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

  if (isPremium === null) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-[#9ca3af]" /></div>;
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
            <input className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="ex: Dom Juan, Acte II scène 2" value={contexte} onChange={e => setContexte(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Type d&apos;exercice</label>
            <select className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              value={type} onChange={e => setType(e.target.value)}>
              <option>Explication de texte linéaire</option>
              <option>Entretien sur l&apos;œuvre</option>
              <option>Présentation de l&apos;œuvre personnelle</option>
              <option>Question de grammaire</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#9ca3af]">Ta prestation orale</label>
            {supported ? (
              <button onClick={toggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  recording ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"}`}>
                {recording ? <><MicOff size={14} />Arrêter ({fmt(timer)})</> : <><Mic size={14} />Parler (micro)</>}
              </button>
            ) : (
              <span className="text-xs text-[#6b7280]">Micro non supporté — tape ton texte</span>
            )}
          </div>

          <div className="h-10 flex items-center justify-center gap-1">
            {recording && <>{[...Array(5)].map((_, i) => <div key={i} className="wave-bar" />)}
              <span className="ml-3 text-sm text-blue-400">Enregistrement...</span></>}
          </div>

          <textarea
            className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            rows={8}
            placeholder={supported ? "Clique sur 'Parler' pour dicter, ou tape ici..." : "Tape ou colle ici le texte de ta prestation..."}
            value={transcription + (liveText ? " " + liveText : "")}
            onChange={e => { setTranscription(e.target.value); finalRef.current = e.target.value; }}
          />
        </div>

        {limitReached && <Paywall />}
        {error && !limitReached && <p className="text-amber-400 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={loading || !transcription.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all">
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
