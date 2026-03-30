import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BacFrançais.ai — Réussis ton Bac de Français",
  description:
    "Analyses linéaires, préparation à l'oral, œuvre personnelle et mode examen avec IA.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#1e1e2e] py-6 text-center text-sm text-[#6b7280]">
          © 2025 BacFrançais.ai — Propulsé par Claude IA
        </footer>
      </body>
    </html>
  );
}
