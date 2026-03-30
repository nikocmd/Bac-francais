"use client";
import { useState, useEffect } from "react";
import { Crown, Check, Zap, Loader2, BookOpen, Mic, Library, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM;
      if (!priceId) {
        setError("Configuration Stripe manquante. Vérifie les variables d'environnement Vercel.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
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
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold">
            <Crown size={16} /> Premium
          </div>
          <h1 className="text-4xl font-black text-white">
            Accès illimité.<br />
            <span className="text-[#FFD700]">Réussis ton Bac.</span>
          </h1>
          <p className="text-[#a0b0d0] text-sm">
            1 essai gratuit offert. Ensuite, Premium pour continuer.
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border-2 border-[#FFD700]/40 rounded-2xl p-8 space-y-6 shadow-[0_0_40px_rgba(255,215,0,0.15)]">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-white">9.99€</span>
              <span className="text-[#a0b0d0]">/mois</span>
            </div>
            <p className="text-xs text-[#6b7280] mt-1">Annulable à tout moment</p>
          </div>

          <div className="space-y-3">
            {[
              { icon: BookOpen, label: "Analyses linéaires illimitées" },
              { icon: Mic, label: "Feedback oral illimité" },
              { icon: Library, label: "Aide œuvre 24h/24" },
              { icon: GraduationCap, label: "Examens blancs sans limite" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-[#e8e8f0]">
                <Check size={16} className="text-[#FFD700] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>

          <button onClick={handleCheckout} disabled={loading}
            className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] transition-all disabled:opacity-50 shadow-[0_0_25px_rgba(255,215,0,0.4)]">
            {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : (
              <span className="flex items-center justify-center gap-2">
                <Zap size={20} /> Passer Premium
              </span>
            )}
          </button>

          {error && (
            <p className="text-center text-red-400 text-xs font-bold">{error}</p>
          )}
          <p className="text-center text-[#6b7280] text-xs">
            Paiement sécurisé par Stripe
          </p>
        </div>

        {/* Free vs Premium */}
        <div className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-xl p-5 space-y-3">
          <p className="text-xs font-black text-[#a0b0d0] uppercase tracking-widest">Gratuit vs Premium</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-[#6b7280] font-bold">Gratuit</p>
              <p className="text-[#6b7280]">✓ 1 utilisation offerte</p>
              <p className="text-[#2a3a6e] line-through">Analyses illimitées</p>
              <p className="text-[#2a3a6e] line-through">Oral illimité</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#FFD700] font-bold">Premium</p>
              <p className="text-[#e8e8f0]">✓ Tout illimité</p>
              <p className="text-[#e8e8f0]">✓ Toutes les features</p>
              <p className="text-[#e8e8f0]">✓ Nouveautés en avant-première</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
