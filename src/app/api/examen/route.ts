import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { transcription, texte, oeuvre, auteur, typeEpreuve, grammarQuestion, grammarAnswer } = await request.json();

  if (!transcription?.trim()) {
    return Response.json({ error: "La transcription est requise." }, { status: 400 });
  }

  const prompt = `Tu es un jury officiel du Baccalauréat de français. Tu évalues une prestation d'examen dans des conditions réelles.

**Œuvre étudiée :** ${oeuvre || "non précisé"} — ${auteur || ""}
**Type d'épreuve :** ${typeEpreuve || "Explication de texte linéaire"}
**Texte soumis à l'élève :**
${texte || "non fourni"}

**Prestation de l'élève (transcription) :**
${transcription}
${grammarQuestion ? `
**Question de grammaire posée :** ${grammarQuestion}
**Réponse de l'élève :** ${grammarAnswer || "Pas de réponse fournie"}
` : ""}
Tu dois noter cette prestation avec la plus grande HONNÊTETÉ, comme le ferait un vrai jury de Bac. Ne sois ni trop clément ni trop sévère. Applique strictement les critères du BOEN.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :
{
  "note_finale": <nombre entre 0 et 20>,
  "mention": "<Très insuffisant | Insuffisant | Passable | Assez bien | Bien | Très bien>",
  "bilan": "<paragraphe de bilan rédigé comme un vrai jury, 3-4 phrases>",
  "encouragement": "<message d'encouragement personnalisé>",
  "criteres": [
    {
      "nom": "Compréhension et analyse du texte",
      "note": <0-8>,
      "sur": 8,
      "commentaire": "<commentaire précis>"
    },
    {
      "nom": "Qualité de la méthode (structure, procédés)",
      "note": <0-6>,
      "sur": 6,
      "commentaire": "<commentaire précis>"
    },
    {
      "nom": "Expression et clarté à l'oral",
      "note": <0-3>,
      "sur": 3,
      "commentaire": "<commentaire précis>"
    },
    {
      "nom": "Culture littéraire et ouverture",
      "note": <0-3>,
      "sur": 3,
      "commentaire": "<commentaire précis>"
    }${grammarQuestion ? `,
    {
      "nom": "Question de grammaire",
      "note": <0-3>,
      "sur": 3,
      "commentaire": "<évaluation de la réponse à la question de grammaire>"
    }` : ""}
  ],
  "points_essentiels_manquants": ["<point manquant 1>", "<point manquant 2>"],
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
