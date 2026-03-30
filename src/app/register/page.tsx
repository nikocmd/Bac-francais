"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Mot de passe trop court (6 caractères min)."); return; }
    setLoading(true);
    setError("");
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
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
          <h1 className="text-2xl font-black text-white tracking-wide">Créer un compte</h1>
          <p className="text-[#6b7280] text-sm">Commence ton aventure littéraire</p>
        </div>

        <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(25,50,127,0.3)] backdrop-blur">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Pseudo</label>
              <input
                type="text" required value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
                placeholder="ton pseudo"
              />
            </div>
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
                placeholder="6 caractères minimum"
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
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6b7280]">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#1a9fff] font-bold hover:text-[#00d9ff]">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
