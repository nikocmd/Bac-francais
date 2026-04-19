import { Metadata } from "next";

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
  return <>{children}</>;
}
