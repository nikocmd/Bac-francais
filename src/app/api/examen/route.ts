import { GoogleGenerativeAI } from "@google/generative-ai";
import { requirePremium } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MAX_TRANSCRIPTION = 8_000;

export async function POST(request: Request) {
  const usage = await requirePremium();
  if (!usage.allowed) {
    return Response.json({ error: "LIMIT_REACHED" }, { status: 403 });
  }
  if (!checkRateLimit(`examen:${usage.userId}`, 5, 60_000)) {
    return Response.json({ error: "Trop de requêtes. Attends 1 minute." }, { status: 429 });
  }

  const { explicationTranscription, oeuvreTranscription, texte, oeuvre, auteur, grammarQuestion, grammarAnswer } = await request.json();

  if (!explicationTranscription?.trim()) {
    return Response.json({ error: "La transcription est requise." }, { status: 400 });
  }
  if (explicationTranscription.length > MAX_TRANSCRIPTION || (oeuvreTranscription?.length ?? 0) > MAX_TRANSCRIPTION) {
    return Response.json({ error: "Transcription trop longue." }, { status: 400 });
  }

  const prompt = `Tu es un jury officiel du Baccalauréat de français (épreuve orale). Tu évalues une prestation dans des conditions réelles selon le barème OFFICIEL du BOEN.

BARÈME OFFICIEL DE L'ORAL DU BAC DE FRANÇAIS :
- PARTIE 1 (12 points) :
  → Lecture à voix haute : 2 points
  → Explication linéaire du texte : 8 points
  → Question de grammaire : 2 points
- PARTIE 2 (8 points) :
  → Présentation de l'œuvre choisie : 8 points (inclut l'entretien)
- TOTAL : 20 points

**Texte soumis à l'élève :**
${texte || "non fourni"}
**Œuvre :** ${oeuvre || "non précisé"} — ${auteur || ""}

**PARTIE 1 — Explication linéaire (transcription de l'élève) :**
${explicationTranscription}

**Question de grammaire posée :** ${grammarQuestion || "Aucune question configurée"}
**Réponse de l'élève :** ${grammarAnswer || "Pas de réponse fournie"}

**PARTIE 2 — Présentation de l'œuvre (transcription de l'élève) :**
${oeuvreTranscription || "L'élève n'a pas fait la partie 2"}

Note avec la plus grande HONNÊTETÉ. Applique strictement le barème officiel. Les transcriptions sont automatiques : évalue les idées et la structure, pas les mots exacts.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :
{
  "note_finale": <nombre entre 0 et 20>,
  "mention": "<Très insuffisant | Insuffisant | Passable | Assez bien | Bien | Très bien>",
  "bilan": "<paragraphe de bilan rédigé comme un vrai jury, 3-4 phrases>",
  "encouragement": "<message d'encouragement personnalisé>",
  "criteres": [
    {
      "nom": "Lecture à voix haute",
      "note": <0-2>,
      "sur": 2,
      "commentaire": "<évaluation de la qualité de lecture : fluidité, expressivité, articulation>"
    },
    {
      "nom": "Explication linéaire",
      "note": <0-8>,
      "sur": 8,
      "commentaire": "<évaluation : compréhension, analyse des procédés, structure, interprétation>"
    },
    {
      "nom": "Question de grammaire",
      "note": <0-2>,
      "sur": 2,
      "commentaire": "<évaluation de la réponse grammaticale>"
    },
    {
      "nom": "Présentation de l'œuvre",
      "note": <0-8>,
      "sur": 8,
      "commentaire": "<évaluation : connaissance de l'œuvre, argumentation, pertinence, qualité de l'expression>"
    }
  ],
  "points_essentiels_manquants": ["<point manquant 1>", "<point manquant 2>", "<point manquant 3>"],
  "reussites": ["<réussite 1>", "<réussite 2>"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Réponse invalide de l'IA." }, { status: 500 });
    }
    const resultat = JSON.parse(jsonMatch[0]);
    return Response.json({ resultat });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur lors de la notation." }, { status: 500 });
  }
}
