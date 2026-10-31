import type { Metadata } from "next";
import ToolIntro from "@/components/ToolIntro";

export const metadata: Metadata = {
  title: "Aide œuvre IA — Révise ton œuvre pour l'oral du bac de français",
  description: "Révise l'œuvre choisie pour la seconde partie de l'oral du bac de français : pose tes questions à l'IA sur les thèmes, les personnages et les passages clés.",
  alternates: { canonical: "https://bacfrancaisai.fr/oeuvre" },
  openGraph: {
    title: "Aide œuvre IA — BacFrançaisAI",
    description: "Révise l'œuvre choisie pour l'oral du bac de français avec l'IA.",
    url: "https://bacfrancaisai.fr/oeuvre",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolIntro
        titre="Réviser son œuvre pour l'oral avec l'IA"
        texte="Prépare la seconde partie de l'oral du bac de français : pose tes questions sur l'œuvre choisie, ses thèmes, ses personnages et ses passages clés, et entraîne-toi aux questions de l'entretien avec l'examinateur."
        etapes={["Indique l'œuvre et l'auteur que tu présentes.", "Pose tes questions ou demande des questions d'entraînement.", "Prépare une présentation personnelle de deux à trois minutes."]}
        guides={["oeuvres-programme-bac-francais-2027", "oral-bac-francais-2027", "dissertation-bac-francais-methode"]}
      />
    </>
  );
}
