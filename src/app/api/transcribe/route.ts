import { requirePremium } from "@/lib/usage";
import { checkRateLimit } from "@/lib/rateLimit";

export const maxDuration = 60;
const MAX_AUDIO_MB = 20;

export async function POST(request: Request) {
  const usage = await requirePremium();
  if (!usage.allowed) {
    return Response.json({ error: "LIMIT_REACHED" }, { status: 403 });
  }
  if (!checkRateLimit(`transcribe:${usage.userId}`, 20, 60_000)) {
    return Response.json({ error: "Trop de requêtes. Attends 1 minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const audio = formData.get("audio") as File | null;

  if (!audio || audio.size === 0) {
    return Response.json({ error: "Fichier audio manquant." }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_MB * 1024 * 1024) {
    return Response.json({ error: `Fichier trop volumineux (max ${MAX_AUDIO_MB}MB).` }, { status: 400 });
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
    console.error("Groq error:", res.status, err);
    // Invalid/corrupt audio (too short, partial recording) → treat as inaudible
    if (res.status === 400) return Response.json({ inaudible: true });
    return Response.json({ error: "Erreur de transcription. Réessaie." }, { status: 500 });
  }

  const data = await res.json();
  const text = (data.text ?? "").trim();

  if (isInaudible(text)) {
    return Response.json({ inaudible: true });
  }

  return Response.json({ text });
}

function isInaudible(text: string): boolean {
  // Empty or single char
  if (text.length < 3) return true;

  // Exact known Whisper silence hallucinations (specific enough to never match real speech)
  const patterns = [
    /\[(musique|music|applaudissements|rires|silence|blank_audio)[^\]]*\]/i,
    /société\s+radio-canada/i,
    /sous-titrage\s+société/i,
    /merci\s+d['']avoir\s+regardé/i,
    /abonnez-vous\s+à/i,
    /www\.[a-z]/i,
  ];
  if (patterns.some(r => r.test(text))) return true;

  // Repeated phrase hallucination (e.g. "Je vous ai dit que" × 5+)
  const words = text.split(/\s+/);
  if (words.length >= 12) {
    const phrase = words.slice(0, 5).join(" ").toLowerCase();
    if ((text.toLowerCase().split(phrase).length - 1) >= 4) return true;
  }

  return false;
}
