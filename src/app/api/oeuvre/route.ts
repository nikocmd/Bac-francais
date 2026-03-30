import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { question, oeuvre, auteur, contexte } = await request.json();

  if (!question?.trim()) {
    return Response.json({ error: "La question est requise." }, { status: 400 });
  }

  const prompt = `Tu es un professeur de français expert, spécialisé dans la préparation au Bac. Tu accompagnes un élève dans son travail sur son œuvre personnelle au programme.

**Œuvre :** ${oeuvre || "non précisé"}
**Auteur :** ${auteur || "non précisé"}
**Contexte supplémentaire :** ${contexte || ""}

**Question ou demande de l'élève :**
${question}

Réponds de manière pédagogique, claire et adaptée au niveau lycée. Structure ta réponse avec :
- Une réponse directe à la question
- Des exemples tirés de l'œuvre si possible
- Des éléments pour préparer l'entretien oral avec le jury

Si l'élève demande des questions d'entraînement, fournis-en 5 de difficulté croissante avec les éléments de réponse attendus.

Réponds en français, avec un ton bienveillant et encourageant.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reponse = result.response.text();
    return Response.json({ reponse });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur lors de la réponse." }, { status: 500 });
  }
}
