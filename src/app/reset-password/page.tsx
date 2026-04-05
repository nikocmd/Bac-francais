"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) { setError(error.message || "Une erreur s'est produite."); return; }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-[#0a1543] border border-[#1a9fff]/30 shadow-[0_0_20px_rgba(26,159,255,0.2)]">
              <BookOpen size={28} className="text-[#1a9fff]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">Mot de passe oublié</h1>
          <p className="text-[#6b7280] text-sm">Saisis ton email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(25,50,127,0.3)] backdrop-blur">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <CheckCircle size={40} className="text-emerald-400 mx-auto" />
              <p className="text-white font-bold">Email envoyé !</p>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Vérifie ta boîte mail (et tes spams).<br />
                Le lien est valable <span className="text-white font-bold">1 heure</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                  placeholder="ton@email.com"
                />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black tracking-widest text-sm uppercase bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(26,159,255,0.4)]">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-[#6b7280] hover:text-white transition-colors">
          <ArrowLeft size={14} /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
