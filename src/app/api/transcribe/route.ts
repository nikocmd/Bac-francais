import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

// MIME types Gemini accepts for audio
const GEMINI_AUDIO_TYPES: Record<string, string> = {
  "audio/webm": "audio/webm",
  "audio/ogg": "audio/ogg",
  "audio/mp3": "audio/mp3",
  "audio/mpeg": "audio/mp3",
  "audio/wav": "audio/wav",
  "audio/flac": "audio/flac",
  "audio/aac": "audio/aac",
  // iOS Safari records audio/mp4 (AAC inside MP4 container)
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
    const mimeType = GEMINI_AUDIO_TYPES[rawMime] ?? "audio/webm";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      { inlineData: { mimeType, data: buffer.toString("base64") } },
      "Transcris exactement ce que dit cette personne en français. Retourne uniquement la transcription mot pour mot, sans commentaire.",
    ]);

    const text = result.response.text().trim();
    return Response.json({ text });
  } catch (err) {
    console.error("Transcribe error:", err);
    return Response.json({ error: "Transcription échouée" }, { status: 500 });
  }
}
