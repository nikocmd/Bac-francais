import Link from "next/link";
import { getGuide } from "@/content/guides";

// Server-rendered text under the client-side tools, so search engines see real content on these URLs.
export default function ToolIntro({ titre, texte, etapes, guides }: { titre: string; texte: string; etapes: string[]; guides: string[] }) {
  return (
    <section className="max-w-3xl mx-auto px-4 pt-10 pb-16 border-t border-[#1e1e2e] text-[#a0b0d0]">
      <h2 className="text-xl font-black text-[#e8e8f0]">{titre}</h2>
      <p className="mt-3 leading-relaxed">{texte}</p>
      <ol className="mt-4 space-y-1 pl-5 list-decimal marker:text-[#1a9fff]">
        {etapes.map((e) => <li key={e}>{e}</li>)}
      </ol>
      <p className="mt-6 text-sm font-bold text-[#e8e8f0]">Guides pour aller plus loin</p>
      <ul className="mt-2 space-y-1 text-sm">
        {guides.map((slug) => {
          const g = getGuide(slug);
          return g ? <li key={slug}><Link href={`/guides/${slug}`} className="text-[#1a9fff] hover:text-[#00d9ff]">{g.title}</Link></li> : null;
        })}
      </ul>
    </section>
  );
}
