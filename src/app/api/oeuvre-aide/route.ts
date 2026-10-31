import { generate, AIBusyError, AI_BUSY_MESSAGE } from "@/lib/llm";
import { requirePaid } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_QUESTION = 1_000;
const cap = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

export async function POST(request: Request) {
  const usage = await requirePaid();
  if (!usage.allowed) {
    return Response.json({ error: "LIMIT_REACHED" }, { status: 403 });
  }
  if (!checkRateLimit(`oeuvre-aide:${usage.userId}`, 20, 60_000)) {
    return Response.json({ error: "Trop de requêtes. Attends 1 minute." }, { status: 429 });
  }

  const body = await request.json();
  const question = cap(body.question, 5_000), contexte = cap(body.contexte, 4_000);

  if (!question?.trim()) {
    return Response.json({ error: "La question est requise." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION) {
    return Response.json({ error: "Question trop longue (max 1000 caractères)." }, { status: 400 });
  }

  const prompt = `Tu es un conseiller spécialisé dans le Bac de Français. L'élève n'a PAS ENCORE choisi son œuvre pour l'oral et te pose des questions pour l'aider à choisir.

Voici les œuvres au programme du Bac de Français pour l'année scolaire 2026-2027 (épreuves de juin 2027), voie générale :

POÉSIE :
- Cahier de Douai, Rimbaud (parcours : Émancipations créatrices)
- La rage de l'expression, Francis Ponge (parcours : Dans l'atelier du poète)
- Mes forêts, Hélène Dorion (parcours : La poésie, la nature, l'intime)

LITTÉRATURE D'IDÉES :
- Discours de la servitude volontaire, La Boétie (parcours : « Défendre » et « entretenir » la liberté)
- Entretiens sur la pluralité des mondes, Fontenelle (parcours : Le goût de la science)
- Lettres d'une Péruvienne, Françoise de Graffigny (parcours : Un nouvel univers s'est offert à mes yeux)

ROMAN ET RÉCIT :
- Le Chevalier de la charrette, Chrétien de Troyes (parcours : Le roman et l'invention de l'amour)
- Pot-Bouille, Zola (parcours : Dévoiler les rouages de la société)
- Pluie et vent sur Télumée Miracle, Simone Schwarz-Bart (parcours : Tisser les mémoires, habiter le monde)

THÉÂTRE :
- Le Menteur, Corneille (parcours : Mensonge et comédie)
- On ne badine pas avec l'amour, Musset (parcours : Les jeux du cœur et de la parole)
- Pour un oui ou pour un non, Nathalie Sarraute (parcours : Théâtre et dispute)

En voie technologique, pour le roman, Pot-Bouille est remplacé par Thérèse Raquin de Zola. Rappelle à l'élève que l'œuvre présentée doit faire partie de celles étudiées dans sa classe.

${contexte ? `Contexte de la conversation :\n${contexte}` : ""}

Question de l'élève : ${question}

RÈGLES :
1. Sois TRÈS CONCIS : 4-6 lignes MAX par réponse.
2. Va droit au but. Pas de "Bien sûr !", "Excellente question !".
3. Propose 2-3 œuvres max avec une phrase d'explication chacune.
4. Si l'élève a choisi, dis-lui juste de valider. Pas de pavé.
5. N'utilise AUCUN formatage markdown. Texte brut + sauts de ligne uniquement. Garde une ponctuation française normale : apostrophes, accents, guillemets.`;

  try {
    const text = await generate(prompt, { feature: "oeuvre_aide" });
    const reponse = text;
    return Response.json({ reponse });
  } catch (err) {
    if (err instanceof AIBusyError) return Response.json({ error: AI_BUSY_MESSAGE }, { status: 503 });
    console.error(err);
    return Response.json({ error: "Erreur lors de la réponse." }, { status: 500 });
  }
}
