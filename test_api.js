
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAnalyse() {
  console.log("--- Test Analyse Linéaire ---");
  const prompt = `Tu es un professeur de français expert... (prompt tronqué pour le test)`;
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using 2.0 as 2.5 might be a typo in their code but I'll check what they use
  
  const texte = "Demain, dès l'aube, à l'heure où blanchit la campagne, Je partirai. Vois-tu, je sais que tu m'attends. J'irai par la forêt, j'irai par la montagne. Je ne puis demeurer loin de toi plus longtemps.";
  
  // Real prompt from src/app/api/analyse/route.ts
  const realPrompt = `Tu es un professeur de français expert en littérature, spécialisé dans la préparation du Baccalauréat français (première générale et technologique).

Un élève te soumet un texte pour réaliser une **analyse linéaire complète** selon les exigences officielles du Bac de français.

**Informations sur le texte :**
- Titre de l'œuvre : Les Contemplations
- Auteur : Victor Hugo
- Titre/numéro de l'extrait : Demain dès l'aube
- Axe de lecture / problématique : à définir selon le texte

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
    const result = await model.generateContent(realPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Réponse Analyse:", text);
    JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    console.log("✅ Analyse JSON valide.");
  } catch (error) {
    console.error("❌ Erreur Analyse:", error);
  }
}

async function testExamen() {
  console.log("\n--- Test Mode Examen ---");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Tu es un jury officiel du Baccalauréat de français... (prompt tronqué)`;
  // Real prompt from src/app/api/examen/route.ts
  const realPrompt = `Tu es un jury officiel du Baccalauréat de français (épreuve orale). Tu évalues une prestation dans des conditions réelles selon le barème OFFICIEL du BOEN.

BARÈME OFFICIEL DE L'ORAL DU BAC DE FRANÇAIS :
- PARTIE 1 (12 points) :
  → Lecture à voix haute : 2 points
  → Explication linéaire du texte : 8 points
  → Question de grammaire : 2 points
- PARTIE 2 (8 points) :
  → Présentation de l'œuvre choisie : 8 points (inclut l'entretien)
- TOTAL : 20 points

**Texte soumis à l'élève :**
Demain dès l'aube...
**Œuvre :** Les Contemplations — Victor Hugo

**PARTIE 1 — Explication linéaire (transcription de l'élève) :**
Dans ce poème, Victor Hugo exprime sa tristesse. Il commence par dire qu'il partira demain matin. Il utilise le futur pour montrer sa détermination. Le paysage est décrit de manière mélancolique.

**Question de grammaire posée :** Analysez la négation dans le dernier vers.
**Réponse de l'élève :** La négation est totale, elle marque l'impossibilité.

**PARTIE 2 — Présentation de l'œuvre (transcription de l'élève) :**
J'ai choisi Les Contemplations car c'est un recueil qui parle du deuil de sa fille Léopoldine. C'est très touchant.

Note avec la plus grande HONNÊTETÉ. Applique strictement le barème officiel. Les transcriptions sont automatiques : évalue les idées et la structure, pas les mots exacts.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :
{
  "note_finale": 15,
  "mention": "Bien",
  "bilan": "Une prestation solide...",
  "encouragement": "Continue comme ça !",
  "criteres": [],
  "points_essentiels_manquants": [],
  "reussites": []
}`;

  try {
    const result = await model.generateContent(realPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Réponse Examen:", text);
    JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    console.log("✅ Examen JSON valide.");
  } catch (error) {
    console.error("❌ Erreur Examen:", error);
  }
}

async function runTests() {
  await testAnalyse();
  await testExamen();
}

runTests();
