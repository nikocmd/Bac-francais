"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Lock } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export default function Paywall({
  title = "Essai gratuit terminé",
  description = "Tu as utilisé ton essai gratuit. Choisis une offre pour continuer : Basic dès 5€/mois ou Premium illimité.",
}: Props) {
  const [isBasic, setIsBasic] = useState(false);

  useEffect(() => {
    fetch("/api/usage")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.plan === "basic") setIsBasic(true); })
      .catch(() => {});
  }, []);

  const shownTitle = isBasic ? "Quota du mois atteint" : title;
  const shownDesc = isBasic
    ? "Tu as utilisé tout ton quota Basic pour ce mois. Il se recharge le 1er du mois, ou passe Premium pour un accès illimité."
    : description;

  return (
    <div className="bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border border-[#FFD700]/30 rounded-2xl p-8 text-center space-y-4 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
      <div className="p-4 rounded-full bg-[#FFD700]/10 w-fit mx-auto">
        <Lock size={28} className="text-[#FFD700]" />
      </div>
      <h3 className="text-xl font-black text-white">{shownTitle}</h3>
      <p className="text-[#a0b0d0] text-sm max-w-sm mx-auto">{shownDesc}</p>
      <Link href="/premium"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]">
        <Crown size={16} /> {isBasic ? "Passer Premium" : "Voir les offres"}
      </Link>
    </div>
  );
}
