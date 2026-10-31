import type { Metadata } from "next";

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
  return <>{children}</>;
}
