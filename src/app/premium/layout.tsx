import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium — Accès illimité Bac de Français IA",
  description:
    "Accès illimité à toutes les fonctionnalités IA : analyses linéaires, oral, examen, œuvre personnelle. 9.99€/mois sans engagement.",
  keywords: ["bac français premium", "abonnement bac français IA", "accès illimité bac français"],
  alternates: { canonical: "https://bacfrancaisai.fr/premium" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
