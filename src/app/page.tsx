import Link from "next/link";
import { BookOpen, Mic, Library, GraduationCap, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const features = [
  {
    href: "/analyse",
    icon: BookOpen,
    color: "from-violet-600 to-purple-600",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "Analyse linéaire",
    desc: "Colle ton texte, obtiens une analyse structurée en mouvements avec procédés stylistiques, effets et citations — prête pour l'oral.",
    badge: "Texte → Analyse complète",
  },
  {
    href: "/oral",
    icon: Mic,
    color: "from-blue-600 to-cyan-600",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Accompagnement oral",
    desc: "Entraîne-toi à voix haute. L'IA transcrit, analyse ta prestation et te donne un feedback précis sur le fond et la forme.",
    badge: "Parle → Feedback instantané",
  },
  {
    href: "/oeuvre",
    icon: Library,
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Œuvre personnelle",
    desc: "Travaille ton œuvre au programme : résumé, thèmes, personnages, questions d'entretien. L'IA t'accompagne chapitre par chapitre.",
    badge: "Questions → Réponses guidées",
  },
  {
    href: "/examen",
    icon: GraduationCap,
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Mode examen",
    desc: "Simule les conditions réelles du Bac. L'IA joue le jury, écoute ta présentation et te note selon les vrais critères officiels.",
    badge: "Simulation jury officielle",
  },
];

const stats = [
  { value: "20 min", label: "durée moyenne d'une analyse" },
  { value: "/20", label: "notation officielle bac" },
  { value: "100%", label: "basé sur les critères BOEN" },
];

const benefits = [
  "Analyses rédigées selon la méthode officielle",
  "Notation honnête basée sur les critères du Bac",
  "Feedback personnalisé sur ta prestation orale",
  "Préparation aux questions du jury d'entretien",
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium">
          <Sparkles size={14} />
          Propulsé par Claude IA — le meilleur modèle pour le français
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Réussis ton{" "}
          <span className="gradient-text">Bac de Français</span>
          <br />avec l&apos;IA
        </h1>
        <p className="text-lg md:text-xl text-[#9ca3af] max-w-2xl mx-auto leading-relaxed">
          Analyses linéaires complètes, simulation d&apos;oral avec jury IA, accompagnement sur ton œuvre personnelle.
          Tout ce qu&apos;il te faut pour décrocher une mention.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/analyse"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            Commencer gratuitement <ArrowRight size={16} />
          </Link>
          <Link
            href="/examen"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1a27] hover:bg-[#1e1e2e] text-[#e8e8f0] font-semibold border border-[#2a2a3e] transition-all"
          >
            <GraduationCap size={16} />
            Simuler l&apos;examen
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 pt-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-violet-400">{s.value}</div>
              <div className="text-sm text-[#6b7280]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">4 outils pour tout préparer</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map(({ href, icon: Icon, color, bg, title, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className={`group p-6 rounded-2xl border ${bg} hover:scale-[1.01] transition-all duration-200 block`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-xs font-medium text-[#6b7280] bg-[#1a1a27] px-3 py-1 rounded-full border border-[#2a2a3e]">
                  {badge}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-violet-300 transition-colors">
                {title}
              </h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Accéder <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="rounded-2xl bg-[#12121a] border border-[#1e1e2e] p-8 space-y-6">
        <h2 className="text-2xl font-bold">Pourquoi BacFrançais.ai ?</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-[#c9c9d4]">{b}</span>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all text-sm"
          >
            Voir mon tableau de bord <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
