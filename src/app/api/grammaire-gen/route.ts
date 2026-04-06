import { GoogleGenerativeAI } from "@google/generative-ai";
import { requirePremium } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const usage = await requirePremium();
  if (!usage.allowed) {
    return Response.json({ error: "LIMIT_REACHED" }, { status: 403 });
  }
  if (!checkRateLimit(`grammaire:${usage.userId}`, 15, 60_000)) {
    return Response.json({ error: "Trop de requêtes. Attends 1 minute." }, { status: 429 });
  }

  const { sujet } = await request.json();

  if (!sujet?.trim()) {
    return Response.json({ error: "Le sujet est requis." }, { status: 400 });
  }
  if (sujet.length > 200) {
    return Response.json({ error: "Sujet trop long." }, { status: 400 });
  }

  const prompt = `Tu es un examinateur du Baccalauréat de Français. Tu dois générer UNE question de grammaire pour l'oral du Bac.

Le sujet demandé par l'élève : "${sujet}"

Ta tâche :
1. Invente une phrase littéraire courte (12-18 mots) en lien avec la littérature française (style classique, romantique ou réaliste).
2. Formule une question précise portant sur ce sujet grammatical à partir de cette phrase.

Format de réponse OBLIGATOIRE (texte brut, AUCUN markdown) :
Dans la phrase suivante, [consigne grammaticale précise] : « [ta phrase inventée] »

Exemples de consignes selon le sujet :
- "trouver le COD" → "identifiez et analysez le complément d'objet direct"
- "subordonnée relative" → "identifiez la proposition subordonnée relative et précisez sa fonction"
- "accord du participe" → "justifiez l'accord du participe passé"
- "COI" → "identifiez le complément d'objet indirect et indiquez le verbe dont il dépend"

Génère UNIQUEMENT la question, sans explication, sans titre, sans autre texte.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();
    return Response.json({ question });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur lors de la génération." }, { status: 500 });
  }
}
