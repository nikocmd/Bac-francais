import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Mic, Library, GraduationCap, ArrowRight, CheckCircle, Crown, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const VITRINE_ANALYSE = {
  texte: `C'est un trou de verdure où chante une rivière,
Accrochant follement aux herbes des haillons
D'argent ; où le soleil, de la montagne fière,
Luit : c'est un petit val qui mousse de rayons.

Un soldat jeune, bouche ouverte, tête nue,
Et la nuque baignant dans le frais cresson bleu,
Dort ; il est étendu dans l'herbe sous la nue,
Pâle dans son lit vert où la lumière pleut.

Les pieds dans les glaïeuls, il dort. Souriant comme
Sourirait un enfant malade, il fait un somme :
Nature, berce-le chaudement : il a froid.

Les parfums ne font pas frissonner sa narine ;
Il dort dans le soleil, la main sur sa poitrine,
Tranquille. Il a deux trous rouges au côté droit.`,
  problematique: "Comment Rimbaud utilise-t-il l'harmonie trompeuse du cadre naturel pour dénoncer les horreurs de la guerre ?",
  mouvements: [
    {
      numero: 1,
      titre: "Un tableau idyllique de la nature",
      lignes: "v. 1–4",
      procedes: [
        { procede: "Personnification", exemple: "où chante une rivière", effet: "La nature est vivante, accueillante — crée une atmosphère de paix trompeuse." },
        { procede: "Accumulation de lumière", exemple: "mousse de rayons", effet: "L'excès de lumière prépare l'ironie finale : le soldat est au soleil mais a froid." },
      ],
    },
    {
      numero: 2,
      titre: "Le soldat endormi — portrait ambigu",
      lignes: "v. 5–11",
      procedes: [
        { procede: "Euphémisme / litote", exemple: "Dort ; il est étendu", effet: "Le mot 'dort' retarde la révélation de la mort, entretient l'illusion." },
        { procede: "Comparaison", exemple: "Souriant comme sourirait un enfant malade", effet: "Rapproche la mort de l'innocence, suscite la pitié et accentue l'horreur." },
      ],
    },
    {
      numero: 3,
      titre: "La chute — la révélation brutale",
      lignes: "v. 12–14",
      procedes: [
        { procede: "Rupture de ton", exemple: "Il a deux trous rouges au côté droit", effet: "Brutalité du langage clinique après la douceur poétique — effet de choc maximal." },
        { procede: "Ironie dramatique", exemple: "Tranquille.", effet: "Le mot anodin précède immédiatement la blessure mortelle — dénonciation de la guerre." },
      ],
    },
  ],
  conclusion: "Rimbaud construit un piège poétique : le lecteur est bercé par une nature paradisiaque pour mieux ressentir le choc de la mort violente. Ce sonnet est un réquisitoire contre la guerre franco-prussienne de 1870.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
    if (profile?.is_premium) redirect("/dashboard");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-0">

      {/* ── HERO ── */}
      <section className="py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a9fff]/10 border border-[#1a9fff]/30 text-[#00d9ff] text-xs font-bold uppercase tracking-widest">
          <Zap size={12} /> Simulation officielle · Barème BOEN 2024
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Décroche ta mention<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9fff] to-[#a78bfa]">au Bac de Français</span>
        </h1>

        <p className="text-lg text-[#9ca3af] max-w-xl mx-auto">
          L&apos;IA qui analyse tes textes, simule le jury et t&apos;entraîne à l&apos;oral — basée sur les vrais critères BOEN.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link href="/premium"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)]">
            <Crown size={16} /> Passer Premium
          </Link>
          <Link href="/register"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0a1543] border border-[#19327f] text-[#a0b0d0] font-bold text-sm hover:border-[#1a9fff]/50 hover:text-white transition-all">
            Créer un compte <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── VITRINE ANALYSE ── */}
      <section className="py-8 space-y-5">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs font-bold text-[#a78bfa] uppercase tracking-widest">✦ Exemple d&apos;analyse</p>
          <h2 className="text-2xl font-black text-white">Le Dormeur du Val — Rimbaud (1870)</h2>
          <p className="text-[#6b7280] text-sm">Voici ce que l&apos;IA génère en quelques secondes pour tes textes</p>
        </div>

        <div className="bg-[#0a1543]/60 border border-[#19327f]/40 rounded-2xl p-5">
          <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-3">Texte original</p>
          <p className="text-sm text-[#a0b0d0] leading-relaxed whitespace-pre-line font-mono">{VITRINE_ANALYSE.texte}</p>
        </div>

        <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Problématique générée</p>
          <p className="text-[#e8e8f0] font-medium text-base italic">&ldquo;{VITRINE_ANALYSE.problematique}&rdquo;</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Mouvements du texte</p>
          {VITRINE_ANALYSE.mouvements.map((mvt) => (
            <div key={mvt.numero} className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                  {mvt.numero}
                </span>
                <div>
                  <p className="font-semibold text-[#e8e8f0] text-sm">{mvt.titre}</p>
                  <p className="text-xs text-[#6b7280]">{mvt.lignes}</p>
                </div>
              </div>
              <div className="px-4 pb-4 border-t border-[#1e1e2e] space-y-3 pt-3">
                {mvt.procedes.map((p, j) => (
                  <div key={j} className="grid md:grid-cols-3 gap-3">
                    <div className="bg-[#0a0a0f] rounded-xl p-3">
                      <p className="text-xs font-semibold text-violet-400 mb-1">Procédé</p>
                      <p className="text-sm text-[#e8e8f0] font-medium">{p.procede}</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-400 mb-1">Citation</p>
                      <p className="text-sm text-[#e8e8f0] italic">&ldquo;{p.exemple}&rdquo;</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-400 mb-1">Effet</p>
                      <p className="text-sm text-[#c9c9d4]">{p.effet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
          <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-3">Conclusion</p>
          <p className="text-[#c9c9d4] text-sm leading-relaxed">{VITRINE_ANALYSE.conclusion}</p>
        </div>

        <div className="text-center pt-2">
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <BookOpen size={16} /> Générer mes analyses
          </Link>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">4 outils. 1 seul objectif.</h2>
          <p className="text-[#6b7280] text-sm">Tout ce qu&apos;il te faut pour l&apos;oral du Bac de Français</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              href: "/analyse",
              icon: BookOpen,
              color: "#a78bfa",
              bg: "border-violet-500/20 hover:border-violet-500/40",
              title: "Analyse linéaire",
              desc: "Colle ton texte → analyse complète en mouvements, procédés stylistiques et citations. Prête pour l'oral en 30 secondes.",
              tag: "Le plus utilisé",
              tagColor: "bg-violet-500/20 text-violet-300",
            },
            {
              href: "/examen",
              icon: GraduationCap,
              color: "#fbbf24",
              bg: "border-amber-500/20 hover:border-amber-500/40",
              title: "Mode examen",
              desc: "Simule les conditions réelles du Bac. L'IA joue le jury et te note selon le barème BOEN officiel.",
              tag: "Barème BOEN",
              tagColor: "bg-amber-500/20 text-amber-300",
            },
            {
              href: "/oral",
              icon: Mic,
              color: "#38bdf8",
              bg: "border-cyan-500/20 hover:border-cyan-500/40",
              title: "Accompagnement oral",
              desc: "Entraîne-toi à voix haute. L'IA transcrit et te donne un feedback précis sur le fond et la forme.",
              tag: "Feedback instantané",
              tagColor: "bg-cyan-500/20 text-cyan-300",
            },
            {
              href: "/oeuvre",
              icon: Library,
              color: "#34d399",
              bg: "border-emerald-500/20 hover:border-emerald-500/40",
              title: "Œuvre personnelle",
              desc: "Résumés, thèmes, personnages, questions d'entretien — l'IA t'accompagne sur ton œuvre au programme.",
              tag: "Entretien jury",
              tagColor: "bg-emerald-500/20 text-emerald-300",
            },
          ].map(({ href, icon: Icon, color, bg, title, desc, tag, tagColor }) => (
            <Link key={href} href={href}
              className={`group p-6 rounded-2xl bg-[#0a1543]/60 border ${bg} transition-all duration-200 block hover:bg-[#0a1543]/80`}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ background: `${color}18` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
              </div>
              <h3 className="text-base font-black text-white mb-2 group-hover:text-[#00d9ff] transition-colors">{title}</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-8 pb-20 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Simple et transparent</h2>
          <p className="text-[#6b7280] text-sm">Pas d&apos;abonnement caché. Annulable à tout moment.</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Premium only */}
          <div className="bg-gradient-to-b from-[#FFD700]/8 to-[#0a1543]/80 border-2 border-[#FFD700]/50 rounded-2xl p-7 space-y-5 relative shadow-[0_0_40px_rgba(255,215,0,0.12)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD700] text-[#050a2e] text-xs font-black uppercase tracking-widest whitespace-nowrap">
              👑 Accès complet
            </div>
            <div>
              <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-2">Premium</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-white">9.99€</p>
                <p className="text-[#6b7280] text-sm">/mois</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Analyses linéaires illimitées",
                "Feedback oral illimité",
                "Mode examen sans limite",
                "Aide œuvre 24h/24",
                "Nouvelles features en avant-première",
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#e8e8f0]">
                  <CheckCircle size={14} className="text-[#FFD700] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/premium"
              className="block text-center py-3 rounded-xl bg-[#FFD700] hover:bg-[#ffe44d] text-[#050a2e] font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              Passer Premium
            </Link>
            <p className="text-center text-xs text-[#6b7280]">Annulable à tout moment · Paiement sécurisé</p>
          </div>
        </div>
      </section>

    </div>
  );
}
