import { Metadata } from "next";

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
  return <>{children}</>;
}
