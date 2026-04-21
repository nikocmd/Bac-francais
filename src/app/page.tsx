import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Mic, Library, GraduationCap, ArrowRight, CheckCircle, Crown, Zap } from "lucide-react";
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
  introduction: {
    situation: "Arthur Rimbaud écrit ce sonnet en 1870, à l'âge de 16 ans, en pleine guerre franco-prussienne. Ce texte appartient à ses premières œuvres réalistes, marquées par un engagement politique fort contre la violence militaire.",
    mouvement_general: "Le poème se présente d'abord comme un tableau bucolique et serein — un val verdoyant, un soldat qui repose — avant de basculer brutalement dans l'horreur de la mort. C'est ce renversement qui constitue tout le génie du texte.",
    problematique: "Comment Rimbaud utilise-t-il l'harmonie trompeuse du cadre naturel pour dénoncer les horreurs de la guerre ?",
    plan: ["Un tableau idyllique de la nature (v. 1–4)", "Le portrait ambigu du soldat endormi (v. 5–11)", "La révélation brutale de la mort (v. 12–14)"],
  },
  mouvements: [
    {
      numero: 1,
      titre: "Un tableau idyllique de la nature",
      lignes: "v. 1–4",
      intro: "Le premier quatrain installe un décor champêtre à la beauté presque excessive. Rimbaud mobilise toutes les ressources du lyrisme pour créer une illusion de paradis.",
      procedes: [
        { procede: "Personnification", exemple: "où chante une rivière", effet: "La nature est dotée d'une voix, elle semble heureuse et vivante — cette animation crée une atmosphère de paix qui sera cruellement démentie." },
        { procede: "Accumulation sensorielle", exemple: "mousse de rayons / haillons d'argent", effet: "L'accumulation d'éléments lumineux et sonores sature l'espace de beauté, instaurant une douceur trompeuse qui prépare le lecteur au piège final." },
        { procede: "Hyperbole / excès de lumière", exemple: "le soleil, de la montagne fière, / Luit", effet: "Le soleil est 'fier', presque souverain — son insistance est ironique : il brille sur un mort. L'abondance de lumière souligne par contraste le froid du soldat." },
        { procede: "Métaphore filée", exemple: "un trou de verdure", effet: "L'image du 'trou' est ambiguë : cocon protecteur ou fosse ? Ce mot creuse déjà, dès le premier vers, une anticipation inconsciente de la mort." },
        { procede: "Harmonie imitative", exemple: "chante une rivière / mousse de rayons", effet: "Les sonorités douces (nasales, fricatives) et les termes évoquant légèreté et mouvement créent une musicalité apaisante qui endort la méfiance du lecteur." },
      ],
    },
    {
      numero: 2,
      titre: "Le portrait ambigu du soldat endormi",
      lignes: "v. 5–11",
      intro: "Les deux quatrains suivants introduisent le personnage central : un soldat jeune, immobile. Rimbaud multiplie les indices de mort sans jamais le nommer, entretenant délibérément l'ambiguïté entre sommeil et trépas.",
      procedes: [
        { procede: "Euphémisme / litote", exemple: "Dort ; il est étendu dans l'herbe", effet: "Le verbe 'dort', répété trois fois dans le poème, est un euphémisme pour 'est mort'. Cette litote retarde la révélation et maintient le lecteur dans l'illusion." },
        { procede: "Comparaison pathétique", exemple: "Souriant comme sourirait un enfant malade", effet: "Le rapprochement soldat/enfant malade suscite la pitié et l'attendrissement. L'image de l'enfant dénonce l'absurdité de mourir si jeune à la guerre." },
        { procede: "Apostrophe à la nature", exemple: "Nature, berce-le chaudement : il a froid", effet: "Rimbaud interpelle directement la Nature comme une mère — ironie poignante car elle ne peut rien pour un mort. 'Il a froid' est un indice implacable : on ne dit pas d'un dormant qu'il a froid." },
        { procede: "Oxymore", exemple: "Pâle dans son lit vert", effet: "Le lit est à la fois tombe (vert de la nature) et berceau (douceur du mot 'lit'). La pâleur du visage tranche avec la vivacité du cadre — l'oxymore signale que quelque chose cloche." },
        { procede: "Enjambement / rythme brisé", exemple: "Souriant comme / Sourirait un enfant", effet: "La coupe entre les deux tercets crée une suspension du sens. Le lecteur retient son souffle — comme si Rimbaud hésitait à prononcer ce qu'il voit." },
      ],
    },
    {
      numero: 3,
      titre: "La révélation brutale de la mort",
      lignes: "v. 12–14",
      intro: "Le dernier tercet opère la rupture fondamentale du poème. Après onze vers de beauté et d'illusion, Rimbaud brise le rêve en deux mots. La chute est d'autant plus violente que le piège était bien tendu.",
      procedes: [
        { procede: "Rupture de ton (chute)", exemple: "Il a deux trous rouges au côté droit", effet: "Le vocabulaire clinique, prosaïque, tranche avec la douceur poétique. 'Deux trous rouges' — aucun mot ne cherche à adoucir : c'est la mort crue, réaliste, militaire. L'effet de choc est maximal." },
        { procede: "Ironie dramatique", exemple: "Tranquille. Il a deux trous rouges", effet: "L'adjectif 'Tranquille', placé juste avant la révélation, crée une ironie mordante : le mot suggère la paix, le repos — mais c'est la tranquillité de la mort." },
        { procede: "Zeugme / rupture syntaxique", exemple: "la main sur sa poitrine, / Tranquille.", effet: "La phrase se clôt sur 'Tranquille.' — point final, isolé. Cette ponctuation abrupte mime l'arrêt brutal de la vie et laisse le lecteur sans recours face à l'horreur." },
        { procede: "Négation restrictive", exemple: "Les parfums ne font pas frissonner sa narine", effet: "La tournure négative dit ce que le corps ne fait plus : frissonner. Elle transforme une action ordinaire en preuve de mort, avec une froideur clinique qui renforce l'horreur." },
        { procede: "Antithèse lumière / froid", exemple: "Il dort dans le soleil […] il a froid", effet: "Le paradoxe final est absolu : le soleil brille, mais le soldat a froid. L'antithèse concentre toute l'ironie du poème — la nature indifférente éclaire un cadavre sans le réchauffer." },
      ],
    },
  ],
  conclusion: {
    bilan: "Rimbaud construit un véritable piège poétique : le lecteur est bercé par onze vers d'une nature paradisiaque, chaleureuse et lumineuse, pour être frappé de plein fouet par la réalité de la guerre au dernier vers. La beauté du cadre naturel n'est pas une consolation, c'est une accusation.",
    portee: "Ce sonnet est un réquisitoire politique contre la guerre franco-prussienne de 1870. En choisissant d'écrire sur un soldat inconnu — sans nom, sans grade — Rimbaud universalise la tragédie. Le 'dormeur du val' pourrait être n'importe quel jeune homme sacrifié.",
    ouverture: "On peut rapprocher ce texte de 'Dulce et Decorum Est' de Wilfred Owen (1917), qui utilise le même procédé de dénonciation ironique de la guerre — preuve que cette esthétique de la désillusion poétique traverse les époques et les langues.",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Tout utilisateur connecté → dashboard (la landing est pour les visiteurs)
  if (user) redirect("/dashboard");

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-0">

      {/* ── HERO ── */}
      <section className="py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a9fff]/10 border border-[#1a9fff]/30 text-[#00d9ff] text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">
          <Zap size={12} className="flex-shrink-0" /> Simulation officielle · Barème BOEN 2024
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
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
      <section className="py-8">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs font-bold text-[#a78bfa] uppercase tracking-widest">✦ Exemple d&apos;analyse</p>
          <h2 className="text-3xl font-black text-white">Vois ce que l&apos;IA génère pour toi</h2>
          <p className="text-[#6b7280] text-sm">Analyse complète d&apos;un texte en quelques secondes, prête pour l&apos;oral</p>
        </div>

        <div className="relative rounded-3xl border border-violet-500/20 bg-[#0c0c18] shadow-[0_0_80px_rgba(139,92,246,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e1e2e] bg-[#0a0a14]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6b7280] font-mono">
              <BookOpen size={12} className="text-violet-400" />
              Le Dormeur du Val — Rimbaud · 1870
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">IA</span>
          </div>

          <div className="p-5 md:p-7 space-y-6">
            {/* Poème + Intro */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#07070f] rounded-2xl border border-[#1a1a2e] p-5">
                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Texte original</p>
                <div className="space-y-0.5 font-mono text-sm">
                  {VITRINE_ANALYSE.texte.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-3 group">
                      <span className="w-5 flex-shrink-0 text-right text-[10px] text-[#3a3a4e] group-hover:text-violet-500 leading-6 select-none">
                        {line.trim() !== "" ? i + 1 : ""}
                      </span>
                      <span className={`leading-6 ${line.trim() === "" ? "h-3 block" : "text-[#9ca3af] group-hover:text-[#c4c4d4]"} transition-colors`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: "Mouvements", value: "3" }, { label: "Procédés", value: "15" }, { label: "~10 min", value: "oral" }].map(({ label, value }) => (
                    <div key={label} className="bg-[#07070f] rounded-xl border border-[#1a1a2e] p-3 text-center">
                      <p className="text-lg font-black text-white">{value}</p>
                      <p className="text-[10px] text-[#6b7280] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#07070f] rounded-2xl border border-[#1a1a2e] p-4">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /><p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Situation du texte</p></div>
                  <p className="text-[#9ca3af] text-xs leading-relaxed">{VITRINE_ANALYSE.introduction.situation}</p>
                </div>
                <div className="bg-[#07070f] rounded-2xl border border-[#1a1a2e] p-4">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /><p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Mouvement général</p></div>
                  <p className="text-[#9ca3af] text-xs leading-relaxed">{VITRINE_ANALYSE.introduction.mouvement_general}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 to-violet-900/10 rounded-2xl border border-violet-500/25 p-4">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /><p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Problématique</p></div>
                  <p className="text-[#e8e8f0] font-semibold text-sm leading-relaxed italic">&ldquo;{VITRINE_ANALYSE.introduction.problematique}&rdquo;</p>
                </div>
                <div className="bg-[#07070f] rounded-2xl border border-[#1a1a2e] p-4">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /><p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Annonce du plan</p></div>
                  <div className="space-y-1.5">
                    {VITRINE_ANALYSE.introduction.plan.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-violet-600/60 text-white text-[9px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                        <p className="text-xs text-[#9ca3af]">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mouvements */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Mouvements du texte</p>
              {VITRINE_ANALYSE.mouvements.map((mvt) => (
                <div key={mvt.numero} className="rounded-2xl border border-[#1a1a2e] overflow-hidden bg-[#07070f]">
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-[#0d0d1a]">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/80 text-white text-[11px] font-black flex items-center justify-center">{mvt.numero}</span>
                    <p className="font-bold text-[#e8e8f0] text-sm flex-1">{mvt.titre}</p>
                    <span className="text-xs text-[#6b7280] font-mono bg-[#0a0a14] px-2 py-0.5 rounded-md border border-[#1e1e2e]">{mvt.lignes}</span>
                  </div>
                  <div className="px-5 py-3 border-b border-[#1a1a2e]">
                    <p className="text-xs text-[#6b7280] leading-relaxed italic">{mvt.intro}</p>
                  </div>
                  <div className="divide-y divide-[#1a1a2e]">
                    {mvt.procedes.map((p, j) => (
                      <div key={j}>
                        <div className="md:hidden px-4 py-3 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Procédé</span>
                            <span className="text-sm text-[#e8e8f0] font-semibold">{p.procede}</span>
                            <span className="text-[#c9a96e] italic text-xs">&ldquo;{p.exemple}&rdquo;</span>
                          </div>
                          <p className="text-xs text-[#9ca3af] leading-relaxed pl-1">{p.effet}</p>
                        </div>
                        <div className="hidden md:grid md:grid-cols-3 divide-x divide-[#1a1a2e]">
                          <div className="px-4 py-3.5 flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-violet-400 mt-2" />
                            <div><p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">Procédé</p><p className="text-sm text-[#e8e8f0] font-semibold">{p.procede}</p></div>
                          </div>
                          <div className="px-4 py-3.5 flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-amber-400 mt-2" />
                            <div><p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Citation</p><p className="text-sm text-[#c9a96e] italic">&ldquo;{p.exemple}&rdquo;</p></div>
                          </div>
                          <div className="px-4 py-3.5 flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-emerald-400 mt-2" />
                            <div><p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Effet</p><p className="text-xs text-[#9ca3af] leading-relaxed">{p.effet}</p></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="rounded-2xl border border-emerald-500/20 overflow-hidden bg-[#07070f]">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-[#0d0d1a] border-b border-[#1a1a2e]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Conclusion</p>
              </div>
              <div className="divide-y divide-[#1a1a2e]">
                <div className="px-5 py-4"><p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">Bilan</p><p className="text-sm text-[#c9c9d4] leading-relaxed">{VITRINE_ANALYSE.conclusion.bilan}</p></div>
                <div className="px-5 py-4"><p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">Portée du texte</p><p className="text-sm text-[#c9c9d4] leading-relaxed">{VITRINE_ANALYSE.conclusion.portee}</p></div>
                <div className="px-5 py-4"><p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">Ouverture</p><p className="text-sm text-[#9ca3af] leading-relaxed italic">{VITRINE_ANALYSE.conclusion.ouverture}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_24px_rgba(139,92,246,0.45)]">
            <BookOpen size={16} /> Générer mes analyses
          </Link>
          <p className="text-xs text-[#6b7280] mt-3">Accès immédiat · Sans carte bancaire</p>
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
                <p className="text-4xl font-black text-white">15€</p>
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
