import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ANALYSES, getAnalyse } from "@/content/analyses";
import { getGuide } from "@/content/guides";

const SITE = "https://bacfrancaisai.fr";
const CARD = "block h-full rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#1a9fff]/50 p-4 text-sm font-bold text-[#e8e8f0] transition-colors";
const BTN = "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-bold text-sm transition-colors";

export const dynamicParams = false;

export function generateStaticParams() {
  return ANALYSES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAnalyse(slug);
  if (!a) return {};
  const url = `${SITE}/analyses-lineaires/${a.slug}`;
  return {
    title: { absolute: a.title },
    description: a.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: a.title, description: a.description, url, publishedTime: a.published, modifiedTime: a.updated },
  };
}

export default async function AnalysePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAnalyse(slug);
  if (!a) notFound();
  const url = `${SITE}/analyses-lineaires/${a.slug}`;
  const fiche = getGuide(a.oeuvreGuide);
  const methode = getGuide("analyse-lineaire-methode");
  const autres = ANALYSES.filter((x) => x.slug !== a.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.updated,
        inLanguage: "fr-FR",
        mainEntityOfPage: url,
        about: { "@type": "CreativeWork", name: a.reference, author: { "@type": "Person", name: a.auteur } },
        author: { "@type": "Organization", name: "BacFrançaisAI", url: SITE },
        publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
          { "@type": "ListItem", position: 2, name: "Analyses linéaires", item: `${SITE}/analyses-lineaires` },
          { "@type": "ListItem", position: 3, name: a.h1, item: url },
        ],
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1 text-sm text-[#6b7280] mb-8">
        <Link href="/" className="hover:text-[#e8e8f0]">Accueil</Link>
        <ChevronRight size={14} />
        <Link href="/analyses-lineaires" className="hover:text-[#e8e8f0]">Analyses linéaires</Link>
        <ChevronRight size={14} />
        <span className="text-[#a0b0d0] line-clamp-1">{a.h1}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black leading-tight text-white">{a.h1}</h1>
      <p className="mt-3 text-sm text-[#6b7280]">
        {a.auteur}, {a.oeuvre} · Mis à jour le <time dateTime={a.updated}>{new Date(a.updated).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
      </p>

      <nav aria-label="Sommaire" className="mt-8 rounded-2xl bg-[#12121a] border border-[#1e1e2e] p-5 text-sm">
        <p className="font-bold text-white">Sommaire</p>
        <ol className="mt-2 space-y-1 pl-5 list-decimal marker:text-[#1a9fff] text-[#a0b0d0]">
          <li><a href="#texte" className="hover:text-[#00d9ff]">Le texte</a></li>
          <li><a href="#introduction" className="hover:text-[#00d9ff]">Introduction et problématique</a></li>
          <li><a href="#analyse" className="hover:text-[#00d9ff]">Analyse linéaire, mouvement par mouvement</a></li>
          <li><a href="#conclusion" className="hover:text-[#00d9ff]">Conclusion</a></li>
          <li><a href="#grammaire" className="hover:text-[#00d9ff]">Question de grammaire</a></li>
        </ol>
      </nav>

      <section id="texte" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-black text-white">Le texte</h2>
        <blockquote className={`mt-4 rounded-2xl bg-[#0a1543]/60 border border-[#1a9fff]/20 p-6 text-[#e8e8f0] leading-relaxed ${a.vers ? "whitespace-pre-line" : ""}`}>
          {a.texte}
        </blockquote>
        <p className="mt-2 text-sm text-[#6b7280]">{a.auteur}, {a.reference}.</p>
      </section>

      <section id="introduction" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-black text-white">Introduction</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-[#c8cfe0]">
          {a.intro.map((p) => <p key={p}>{p}</p>)}
        </div>
        <p className="mt-6 rounded-xl border-l-4 border-[#FFD700] bg-[#FFD700]/5 p-4 text-[#e8e8f0]">
          <strong className="text-[#FFD700]">Problématique : </strong>{a.problematique}
        </p>
        <p className="mt-6 font-bold text-white">Mouvements du texte</p>
        <ol className="mt-2 space-y-1 pl-5 list-decimal marker:text-[#1a9fff] text-[#c8cfe0]">
          {a.mouvements.map((m) => <li key={m.titre}>{m.titre.replace(/^[^:]+: /, "")} ({m.lignes})</li>)}
        </ol>
      </section>

      <section id="analyse" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-black text-white">Analyse linéaire</h2>
        {a.mouvements.map((m) => (
          <div key={m.titre} className="mt-8">
            <h3 className="text-xl font-black text-[#00d9ff]">{m.titre} <span className="text-sm font-bold text-[#6b7280]">({m.lignes})</span></h3>
            <ul className="mt-4 space-y-4">
              {m.points.map((p) => (
                <li key={p.cite} className="leading-relaxed text-[#c8cfe0]">
                  <strong className="text-white">{p.cite}</strong> : {p.analyse}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link href="/analyse" className={`mt-8 ${BTN}`}>
          Obtenir l&apos;analyse linéaire d&apos;un autre texte avec l&apos;IA <ArrowRight size={16} />
        </Link>
      </section>

      <section id="conclusion" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-black text-white">Conclusion</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-[#c8cfe0]">
          {a.conclusion.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section id="grammaire" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-black text-white">Question de grammaire possible</h2>
        <p className="mt-4 font-bold text-[#e8e8f0]">{a.grammaire.question}</p>
        <p className="mt-3 leading-relaxed text-[#c8cfe0]">{a.grammaire.reponse}</p>
        <Link href="/oral" className={`mt-6 ${BTN}`}>
          S&apos;entraîner à l&apos;oral avec le jury IA <ArrowRight size={16} />
        </Link>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-black text-white">Questions fréquentes</h2>
        <div className="mt-4 space-y-3">
          {a.faq.map((f) => (
            <details key={f.q} className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-5 group">
              <summary className="cursor-pointer font-bold text-white list-none flex justify-between gap-4">{f.q}<span className="text-[#1a9fff] group-open:rotate-45 transition-transform">+</span></summary>
              <p className="mt-3 leading-relaxed text-[#c8cfe0]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className="mt-14 rounded-2xl bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border border-[#FFD700]/30 p-8 text-center">
        <p className="text-2xl font-black text-white">Ton texte n&apos;est pas dans la liste ?</p>
        <p className="mt-2 text-[#a0b0d0]">Colle n&apos;importe quel extrait : l&apos;IA te donne son analyse linéaire complète en 30 secondes.</p>
        <Link href="/register" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] font-black text-sm uppercase tracking-widest transition-colors">
          Essayer <ArrowRight size={16} />
        </Link>
      </aside>

      <section className="mt-14">
        <h2 className="text-xl font-black text-white">À lire aussi</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {fiche && <li><Link href={`/guides/${fiche.slug}`} className={CARD}>{fiche.title}</Link></li>}
          {methode && <li><Link href={`/guides/${methode.slug}`} className={CARD}>{methode.title}</Link></li>}
          {autres.map((x) => (
            <li key={x.slug}><Link href={`/analyses-lineaires/${x.slug}`} className={CARD}>{x.h1}</Link></li>
          ))}
        </ul>
      </section>
    </article>
  );
}
