"use client";
import Link from "next/link";
import { Crown, Lock } from "lucide-react";

export default function Paywall() {
  return (
    <div className="bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border border-[#FFD700]/30 rounded-2xl p-8 text-center space-y-4 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
      <div className="p-4 rounded-full bg-[#FFD700]/10 w-fit mx-auto">
        <Lock size={28} className="text-[#FFD700]" />
      </div>
      <h3 className="text-xl font-black text-white">Essai gratuit terminé</h3>
      <p className="text-[#a0b0d0] text-sm max-w-sm mx-auto">
        Tu as utilisé ton essai gratuit. Passe en Premium pour un accès illimité à toutes les fonctionnalités IA.
      </p>
      <Link href="/premium"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]">
        <Crown size={16} /> Passer Premium
      </Link>
    </div>
  );
}
