import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { transcription, contexte, type } = await request.json();

  if (!transcription?.trim()) {
    return Response.json({ error: "La transcription est requise." }, { status: 400 });
  }

  const prompt = `Tu es un jury du Baccalauréat de français, expérimenté et bienveillant mais exigeant. Tu évalues la prestation orale d'un lycéen.

**Contexte :** ${contexte || "Oral de français Baccalauréat"}
**Type d'exercice :** ${type || "Explication de texte / Analyse linéaire"}

**Transcription de la prestation de l'élève :**
${transcription}

**Ta mission :**
Évalue cette prestation selon les critères officiels du Bac de français et fournis un feedback détaillé, honnête et constructif.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) avec cette structure :
{
  "note": <nombre entre 0 et 20, avec décimales possibles ex: 13.5>,
  "mention": "<Très insuffisant | Insuffisant | Passable | Assez bien | Bien | Très bien>",
  "appreciation": "<appréciation générale en 2-3 phrases>",
  "points_forts": ["<point fort 1>", "<point fort 2>", "<point fort 3>"],
  "axes_amelioration": ["<axe 1>", "<axe 2>", "<axe 3>"],
  "conseils": ["<conseil concret 1>", "<conseil concret 2>", "<conseil concret 3>"],
  "criteres": [
    {"nom": "Connaissance du texte", "note": <0-5>, "sur": 5, "commentaire": "string"},
    {"nom": "Qualité de l'analyse", "note": <0-7>, "sur": 7, "commentaire": "string"},
    {"nom": "Expression orale", "note": <0-4>, "sur": 4, "commentaire": "string"},
    {"nom": "Structuration", "note": <0-4>, "sur": 4, "commentaire": "string"}
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Réponse invalide de l'IA." }, { status: 500 });
    }
    const feedback = JSON.parse(jsonMatch[0]);
    return Response.json({ feedback });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur lors de l'évaluation." }, { status: 500 });
  }
}
