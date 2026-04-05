"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, CheckCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setError("Erreur lors de la mise à jour. Le lien a peut-être expiré."); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
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
          <h1 className="text-2xl font-black text-white tracking-wide">Nouveau mot de passe</h1>
          <p className="text-[#6b7280] text-sm">Choisis un nouveau mot de passe sécurisé</p>
        </div>

        <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(25,50,127,0.3)] backdrop-blur">
          {done ? (
            <div className="text-center space-y-4 py-2">
              <CheckCircle size={40} className="text-emerald-400 mx-auto" />
              <p className="text-white font-bold">Mot de passe mis à jour !</p>
              <p className="text-[#6b7280] text-sm">Redirection vers la connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Nouveau mot de passe</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                  placeholder="Minimum 8 caractères"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Confirmer</label>
                <input
                  type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                  placeholder="••••••••"
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
                {loading ? "Mise à jour..." : "Changer le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
