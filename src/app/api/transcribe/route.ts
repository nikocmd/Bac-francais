export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio") as File | null;

  if (!audio || audio.size === 0) {
    return Response.json({ error: "Fichier audio manquant." }, { status: 400 });
  }

  // Too short to contain real speech (~5KB minimum ≈ 0.3s of audio)
  if (audio.size < 5000) {
    return Response.json({ inaudible: true });
  }

  const mime = (audio.type || "audio/webm").split(";")[0].toLowerCase();
  const ext = mime.includes("mp4") || mime.includes("m4a") ? "m4a"
    : mime.includes("wav") ? "wav"
    : mime.includes("mp3") || mime.includes("mpeg") ? "mp3"
    : "webm";

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "GROQ_API_KEY manquante — ajoute-la dans Vercel > Settings > Environment Variables puis redéploie" }, { status: 500 });
  }

  const groqForm = new FormData();
  groqForm.append(
    "file",
    new Blob([await audio.arrayBuffer()], { type: mime }),
    `audio.${ext}`
  );
  groqForm.append("model", "whisper-large-v3");
  groqForm.append("language", "fr");
  groqForm.append("response_format", "json");
  groqForm.append("temperature", "0");
  groqForm.append("prompt", "Transcription d'un élève de terminale qui présente un oral de bac de français. Il parle de littérature, d'analyse linéaire, de figures de style, de mouvements littéraires, d'auteurs classiques. Vocabulaire : métaphore, hyperbole, oxymore, chiasme, anaphore, péripétie, dénouement, alexandrin, sonnet, tragédie, comédie, baroque, classicisme, romantisme, réalisme, Molière, Racine, Corneille, Hugo, Baudelaire, Flaubert, Zola.");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: groqForm,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Groq error:", err);
    return Response.json({ error: `Groq ${res.status}: ${err}` }, { status: 500 });
  }

  const data = await res.json();
  const text = (data.text ?? "").trim();

  if (isInaudible(text)) {
    return Response.json({ inaudible: true });
  }

  return Response.json({ text });
}

function isInaudible(text: string): boolean {
  if (text.length < 8) return true;

  // Known Whisper hallucination patterns on silence/noise
  const patterns = [
    /\[(musique|music|applaudissements|rires|bruit|silence|blank_audio)[^\]]*\]/i,
    /sous-titrag/i,
    /sous-titres?\s+(réalisés?|par|de)/i,
    /société\s+radio-canada/i,
    /radio-canada/i,
    /merci\s+d['']avoir\s+regardé/i,
    /abonnez-vous/i,
    /www\./i,
    /sous-titr/i,
  ];
  if (patterns.some(r => r.test(text))) return true;

  // Repeated phrase hallucination (e.g. "Je vous ai dit que" × 10)
  const words = text.split(/\s+/);
  if (words.length >= 8) {
    const phrase = words.slice(0, 5).join(" ").toLowerCase();
    if ((text.toLowerCase().split(phrase).length - 1) >= 3) return true;
  }

  return false;
}
