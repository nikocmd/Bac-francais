"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
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
          <h1 className="text-2xl font-black text-white tracking-wide">Connexion</h1>
          <p className="text-[#6b7280] text-sm">Accède à ton espace d&apos;entraînement</p>
        </div>

        <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(25,50,127,0.3)] backdrop-blur">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                placeholder="ton@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Mot de passe</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
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
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6b7280]">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[#1a9fff] font-bold hover:text-[#00d9ff]">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
