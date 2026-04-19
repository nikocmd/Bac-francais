/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — BacFrançaisAI",
  description: "Politique de confidentialité et protection des données personnelles de BacFrançaisAI, conforme au RGPD.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-[#6b7280] text-sm mb-10">Dernière mise à jour : avril 2025 — Conforme au RGPD et à la loi Informatique et Libertés</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">1. Responsable du traitement</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Le responsable du traitement des données personnelles collectées sur <strong>bacfrancaisai.fr</strong> est l'éditeur du service BacFrançaisAI, joignable à l'adresse suivante : <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">2. Données collectées</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">Nous collectons les données suivantes :</p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Données d'identification</strong> : adresse e-mail, prénom et nom (lors de l'inscription)</li>
          <li><strong>Données de connexion</strong> : identifiant Google (si connexion via Google), date et heure de connexion</li>
          <li><strong>Contenus soumis</strong> : textes littéraires saisis pour analyse, enregistrements audio (mode oral), questions posées à l'IA</li>
          <li><strong>Données de paiement</strong> : gérées exclusivement par Stripe — nous ne stockons aucune donnée bancaire</li>
          <li><strong>Données techniques</strong> : adresse IP, navigateur, système d'exploitation, pages visitées</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">3. Finalités et bases légales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#b0b0c0] border border-[#1e1e2e] rounded-lg overflow-hidden">
            <thead className="bg-[#12121a]">
              <tr>
                <th className="text-left p-3 font-semibold text-[#e8e8f0]">Finalité</th>
                <th className="text-left p-3 font-semibold text-[#e8e8f0]">Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#1e1e2e]">
                <td className="p-3">Création et gestion de votre compte</td>
                <td className="p-3">Exécution du contrat (art. 6.1.b RGPD)</td>
              </tr>
              <tr className="border-t border-[#1e1e2e]">
                <td className="p-3">Fourniture du service (analyses IA, oral, examen)</td>
                <td className="p-3">Exécution du contrat (art. 6.1.b RGPD)</td>
              </tr>
              <tr className="border-t border-[#1e1e2e]">
                <td className="p-3">Gestion des abonnements et paiements</td>
                <td className="p-3">Exécution du contrat (art. 6.1.b RGPD)</td>
              </tr>
              <tr className="border-t border-[#1e1e2e]">
                <td className="p-3">Amélioration du service et analyses statistiques</td>
                <td className="p-3">Intérêt légitime (art. 6.1.f RGPD)</td>
              </tr>
              <tr className="border-t border-[#1e1e2e]">
                <td className="p-3">Envoi d'e-mails transactionnels (confirmation, réinitialisation)</td>
                <td className="p-3">Exécution du contrat (art. 6.1.b RGPD)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">4. Sous-traitants et transferts de données</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">Nous faisons appel aux sous-traitants suivants, liés par des garanties appropriées :</p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Supabase</strong> (États-Unis) — base de données et authentification — couvert par les clauses contractuelles types UE</li>
          <li><strong>Vercel</strong> (États-Unis) — hébergement de l'application — couvert par les clauses contractuelles types UE</li>
          <li><strong>Google Gemini</strong> (États-Unis) — traitement IA des textes soumis — couvert par les clauses contractuelles types UE</li>
          <li><strong>Groq</strong> (États-Unis) — transcription audio — couvert par les clauses contractuelles types UE</li>
          <li><strong>Stripe</strong> (États-Unis) — paiements — certifié PCI-DSS, couvert par les clauses contractuelles types UE</li>
        </ul>
        <p className="text-[#b0b0c0] leading-relaxed mt-3">Ces transferts hors UE sont encadrés conformément aux articles 44 à 49 du RGPD.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">5. Durée de conservation</h2>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Données de compte</strong> : conservées pendant toute la durée d'activité du compte, puis supprimées dans les 30 jours suivant la suppression du compte</li>
          <li><strong>Contenus soumis</strong> (textes, audio) : conservés le temps de la session, non utilisés pour entraîner nos modèles IA</li>
          <li><strong>Données de paiement</strong> : conservées 10 ans pour obligations comptables légales</li>
          <li><strong>Logs techniques</strong> : conservés 12 mois maximum</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
          <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li><strong>Droit d'opposition</strong> : vous opposer à un traitement fondé sur l'intérêt légitime</li>
          <li><strong>Droit à la limitation</strong> : demander la suspension temporaire d'un traitement</li>
        </ul>
        <p className="text-[#b0b0c0] leading-relaxed mt-3">
          Pour exercer vos droits : <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a>. Nous répondons dans un délai de 30 jours. En cas de litige, vous pouvez saisir la <strong>CNIL</strong> (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">cnil.fr</a>).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">8. Sécurité</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Vos données sont protégées par chiffrement TLS en transit et au repos. L'accès est limité aux personnes autorisées. En cas de violation de données, vous serez informé conformément à l'article 34 du RGPD.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">9. Mineurs</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Le service est destiné aux élèves de lycée. Pour les utilisateurs de moins de 15 ans, le consentement parental est requis conformément à l'article 8 du RGPD et à la loi française.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Pour toute question relative à cette politique : <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a>
        </p>
      </section>
    </div>
  );
}
