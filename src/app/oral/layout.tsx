import { Metadata } from "next";
import ToolIntro from "@/components/ToolIntro";

export const metadata: Metadata = {
  title: "Oral IA — Entraîne-toi à l'oral du Bac de Français",
  description:
    "Entraîne-toi à l'oral du Bac de Français avec un jury IA. Parle, reçois un feedback instantané sur le fond et la forme. Barème BOEN 2024.",
  keywords: ["oral bac français IA", "préparation oral bac", "entraînement oral bac français", "simulation oral bac", "jury IA bac"],
  alternates: { canonical: "https://bacfrancaisai.fr/oral" },
  openGraph: {
    title: "Oral IA — Entraîne-toi avec un jury IA — BacFrançaisAI",
    description: "Simule ton oral du Bac de Français avec un jury IA. Feedback instantané.",
    url: "https://bacfrancaisai.fr/oral",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolIntro
        titre="S'entraîner à l'oral du bac de français avec l'IA"
        texte="Présente ton explication à voix haute : ta prestation est transcrite puis évaluée sur 20 selon les critères de l'épreuve (connaissance du texte, qualité de l'analyse, expression orale, structuration), avec tes points forts et des conseils concrets pour progresser."
        etapes={["Enregistre ton explication linéaire.", "Reçois une note sur 20 et un retour détaillé.", "Corrige tes points faibles et recommence."]}
        guides={["oral-bac-francais-2027", "question-de-grammaire-bac-francais", "analyse-lineaire-methode"]}
      />
    </>
  );
}
