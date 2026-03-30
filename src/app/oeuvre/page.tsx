"use client";
import { useState, useRef, useEffect } from "react";
import { Library, Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import { addXP } from "@/lib/gamification";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Quels sont les thèmes principaux de cette œuvre ?",
  "Donne-moi 5 questions d'entretien avec les réponses attendues",
  "Explique-moi les personnages principaux",
  "Quel est le mouvement littéraire et le contexte historique ?",
  "Quels extraits mémoriser en priorité pour l'oral ?",
];

export default function OeuvrePage() {
  const [oeuvre, setOeuvre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
    });
  }, []);

  async function sendMessage(question: string) {
    if (!question.trim()) return;
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
      if (data.error) { setError(data.error); return; }
      setMessages(prev => [...prev, { role: "assistant", content: data.reponse }]);
      await addXP("oeuvre", userId);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex-shrink-0 bg-[#12121a] rounded-2xl border border-[#1e1e2e] p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Titre de l&apos;œuvre</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="ex: Les Misérables"
              value={oeuvre}
              onChange={e => setOeuvre(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9ca3af]">Auteur</label>
            <input
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="ex: Victor Hugo"
              value={auteur}
              onChange={e => setAuteur(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-center text-[#6b7280] text-sm py-4">
              Commence par renseigner ton œuvre, puis pose ta première question 👆
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
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex gap-3">
          <input
            className="flex-1 bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Pose ta question sur l'œuvre..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
