import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-black text-[#1a9fff]/20 select-none">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Page introuvable</h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(26,159,255,0.4)]">
          <BookOpen size={16} /> Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
