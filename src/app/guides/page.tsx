import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides du bac de français 2027 : méthodes et conseils",
  description: "Méthodes et conseils pour réussir le bac de français 2027 : analyse linéaire, oral, question de grammaire, procédés stylistiques et révisions avec l'IA.",
  alternates: { canonical: "https://bacfrancaisai.fr/guides" },
};

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white">Guides du bac de français 2027</h1>
      <p className="mt-4 text-lg text-[#a0b0d0]">Les méthodes pour réussir l&apos;oral et l&apos;écrit des épreuves anticipées de français, expliquées simplement.</p>
      <ul className="mt-10 space-y-4">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="group block rounded-2xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#1a9fff]/50 p-6 transition-colors">
              <h2 className="text-xl font-black text-white group-hover:text-[#00d9ff] transition-colors">{g.title}</h2>
              <p className="mt-2 text-[#a0b0d0]">{g.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#1a9fff]">Lire le guide <ArrowRight size={14} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
