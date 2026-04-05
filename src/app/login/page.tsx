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
  const [loadingGoogle, setLoadingGoogle] = useState(false);
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

  async function handleGoogle() {
    setLoadingGoogle(true);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
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
          {/* Google */}
          <button onClick={handleGoogle} disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#19327f] bg-[#050a2e] hover:bg-[#0a1543] text-white font-bold text-sm transition-all disabled:opacity-50">
            {loadingGoogle ? <Loader2 size={16} className="animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#19327f]/40" />
            <span className="text-xs text-[#2a3a6e] uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-[#19327f]/40" />
          </div>

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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Mot de passe</label>
                <Link href="/reset-password" className="text-xs text-[#1a9fff] hover:text-[#00d9ff] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
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
