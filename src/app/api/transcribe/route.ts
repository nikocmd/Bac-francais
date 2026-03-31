import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob | null;
    if (!audio || audio.size === 0) {
      return Response.json({ error: "No audio" }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const mimeType = (audio.type || "audio/webm").split(";")[0];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
      "Transcris exactement ce que dit cette personne en français. Retourne uniquement la transcription mot pour mot, sans ponctuation ajoutée artificiellement, sans commentaire.",
    ]);

    const text = result.response.text().trim();
    return Response.json({ text });
  } catch (err) {
    console.error("Transcribe error:", err);
    return Response.json({ error: "Transcription échouée" }, { status: 500 });
  }
}
