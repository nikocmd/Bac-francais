import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// after() throws outside a request scope; metrics must never break the caller.
const later = (task: () => Promise<unknown>) => { try { after(task); } catch {} };

async function track(service: string, metrics: Record<string, number>) {
  try {
    const admin = createAdminClient();
    await Promise.all(
      Object.entries(metrics)
        .filter(([, v]) => v > 0)
        .map(([metric, value]) =>
          admin.rpc("increment_metric", { p_service: service, p_metric: metric, p_value: Math.round(value) }))
    );
  } catch {}
}

async function setStatus(service: string, data: Record<string, unknown>) {
  try {
    await createAdminClient().from("service_status").upsert({ service, data, updated_at: new Date().toISOString() });
  } catch {}
}

export type LLMProvider = "gemini" | "groq";

// USD per 1M tokens (input, output) on paid tiers, used to estimate cost even while on free tiers.
const PRICES: Record<string, [number, number]> = {
  "gemini-3.1-flash-lite": [0.25, 1.5],
  "gemini-3.5-flash-lite": [0.3, 2.5],
  "gemini-2.5-flash-lite": [0.1, 0.4],
  "gemini-2.5-flash": [0.3, 2.5],
  "openai/gpt-oss-120b": [0.15, 0.6],
  "qwen/qwen3.8-27b": [0.3, 0.6],
};

const slug = (model: string) => model.replace(/[^a-z0-9]+/gi, "_");
const serviceOf = (provider: LLMProvider) => (provider === "gemini" ? "gemini" : "groq_llm");

export function trackLLM(provider: LLMProvider, model: string, feature: string, inTok: number, outTok: number, ms: number) {
  const [pin, pout] = PRICES[model] ?? [0, 0];
  later(() => track(serviceOf(provider), {
    requests: 1,
    [`req_${feature}`]: 1,
    [`model_${slug(model)}`]: 1,
    input_tokens: inTok,
    output_tokens: outTok,
    cost_micro_usd: inTok * pin + outTok * pout,
    ms,
  }));
}

export function trackLLMFailure(provider: LLMProvider, model: string, status: number) {
  later(() => track(serviceOf(provider), {
    errors: 1,
    rate_limited: status === 429 ? 1 : 0,
    [`fail_${slug(model)}`]: 1,
  }));
}

export function trackGroq(res: Response, audioSeconds: number, startedAt: number) {
  const h = (k: string) => res.headers.get(`x-ratelimit-${k}`);
  later(() => Promise.all([
    track("groq", {
      requests: 1,
      audio_seconds: audioSeconds,
      ms: Date.now() - startedAt,
      rate_limited: res.status === 429 ? 1 : 0,
      errors: res.ok ? 0 : 1,
    }),
    h("limit-requests") ? setStatus("groq", {
      limit_requests: Number(h("limit-requests")),
      remaining_requests: Number(h("remaining-requests")),
      reset_requests: h("reset-requests"),
      limit_audio_seconds: Number(h("limit-audio-seconds")),
      remaining_audio_seconds: Number(h("remaining-audio-seconds")),
      reset_audio_seconds: h("reset-audio-seconds"),
    }) : Promise.resolve(),
  ]));
}
