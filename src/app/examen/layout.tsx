import { Metadata } from "next";
import ToolIntro from "@/components/ToolIntro";

export const metadata: Metadata = {
  title: "Mode Examen — Simulation jury Bac de Français",
  description:
    "Simule ton examen oral du Bac de Français avec un jury IA officiel. Tirage au sort, notation barème BOEN 2024, feedback détaillé sur 20 points.",
  keywords: ["simulation examen bac français", "jury bac français", "barème bac français 2024", "BOEN bac français", "examen blanc bac"],
  alternates: { canonical: "https://bacfrancaisai.fr/examen" },
  openGraph: {
    title: "Simulation jury Bac de Français — BacFrançaisAI",
    description: "Jury IA officiel, barème BOEN 2024, notation sur 20 points.",
    url: "https://bacfrancaisai.fr/examen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolIntro
        titre="Simuler l'oral du bac de français en conditions réelles"
        texte="Le mode examen reproduit l'épreuve : un texte tiré dans ta liste, 30 minutes de préparation, l'explication linéaire, la question de grammaire, puis la présentation de ton œuvre. Tu reçois une note sur 20 selon le barème de l'épreuve."
        etapes={["Choisis le mode complet ou express.", "Prépare-toi pendant le temps imparti.", "Passe l'oral et reçois ton évaluation détaillée."]}
        guides={["oral-bac-francais-2027", "question-de-grammaire-bac-francais", "oeuvres-programme-bac-francais-2027"]}
      />
    </>
  );
}
