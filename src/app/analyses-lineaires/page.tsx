import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ANALYSES } from "@/content/analyses";

export const metadata: Metadata = {
  title: { absolute: "Analyses linéaires pour le bac de français 2027 : textes au programme" },
  description: "Analyses linéaires complètes des textes au programme du bac de français 2027 : Rimbaud (Cahier de Douai), Musset… Texte, problématique, mouvements, procédés et grammaire.",
  alternates: { canonical: "https://bacfrancaisai.fr/analyses-lineaires" },
};

export default function AnalysesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white">Analyses linéaires pour le bac de français 2027</h1>
      <p className="mt-4 text-lg text-[#a0b0d0]">
        Des analyses linéaires complètes de textes au programme, prêtes pour l&apos;oral : le texte, l&apos;introduction, la problématique, l&apos;explication mouvement par mouvement, la conclusion et une question de grammaire corrigée.
      </p>
      <ul className="mt-10 space-y-4">
        {ANALYSES.map((a) => (
          <li key={a.slug}>
            <Link href={`/analyses-lineaires/${a.slug}`} className="group block rounded-2xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#1a9fff]/50 p-6 transition-colors">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1a9fff]">{a.auteur} · {a.oeuvre}</p>
              <h2 className="mt-1 text-xl font-black text-white group-hover:text-[#00d9ff] transition-colors">{a.h1}</h2>
              <p className="mt-2 text-[#a0b0d0]">{a.problematique}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#1a9fff]">Lire l&apos;analyse <ArrowRight size={14} /></span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-12 rounded-2xl bg-[#0a1543]/60 border border-[#1a9fff]/20 p-6 text-[#c8cfe0]">
        <h2 className="text-xl font-black text-white">Ton texte n&apos;est pas dans la liste ?</h2>
        <p className="mt-2">
          Colle n&apos;importe quel extrait dans l&apos;outil d&apos;analyse : l&apos;IA te donne une analyse linéaire complète en 30 secondes. Tu peux aussi revoir{" "}
          <Link href="/guides/analyse-lineaire-methode" className="text-[#1a9fff] hover:text-[#00d9ff]">la méthode de l&apos;analyse linéaire</Link>.
        </p>
        <Link href="/analyse" className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-bold text-sm transition-colors">
          Analyser mon texte <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
