"use client";
import { useState, useEffect } from "react";
import { Crown, Check, Zap, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

type PlanKey = "basic_monthly" | "basic_annual" | "premium";
type CurrentPlan = "free" | "basic" | "premium";

const BASIC_FEATURES = [
  "10 analyses linéaires / mois",
  "10 feedbacks oraux / mois",
  "20 questions sur ton œuvre / mois",
  "5 examens blancs / mois",
];

const PREMIUM_FEATURES = [
  "Analyses linéaires illimitées",
  "Feedback oral illimité",
  "Aide œuvre 24h/24 illimitée",
  "Examens blancs sans limite",
  "Nouveautés en avant-première",
];

export default function PremiumPage() {
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [current, setCurrent] = useState<CurrentPlan>("free");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/usage")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.plan) setCurrent(d.plan); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleCheckout(plan: PlanKey) {
    setLoading(plan);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(null);
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
      setLoading(null);
    }
  }

  if (checking) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <Loader2 size={28} className="text-[#FFD700] animate-spin" />
    </div>
  );

  if (current === "premium") return (
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

  const isBasic = current === "basic";

  return (
    <div className="min-h-screen bg-[#050510] px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-10">

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold">
            <Crown size={16} /> Offres
          </div>
          <h1 className="text-4xl font-black text-white">
            Choisis ton offre.<br />
            <span className="text-[#FFD700]">Réussis ton Bac.</span>
          </h1>
          <p className="text-[#a0b0d0] text-sm">
            {isBasic ? "Tu es sur l'offre Basic. Passe Premium pour tout débloquer sans limite." : "Annulable à tout moment. Paiement sécurisé par Stripe."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">

          {/* Basic mensuel */}
          <PlanCard
            title="Basic"
            price={<><span className="text-4xl font-black text-white">5€</span><span className="text-[#a0b0d0]">/mois</span></>}
            subtitle="Sans engagement"
            features={BASIC_FEATURES}
            cta={isBasic ? "Ton offre actuelle" : "Choisir Basic"}
            disabled={isBasic}
            loading={loading === "basic_monthly"}
            onClick={() => handleCheckout("basic_monthly")}
          />

          {/* Basic annuel */}
          <PlanCard
            title="Basic annuel"
            badge="-29%"
            price={<>
              <span className="text-xl font-bold text-[#6b7280] line-through mr-1">35€</span>
              <span className="text-4xl font-black text-white">25€</span>
              <span className="text-[#a0b0d0]">/an</span>
            </>}
            subtitle="Soit 2,08€/mois · offre de lancement"
            features={BASIC_FEATURES}
            cta={isBasic ? "Ton offre actuelle" : "Choisir l'annuel"}
            disabled={isBasic}
            loading={loading === "basic_annual"}
            onClick={() => handleCheckout("basic_annual")}
          />

          {/* Premium */}
          <PlanCard
            highlight
            title="Premium"
            badge="Illimité"
            price={<><span className="text-4xl font-black text-white">15€</span><span className="text-[#a0b0d0]">/mois</span></>}
            subtitle="Annulable à tout moment"
            features={PREMIUM_FEATURES}
            cta="Passer Premium"
            loading={loading === "premium"}
            onClick={() => handleCheckout("premium")}
          />
        </div>

        {error && <p className="text-center text-red-400 text-sm font-bold">{error}</p>}
        <p className="text-center text-[#6b7280] text-xs">
          Paiement sécurisé par Stripe · Codes promo acceptés au paiement
        </p>
      </div>
    </div>
  );
}

function PlanCard({ title, badge, price, subtitle, features, cta, onClick, loading, disabled, highlight }: {
  title: string;
  badge?: string;
  price: React.ReactNode;
  subtitle: string;
  features: string[];
  cta: string;
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-6 space-y-6 ${highlight
      ? "bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border-2 border-[#FFD700]/40 shadow-[0_0_40px_rgba(255,215,0,0.15)]"
      : "bg-[#0a1543]/60 border border-[#19327f]/60"}`}>
      {badge && (
        <span className={`absolute -top-3 right-5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${highlight ? "bg-[#FFD700] text-[#050a2e]" : "bg-emerald-400 text-[#050a2e]"}`}>
          {badge}
        </span>
      )}
      <div className="space-y-2">
        <p className={`text-sm font-black uppercase tracking-widest ${highlight ? "text-[#FFD700]" : "text-[#1a9fff]"}`}>{title}</p>
        <div className="flex items-baseline gap-1">{price}</div>
        <p className="text-xs text-[#6b7280]">{subtitle}</p>
      </div>

      <div className="space-y-3 flex-1">
        {features.map(label => (
          <div key={label} className="flex items-start gap-3 text-sm text-[#e8e8f0]">
            <Check size={16} className={`flex-shrink-0 mt-0.5 ${highlight ? "text-[#FFD700]" : "text-[#1a9fff]"}`} />
            {label}
          </div>
        ))}
      </div>

      <button onClick={onClick} disabled={loading || disabled}
        className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${highlight
          ? "bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] shadow-[0_0_25px_rgba(255,215,0,0.4)]"
          : "bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e]"}`}>
        {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : (
          <span className="flex items-center justify-center gap-2 text-sm">
            {highlight ? <Zap size={18} /> : <Sparkles size={16} />} {cta}
          </span>
        )}
      </button>
    </div>
  );
}
