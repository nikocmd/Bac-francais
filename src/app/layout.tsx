import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ContactPopup from "@/components/ContactPopup";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const APP_URL = "https://bacfrancaisai.fr";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "BacFrançaisAI — L'IA pour réussir ton Bac de Français",
    template: "%s | BacFrançaisAI",
  },
  description:
    "BacFrançaisAI : l'intelligence artificielle pour le Bac de Français. Analyses linéaires en 30 secondes, simulation d'oral avec jury IA, mode examen BOEN 2024. Terminale générale et technologique.",
  keywords: [
    "bac français",
    "bac de français",
    "bacfrancais",
    "bac fr ai",
    "bacfrancaisai",
    "BacFrançaisAI",
    "IA bac français",
    "intelligence artificielle bac français",
    "analyse linéaire IA",
    "analyse linéaire bac",
    "oral bac français",
    "préparation oral bac",
    "examen bac français",
    "bac français terminale",
    "bac français 2024",
    "bac français 2025",
    "simulation oral bac",
    "jury IA bac français",
    "BOEN bac français",
    "procédés stylistiques",
    "figures de style",
    "analyse littéraire",
    "mention bac français",
  ],
  authors: [{ name: "BacFrançaisAI", url: APP_URL }],
  creator: "BacFrançaisAI",
  publisher: "BacFrançaisAI",
  category: "education",
  classification: "Education / Préparation Baccalauréat",
  applicationName: "BacFrançaisAI",
  alternates: {
    canonical: APP_URL,
    languages: { "fr-FR": APP_URL },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "BacFrançaisAI",
    title: "BacFrançaisAI — L'IA pour réussir ton Bac de Français",
    description:
      "Analyses linéaires en 30 secondes, simulation d'oral avec jury IA, mode examen BOEN 2024. L'outil IA indispensable pour les élèves de Terminale.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BacFrançaisAI — L'IA pour réussir ton Bac de Français",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BacFrançaisAI — L'IA pour réussir ton Bac de Français",
    description:
      "Analyses linéaires en 30 secondes, simulation d'oral avec jury IA. L'outil IA pour le Bac de Français.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "BacFrançaisAI",
      description: "L'intelligence artificielle pour réussir le Bac de Français",
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/analyse` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${APP_URL}/#app`,
      name: "BacFrançaisAI",
      url: APP_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      description:
        "Application IA pour la préparation du Baccalauréat de Français : analyses linéaires, simulation d'oral, mode examen BOEN 2024.",
      offers: [
        {
          "@type": "Offer",
          name: "Gratuit",
          price: "0",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          name: "Premium",
          price: "15.00",
          priceCurrency: "EUR",
          billingIncrement: "P1M",
        },
      ],
      featureList: [
        "Analyse linéaire IA en 30 secondes",
        "Simulation d'oral avec jury IA",
        "Mode examen barème BOEN 2024",
        "Préparation œuvre personnelle",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#org`,
      name: "BacFrançaisAI",
      url: APP_URL,
      logo: `${APP_URL}/favicon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@bacfrancaisai.fr",
        contactType: "customer support",
        availableLanguage: "French",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#e8e8f0] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#1e1e2e] py-6 text-center text-sm text-[#6b7280]">
          <p>© {new Date().getFullYear()} BacFrançaisAI</p>
          <p className="mt-2 flex justify-center gap-4">
            <a href="/privacy" className="hover:text-[#e8e8f0] transition-colors">Politique de confidentialité</a>
            <span>·</span>
            <a href="/terms" className="hover:text-[#e8e8f0] transition-colors">CGU</a>
            <span>·</span>
            <ContactPopup />
          </p>
        </footer>
      </body>
    </html>
  );
}
