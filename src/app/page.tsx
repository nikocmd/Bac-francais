import Link from "next/link";
import { BookOpen, Mic, Library, GraduationCap, ArrowRight, CheckCircle, Crown, Zap, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 space-y-0">

      {/* ── HERO ── */}
      <section className="py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold uppercase tracking-widest">
          <Zap size={12} /> 1 essai gratuit · Premium à 9.99€/mois
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
            Essayer gratuitement <ArrowRight size={16} />
          </Link>
        </div>

        <p className="text-xs text-[#4a5568]">
          1 utilisation offerte sans carte bancaire · Ensuite 9.99€/mois
        </p>
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

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-[#0a1543]/60 border border-[#19327f]/60 rounded-2xl p-7 space-y-5">
            <div>
              <p className="text-[#6b7280] text-xs font-bold uppercase tracking-widest mb-2">Gratuit</p>
              <p className="text-4xl font-black text-white">0€</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#a0b0d0]">
                <CheckCircle size={14} className="text-[#FFD700]" />
                1 utilisation IA offerte
              </div>
              {["Analyses illimitées", "Oral illimité", "Mode examen", "Aide œuvre"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#2a3a6e]">
                  <Lock size={13} />
                  <span className="line-through">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/register"
              className="block text-center py-3 rounded-xl border border-[#19327f] text-[#6b7280] font-bold text-sm hover:border-[#1a9fff]/40 hover:text-white transition-all">
              Commencer
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-b from-[#FFD700]/8 to-[#0a1543]/80 border-2 border-[#FFD700]/50 rounded-2xl p-7 space-y-5 relative shadow-[0_0_40px_rgba(255,215,0,0.12)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD700] text-[#050a2e] text-xs font-black uppercase tracking-widest whitespace-nowrap">
              👑 Recommandé
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
          </div>
        </div>
      </section>

    </div>
  );
}
