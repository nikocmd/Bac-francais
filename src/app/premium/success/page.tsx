"use client";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-7xl">🎉</div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold">
            <Crown size={16} /> Premium activé
          </div>
          <h1 className="text-3xl font-black text-white">Bienvenue dans le Premium !</h1>
          <p className="text-[#a0b0d0]">
            Tu as maintenant un accès illimité à toutes les fonctionnalités IA.
            Prêt à décrocher une mention ?
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/analyse" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]">
            Commencer une analyse <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#0a1543] border border-[#19327f] text-[#a0b0d0] hover:text-white transition-all">
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
