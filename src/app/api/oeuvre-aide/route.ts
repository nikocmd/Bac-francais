import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { question, contexte } = await request.json();

  if (!question?.trim()) {
    return Response.json({ error: "La question est requise." }, { status: 400 });
  }

  const prompt = `Tu es un conseiller spécialisé dans le Bac de Français. L'élève n'a PAS ENCORE choisi son œuvre pour l'oral et te pose des questions pour l'aider à choisir.

Voici les œuvres au programme du Bac de Français 2024-2025 :

POÉSIE :
- Les Fleurs du mal, Baudelaire (parcours : Alchimie poétique : la boue et l'or)
- Les Contemplations, Victor Hugo (parcours : Les Mémoires d'une âme)
- Alcools, Apollinaire (parcours : Modernité poétique ?)
- Mes forêts, Hélène Dorion (parcours : La poésie, la nature, l'intime)
- La Rage de l'expression, Ponge (parcours : Dans l'atelier du poète)
- Cahier d'un retour au pays natal, Césaire (parcours : La poésie, la nature, l'intime)

LITTÉRATURE D'IDÉES :
- Les Caractères, La Bruyère (parcours : La comédie sociale)
- Déclaration des droits de la femme, Olympe de Gouges (parcours : Écrire et combattre pour l'égalité)
- Gargantua, Rabelais (parcours : Rire et savoir)
- Essais (Des Cannibales / Des Coches), Montaigne (parcours : Notre monde vient d'en trouver un autre)
- Lettres persanes, Montesquieu (parcours : Le regard éloigné)

ROMAN :
- Manon Lescaut, Abbé Prévost (parcours : Personnages en marge, plaisirs du romanesque)
- La Peau de chagrin, Balzac (parcours : Les romans de l'énergie)
- Sido / Les Vrilles de la vigne, Colette (parcours : La célébration du monde)
- Mémoires d'Hadrien, Yourcenar (parcours : Soi-même comme un autre)

THÉÂTRE :
- Le Malade imaginaire, Molière (parcours : Spectacle et comédie)
- Les Fausses Confidences, Marivaux (parcours : Théâtre et stratagème)
- Le Barbier de Séville, Beaumarchais (parcours : Théâtre et stratagème)
- Oh les beaux jours, Beckett (parcours : Un théâtre de la condition humaine)
- Juste la fin du monde, Lagarce (parcours : Crise personnelle, crise familiale)

${contexte ? `Contexte de la conversation :\n${contexte}` : ""}

Question de l'élève : ${question}

Aide-le à choisir en fonction de ses goûts, ses facilités, et ce qui est stratégiquement bon pour le bac. Sois concis, bienveillant et direct. Si l'élève a choisi, confirme et dis-lui de valider.
IMPORTANT : N'utilise AUCUN formatage markdown (pas de **, pas de *, pas de #). Écris en texte brut avec des sauts de ligne.`;

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
