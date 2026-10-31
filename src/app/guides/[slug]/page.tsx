import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { GUIDES, getGuide, type Guide } from "@/content/guides";

const SITE = "https://bacfrancaisai.fr";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const url = `${SITE}/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: g.title, description: g.description, url, publishedTime: g.published, modifiedTime: g.updated },
  };
}

const PROGRAMME = "oeuvres-programme-bac-francais-2027";

// Keeps "À lire aussi" focused: a work page links to its siblings, the programme page links to every work.
function relatedGuides(g: Guide): Guide[] {
  const pick = (slugs: string[]) => slugs.map((s) => getGuide(s)).filter((x): x is Guide => !!x);
  const methods = GUIDES.filter((x) => !x.kind && x.slug !== g.slug);
  const oeuvres = GUIDES.filter((x) => x.kind === "oeuvre" && x.slug !== g.slug);
  if (g.kind === "oeuvre") {
    return [...pick([PROGRAMME]), ...oeuvres.filter((x) => x.objet === g.objet), ...pick(["oral-bac-francais-2027", "dissertation-bac-francais-methode"])];
  }
  if (g.slug === PROGRAMME) return [...oeuvres, ...pick(["oral-bac-francais-2027", "dissertation-bac-francais-methode"])];
  return methods;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const url = `${SITE}/guides/${g.slug}`;
  const autres = relatedGuides(g);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.title,
        description: g.description,
        datePublished: g.published,
        dateModified: g.updated,
        inLanguage: "fr-FR",
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "BacFrançaisAI", url: SITE },
        publisher: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/guides` },
          { "@type": "ListItem", position: 3, name: g.h1, item: url },
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
        <Link href="/guides" className="hover:text-[#e8e8f0]">Guides</Link>
        <ChevronRight size={14} />
        <span className="text-[#a0b0d0] line-clamp-1">{g.h1}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black leading-tight text-white">{g.h1}</h1>
      <p className="mt-3 text-sm text-[#6b7280]">
        Mis à jour le <time dateTime={g.updated}>{new Date(g.updated).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
      </p>
      <div className="mt-8 space-y-4 text-lg leading-relaxed text-[#c8cfe0]">
        {g.intro.map((p) => <p key={p}>{p}</p>)}
      </div>

      {g.sections.map((s) => (
        <section key={s.h2} className="mt-12">
          <h2 className="text-2xl font-black text-white">{s.h2}</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-[#c8cfe0]">
            {s.p?.map((p) => <p key={p}>{p}</p>)}
            {s.list && (
              <ul className="space-y-2 pl-5 list-disc marker:text-[#1a9fff]">
                {s.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </div>
          {s.cta && (
            <Link href={s.cta.href} className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] font-bold text-sm transition-colors">
              {s.cta.label} <ArrowRight size={16} />
            </Link>
          )}
        </section>
      ))}

      <section className="mt-14">
        <h2 className="text-2xl font-black text-white">Questions fréquentes</h2>
        <div className="mt-4 space-y-3">
          {g.faq.map((f) => (
            <details key={f.q} className="rounded-xl bg-[#12121a] border border-[#1e1e2e] p-5 group">
              <summary className="cursor-pointer font-bold text-white list-none flex justify-between gap-4">{f.q}<span className="text-[#1a9fff] group-open:rotate-45 transition-transform">+</span></summary>
              <p className="mt-3 leading-relaxed text-[#c8cfe0]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className="mt-14 rounded-2xl bg-gradient-to-b from-[#FFD700]/5 to-[#0a1543]/80 border border-[#FFD700]/30 p-8 text-center">
        <p className="text-2xl font-black text-white">Prépare ton bac de français avec l&apos;IA</p>
        <p className="mt-2 text-[#a0b0d0]">Analyses linéaires, oral noté sur 20 et examens blancs chronométrés.</p>
        <Link href="/register" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] font-black text-sm uppercase tracking-widest transition-colors">
          Commencer <ArrowRight size={16} />
        </Link>
      </aside>

      <section className="mt-14">
        <h2 className="text-xl font-black text-white">À lire aussi</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {autres.map((a) => (
            <li key={a.slug}>
              <Link href={`/guides/${a.slug}`} className="block h-full rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#1a9fff]/50 p-4 text-sm font-bold text-[#e8e8f0] transition-colors">{a.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
