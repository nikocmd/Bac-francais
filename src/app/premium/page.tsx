"use client";
import { useState, useEffect } from "react";
import { Crown, Check, Zap, Loader2, BookOpen, Mic, Library, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
          if (data?.is_premium) setIsPremium(true);
        }
      } finally { setChecking(false); }
    }
    check();
  }, []);

  async function handleCheckout() {
    setLoading(true);
    try {
      const priceId = plan === "monthly"
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch { setLoading(false); }
  }

  if (checking) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <Loader2 size={28} className="text-[#FFD700] animate-spin" />
    </div>
  );

  if (isPremium) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">👑</div>
        <h1 className="text-3xl font-black text-[#FFD700] tracking-widest uppercase">Premium Actif</h1>
        <p className="text-[#a0b0d0]">Tu as un accès illimité à toutes les fonctionnalités.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-black text-sm uppercase tracking-widest transition-all">
          Retour au dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050510] px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold">
            <Crown size={16} /> Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Débloque tout.<br />
            <span className="text-[#FFD700]">Réussis ton Bac.</span>
          </h1>
          <p className="text-[#a0b0d0] max-w-lg mx-auto">
            1 essai gratuit offert. Passe en Premium pour un accès illimité à toutes les fonctionnalités IA.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-[#0a1543]/80 border border-[#19327f]/60 rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-sm font-bold text-[#a0b0d0] uppercase tracking-widest">Gratuit</p>
              <p className="text-3xl font-black text-white mt-1">0€</p>
            </div>
            <div className="space-y-3">
              {[
                "1 utilisation IA offerte",
                "Analyse linéaire",
                "Oral feedback",
                "Aide œuvre",
                "Mode examen",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#a0b0d0]">
                  <Check size={14} className={i === 0 ? "text-[#FFD700]" : "text-[#2a3a6e]"} />
                  <span className={i > 0 ? "line-through text-[#2a3a6e]" : ""}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border-2 border-[#FFD700]/40 rounded-2xl p-6 space-y-5 relative shadow-[0_0_30px_rgba(255,215,0,0.15)]">
            <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-[#FFD700] text-[#050a2e] text-xs font-black uppercase tracking-widest">
              Recommandé
            </div>
            <div>
              <p className="text-sm font-bold text-[#FFD700] uppercase tracking-widest">Premium</p>
              <div className="flex items-baseline gap-1 mt-1">
                {plan === "yearly" ? (
                  <>
                    <span className="text-3xl font-black text-white">29.99€</span>
                    <span className="text-[#a0b0d0] text-sm">/an</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">-50%</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-black text-white">4.99€</span>
                    <span className="text-[#a0b0d0] text-sm">/mois</span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Utilisations IA illimitées",
                "Analyses linéaires complètes",
                "Feedback oral détaillé",
                "Aide œuvre personnelle",
                "Mode examen simulation",
                "Nouvelles fonctionnalités en avant-première",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#e8e8f0]">
                  <Check size={14} className="text-[#FFD700]" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan toggle + CTA */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 bg-[#0a1543]/80 border border-[#19327f]/60 rounded-xl p-1.5">
            <button onClick={() => setPlan("monthly")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                plan === "monthly"
                  ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/40"
                  : "text-[#6b7280] hover:text-[#a0b0d0]"
              }`}>
              Mensuel · 4.99€
            </button>
            <button onClick={() => setPlan("yearly")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                plan === "yearly"
                  ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/40"
                  : "text-[#6b7280] hover:text-[#a0b0d0]"
              }`}>
              Annuel · 29.99€
            </button>
          </div>

          <button onClick={handleCheckout} disabled={loading}
            className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
            {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : (
              <span className="flex items-center justify-center gap-2">
                <Zap size={20} /> Passer Premium
              </span>
            )}
          </button>

          <p className="text-center text-[#6b7280] text-xs">
            Paiement sécurisé par Stripe · Annulable à tout moment
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: BookOpen, label: "Analyses illimitées", color: "#a78bfa" },
            { icon: Mic, label: "Oral illimité", color: "#38bdf8" },
            { icon: Library, label: "Aide œuvre 24/7", color: "#34d399" },
            { icon: GraduationCap, label: "Examens sans limite", color: "#fbbf24" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-xl p-4 text-center space-y-2">
              <Icon size={24} style={{ color }} className="mx-auto" />
              <p className="text-xs text-[#a0b0d0] font-bold">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
