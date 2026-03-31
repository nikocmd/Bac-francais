import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

export const maxDuration = 60;

function getExtension(mimeType: string): string {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mp3") || mimeType.includes("mpeg")) return "mp3";
  return "webm";
}

export async function POST(req: Request) {
  let tempPath: string | null = null;
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob | null;
    if (!audio || audio.size === 0) {
      return Response.json({ error: "Aucun audio reçu" }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const rawMime = (audio.type || "audio/webm").split(";")[0].toLowerCase();
    const ext = getExtension(rawMime);

    // Write to /tmp (available on Vercel serverless)
    tempPath = join("/tmp", `rec_${Date.now()}.${ext}`);
    writeFileSync(tempPath, buffer);

    // Upload via Gemini Files API — much more reliable than inlineData for audio
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
    const uploaded = await fileManager.uploadFile(tempPath, {
      mimeType: rawMime,
      displayName: "recording",
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploaded.file.mimeType,
          fileUri: uploaded.file.uri,
        },
      },
      "Transcris exactement ce que dit cette personne en français. Retourne uniquement la transcription mot pour mot, sans ponctuation ajoutée ni commentaire.",
    ]);

    // Clean up uploaded file
    await fileManager.deleteFile(uploaded.file.name);

    const text = result.response.text().trim();
    return Response.json({ text });
  } catch (err) {
    const msg = (err as Error)?.message ?? "Erreur inconnue";
    console.error("Transcribe error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  } finally {
    if (tempPath) {
      try { unlinkSync(tempPath); } catch { /* ignore */ }
    }
  }
}
