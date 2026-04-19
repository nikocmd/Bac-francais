import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyse linéaire IA — Bac de Français",
  description:
    "Génère une analyse linéaire complète pour le Bac de Français en 30 secondes. Mouvements, procédés stylistiques, introduction et conclusion selon le barème BOEN 2024.",
  keywords: ["analyse linéaire IA", "analyse linéaire bac français", "procédés stylistiques bac", "figures de style", "analyse littéraire IA"],
  alternates: { canonical: "https://bacfrancaisai.fr/analyse" },
  openGraph: {
    title: "Analyse linéaire IA en 30 secondes — BacFrançaisAI",
    description: "Colle ton texte, reçois une analyse complète avec mouvements et procédés stylistiques.",
    url: "https://bacfrancaisai.fr/analyse",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
