import { Metadata } from "next";
import ToolIntro from "@/components/ToolIntro";

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
  return (
    <>
      {children}
      <ToolIntro
        titre="Générer une analyse linéaire avec l'IA"
        texte="Colle un extrait étudié en classe et obtiens en quelques secondes une analyse linéaire complète pour l'oral du bac de français : introduction, projet de lecture, mouvements, procédés stylistiques avec citations et effets, conclusion et ouverture. Utilise-la pour vérifier et enrichir ta propre analyse."
        etapes={["Colle le texte et indique l'auteur et l'œuvre.", "Lis l'analyse proposée mouvement par mouvement.", "Compare-la avec ton travail, puis entraîne-toi à l'expliquer à voix haute."]}
        guides={["analyse-lineaire-methode", "procedes-stylistiques-bac-francais", "mouvements-litteraires-bac-francais"]}
      />
    </>
  );
}
