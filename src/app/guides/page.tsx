import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES, type Guide } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides du bac de français 2027 : méthodes et conseils",
  description: "Méthodes et fiches pour réussir le bac de français 2027 : analyse linéaire, oral, dissertation, grammaire et fiches des 12 œuvres au programme.",
  alternates: { canonical: "https://bacfrancaisai.fr/guides" },
};

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white">Guides du bac de français 2027</h1>
      <p className="mt-4 text-lg text-[#a0b0d0]">Les méthodes pour réussir l&apos;oral et l&apos;écrit des épreuves anticipées de français, expliquées simplement.</p>
      <h2 className="mt-10 text-2xl font-black text-white">Méthodes</h2>
      <GuideList guides={GUIDES.filter((g) => !g.kind)} />
      <h2 className="mt-12 text-2xl font-black text-white">Fiches des œuvres au programme 2027</h2>
      <GuideList guides={GUIDES.filter((g) => g.kind === "oeuvre")} />
    </div>
  );
}

function GuideList({ guides }: { guides: Guide[] }) {
  return (
    <ul className="mt-4 space-y-4">
      {guides.map((g) => (
        <li key={g.slug}>
          <Link href={`/guides/${g.slug}`} className="group block rounded-2xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#1a9fff]/50 p-6 transition-colors">
            <h3 className="text-xl font-black text-white group-hover:text-[#00d9ff] transition-colors">{g.title}</h3>
            <p className="mt-2 text-[#a0b0d0]">{g.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#1a9fff]">Lire le guide <ArrowRight size={14} /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
