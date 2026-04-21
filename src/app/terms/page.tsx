/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — BacFrançaisAI",
  description: "Conditions générales d'utilisation et de vente de BacFrançaisAI.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Conditions générales d'utilisation</h1>
      <p className="text-[#6b7280] text-sm mb-10">Dernière mise à jour : avril 2025 — Droit applicable : droit français</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">1. Éditeur du service</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          BacFrançaisAI est un service en ligne accessible à l'adresse <strong>bacfrancaisai.fr</strong>, édité par un auto-entrepreneur de droit français. Contact : <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">2. Description du service</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">
          BacFrançaisAI propose des outils d'aide à la préparation de l'épreuve anticipée de Français du Baccalauréat, notamment :
        </p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li>Analyse linéaire de textes littéraires par intelligence artificielle</li>
          <li>Simulation d'examen oral avec jury IA basé sur le barème BOEN 2024</li>
          <li>Entraînement à l'oral avec feedback vocal en temps réel</li>
          <li>Aide à la préparation de l'œuvre personnelle</li>
        </ul>
        <p className="text-[#b0b0c0] leading-relaxed mt-3">
          Le service est fourni à titre d'aide pédagogique. Les analyses produites par l'IA sont indicatives et ne remplacent pas l'accompagnement d'un professeur.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">3. Accès au service</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">
          L'accès au service nécessite la création d'un compte. Deux niveaux d'accès sont disponibles :
        </p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Offre gratuite</strong> : accès limité (3 analyses par mois, textes jusqu'à 1 000 caractères)</li>
          <li><strong>Offre Premium</strong> : accès illimité à l'ensemble des fonctionnalités, sur abonnement mensuel</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">4. Inscription et compte utilisateur</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          L'utilisateur s'engage à fournir des informations exactes lors de l'inscription et à maintenir la confidentialité de ses identifiants. Tout compte peut être résilié à tout moment depuis les paramètres du profil. L'éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">5. Conditions financières</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">
          L'abonnement Premium est facturé <strong>15,00 € TTC par mois</strong>. Le paiement est prélevé automatiquement chaque mois via Stripe.
        </p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li><strong>Sans engagement</strong> : résiliation possible à tout moment, sans frais</li>
          <li><strong>Résiliation</strong> : l'accès Premium reste actif jusqu'à la fin de la période déjà payée</li>
          <li><strong>Droit de rétractation</strong> : conformément à l'article L221-28 13° du Code de la consommation, le droit de rétractation de 14 jours <strong>ne s'applique pas</strong> aux contenus numériques non fournis sur support matériel dont l'exécution a commencé avec l'accord préalable exprès du consommateur et renonciation expresse à son droit de rétractation. En souscrivant à l'offre Premium, vous reconnaissez avoir expressément consenti à l'accès immédiat au service et renoncez expressément à votre droit de rétractation dès l'activation de votre abonnement.</li>
          <li><strong>Absence de remboursement</strong> : du fait de la nature numérique du service et de l'accès immédiat accordé à la souscription, aucun remboursement ne pourra être demandé après activation. En cas de difficultés exceptionnelles, vous pouvez contacter <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">6. Propriété intellectuelle</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          L'ensemble du service (code, interface, contenus, marque "BacFrançaisAI") est la propriété exclusive de l'éditeur et protégé par le droit de la propriété intellectuelle. Toute reproduction, distribution ou exploitation sans autorisation écrite préalable est interdite. Les textes littéraires soumis par les utilisateurs restent leur propriété ou celle de leurs auteurs.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">7. Responsabilité</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">
          L'éditeur s'engage à fournir le service avec diligence. Cependant :
        </p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li>Les analyses produites par l'IA sont des suggestions pédagogiques, non des garanties de résultats scolaires</li>
          <li>L'éditeur ne saurait être tenu responsable d'une interruption temporaire de service liée à des opérations de maintenance ou à un cas de force majeure</li>
          <li>La responsabilité de l'éditeur est limitée au montant des sommes versées par l'utilisateur au cours des 3 derniers mois</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">8. Obligations de l'utilisateur</h2>
        <p className="text-[#b0b0c0] leading-relaxed mb-3">L'utilisateur s'engage à :</p>
        <ul className="list-disc list-inside text-[#b0b0c0] space-y-2">
          <li>Ne pas utiliser le service à des fins illicites ou contraires aux bonnes mœurs</li>
          <li>Ne pas tenter de contourner les limitations techniques du service</li>
          <li>Ne pas soumettre de contenus illicites, haineux ou portant atteinte aux droits de tiers</li>
          <li>Ne pas utiliser le service pour reproduire massivement des contenus protégés par le droit d'auteur</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">9. Modification des CGU</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par e-mail ou notification dans l'application au moins 15 jours avant toute modification substantielle. La poursuite de l'utilisation du service vaut acceptation des nouvelles conditions.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">10. Droit applicable et juridiction</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Les présentes CGU sont régies par le <strong>droit français</strong>. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront compétents. Pour tout litige de consommation, vous pouvez également recourir à la médiation de la consommation conformément aux articles L612-1 et suivants du Code de la consommation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
        <p className="text-[#b0b0c0] leading-relaxed">
          Pour toute question : <a href="mailto:contact@bacfrancaisai.fr" className="text-blue-400 underline">contact@bacfrancaisai.fr</a>
        </p>
      </section>
    </div>
  );
}
