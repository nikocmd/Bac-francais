export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio") as File | null;

  if (!audio || audio.size === 0) {
    return Response.json({ error: "Fichier audio manquant." }, { status: 400 });
  }

  const mime = (audio.type || "audio/webm").split(";")[0].toLowerCase();
  const ext = mime.includes("mp4") || mime.includes("m4a") ? "m4a"
    : mime.includes("wav") ? "wav"
    : mime.includes("mp3") || mime.includes("mpeg") ? "mp3"
    : "webm";

  const groqForm = new FormData();
  groqForm.append(
    "file",
    new Blob([await audio.arrayBuffer()], { type: mime }),
    `audio.${ext}`
  );
  groqForm.append("model", "whisper-large-v3-turbo");
  groqForm.append("language", "fr");
  groqForm.append("response_format", "json");
  groqForm.append("temperature", "0");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqForm,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Groq error:", err);
    return Response.json({ error: "Erreur transcription." }, { status: 500 });
  }

  const data = await res.json();
  return Response.json({ text: data.text ?? "" });
}
