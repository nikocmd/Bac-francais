import { generate, AIBusyError, AI_BUSY_MESSAGE } from "@/lib/llm";
import { checkFeature, recordUse } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";
import { analyseSchema, parseBody } from "@/lib/schemas";


export async function POST(request: Request) {
  const usage = await checkFeature("analyse", true);
  if (!usage.allowed) {
    return Response.json({ error: "LIMIT_REACHED", reason: usage.reason }, { status: 403 });
  }

  if (!checkRateLimit(`analyse:${usage.userId}`, 10, 60_000)) {
    return Response.json({ error: "Trop de requêtes. Attends 1 minute." }, { status: 429 });
  }

  const raw = await request.json();
  const parsed = parseBody(analyseSchema, raw);
  if (!parsed.success) return Response.json({ error: parsed.error }, { status: 400 });
  const { texte, titre, auteur, oeuvre, axe } = parsed.data;

  const prompt = `Tu es un professeur de français expert en littérature, spécialisé dans la préparation du Baccalauréat français (première générale et technologique).

Un élève te soumet un texte pour réaliser une **analyse linéaire complète** selon les exigences officielles du Bac de français.

**Informations sur le texte :**
- Titre de l'œuvre : ${oeuvre || "non précisé"}
- Auteur : ${auteur || "non précisé"}
- Titre/numéro de l'extrait : ${titre || "non précisé"}
- Axe de lecture / problématique : ${axe || "à définir selon le texte"}

**Texte à analyser :**
${texte}

**Consignes :**
Rédige une analyse linéaire COMPLÈTE et DÉTAILLÉE structurée ainsi :

1. **Introduction** : situe l'extrait dans l'œuvre, présente l'auteur brièvement, énonce la problématique et annonce le plan (les mouvements).

2. **Mouvements** (minimum 3, maximum 5) : pour chaque mouvement :
   - Titre du mouvement
   - Lignes / numéros de vers concernés
   - Au moins 3 procédés stylistiques avec : citation exacte du texte, nom du procédé, effet produit sur le lecteur

3. **Conclusion** : bilan de l'analyse, réponse à la problématique.

4. **Ouverture** : proposition d'une ouverture pertinente (autre œuvre, mouvement littéraire, thème).

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans texte avant/après) avec cette structure exacte :
{
  "problematique": "string",
  "introduction": "string (paragraphe rédigé)",
  "mouvements": [
    {
      "numero": 1,
      "titre": "string",
      "lignes": "string (ex: 'v.1-8' ou 'l.1-5')",
      "procedes": [
        {
          "procede": "string (nom du procédé)",
          "exemple": "string (citation exacte)",
          "effet": "string (effet sur le lecteur)"
        }
      ]
    }
  ],
  "conclusion": "string (paragraphe rédigé)",
  "ouverture": "string"
}`;

  try {
    const text = await generate(prompt, { feature: "analyse", json: true });
    const raw = text;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Réponse invalide de l'IA." }, { status: 500 });
    }
    const analyse = JSON.parse(jsonMatch[0]);
    if (usage.userId) await recordUse(usage.userId, "analyse");
    return Response.json({ analyse });
  } catch (err) {
    if (err instanceof AIBusyError) return Response.json({ error: AI_BUSY_MESSAGE }, { status: 503 });
    console.error(err);
    return Response.json({ error: "Erreur lors de l'analyse." }, { status: 500 });
  }
}
