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

RÈGLES DE RÉPONSE :
1. Sois CONCIS et DIRECT. Maximum 8-10 lignes par réponse.
2. Va droit au but : réponds à la question, pas de blabla.
3. Si exemples : 1-2 exemples max, courts.
4. Si questions d'entraînement : 5 questions avec réponses en une phrase chacune.
5. Ton bienveillant mais efficace. Pas de formules de politesse inutiles.
6. N'utilise AUCUN formatage markdown (pas de **, *, #, tirets de liste). Texte brut + sauts de ligne uniquement.
7. Pas de "Bien sûr !", "Excellente question !", etc. Commence directement par la réponse.`;

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
