import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

// Map browser MIME types to Gemini-supported audio types
const MIME_MAP: Record<string, string> = {
  "audio/webm": "audio/webm",
  "audio/ogg": "audio/ogg",
  "audio/mp3": "audio/mp3",
  "audio/mpeg": "audio/mp3",
  "audio/wav": "audio/wav",
  "audio/flac": "audio/flac",
  "audio/aac": "audio/aac",
  "audio/mp4": "audio/aac",
  "audio/x-m4a": "audio/aac",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob | null;
    if (!audio || audio.size === 0) {
      return Response.json({ error: "Aucun audio reçu" }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const rawMime = (audio.type || "audio/webm").split(";")[0].toLowerCase();
    const mimeType = MIME_MAP[rawMime] ?? "audio/webm";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // gemini-1.5-flash has full audio inlineData support
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { mimeType, data: buffer.toString("base64") } },
      "Transcris exactement ce que dit cette personne en français. Retourne uniquement la transcription mot pour mot, sans commentaire.",
    ]);

    const text = result.response.text().trim();
    return Response.json({ text });
  } catch (err) {
    const msg = (err as Error)?.message ?? "Erreur inconnue";
    console.error("Transcribe error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
