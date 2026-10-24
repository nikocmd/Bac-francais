import { trackLLM, trackLLMFailure, type LLMProvider } from "@/lib/metrics";

// Each model has its own free-tier quota: when one is exhausted or down, the next one answers.
const CHAIN: { provider: LLMProvider; model: string }[] = [
  { provider: "gemini", model: "gemini-3.1-flash-lite" },
  { provider: "gemini", model: "gemini-3.5-flash-lite" },
  { provider: "gemini", model: "gemini-2.5-flash-lite" },
  { provider: "groq", model: "openai/gpt-oss-120b" },
  { provider: "groq", model: "qwen/qwen3.8-27b" },
  { provider: "gemini", model: "gemini-2.5-flash" },
];

const CALL_TIMEOUT_MS = 40_000;
const TOTAL_BUDGET_MS = 110_000;

export const AI_BUSY_MESSAGE = "Le service IA est très sollicité en ce moment. Réessaie dans quelques minutes.";
export class AIBusyError extends Error {}

class ProviderError extends Error {
  constructor(public status: number, detail: string) { super(`${status} ${detail.slice(0, 300)}`); }
}

type Result = { text: string; inTok: number; outTok: number };

async function callGemini(model: string, prompt: string, json: boolean, signal: AbortSignal): Promise<Result> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, ...(json ? { responseMimeType: "application/json" } : {}) },
    }),
    signal,
  });
  if (!res.ok) throw new ProviderError(res.status, await res.text());
  const data = await res.json();
  const text: string = (data.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  const inTok = data.usageMetadata?.promptTokenCount ?? 0;
  return { text, inTok, outTok: Math.max(0, (data.usageMetadata?.totalTokenCount ?? 0) - inTok) };
}

async function callGroq(model: string, prompt: string, json: boolean, signal: AbortSignal): Promise<Result> {
  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_completion_tokens: 8000,
    ...(json ? { response_format: { type: "json_object" } } : {}),
    ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
  };
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY ?? ""}` },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new ProviderError(res.status, await res.text());
  const data = await res.json();
  const text = String(data.choices?.[0]?.message?.content ?? "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  return { text, inTok: data.usage?.prompt_tokens ?? 0, outTok: data.usage?.completion_tokens ?? 0 };
}

function isUsable(text: string, json: boolean) {
  if (!text.trim()) return false;
  if (!json) return true;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return false;
  try { JSON.parse(match[0]); return true; } catch { return false; }
}

export async function generate(prompt: string, opts: { feature: string; json?: boolean }): Promise<string> {
  const json = opts.json ?? false;
  const started = Date.now();
  for (const { provider, model } of CHAIN) {
    if (Date.now() - started > TOTAL_BUDGET_MS) break;
    if (provider === "gemini" && !process.env.GEMINI_API_KEY) continue;
    if (provider === "groq" && !process.env.GROQ_API_KEY) continue;

    const t0 = Date.now();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CALL_TIMEOUT_MS);
    try {
      const r = provider === "gemini"
        ? await callGemini(model, prompt, json, ctrl.signal)
        : await callGroq(model, prompt, json, ctrl.signal);
      if (!isUsable(r.text, json)) throw new ProviderError(502, "unusable output");
      trackLLM(provider, model, opts.feature, r.inTok, r.outTok, Date.now() - t0);
      return r.text;
    } catch (err) {
      const status = err instanceof ProviderError ? err.status : 0;
      trackLLMFailure(provider, model, status);
      console.error(`[llm] ${model} failed:`, err instanceof Error ? err.message : err);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new AIBusyError("All AI models failed");
}
