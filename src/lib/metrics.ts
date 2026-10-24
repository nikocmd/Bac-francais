import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

type GeminiUsage = { promptTokenCount?: number; totalTokenCount?: number } | undefined;

// totalTokenCount includes thinking tokens, which are billed as output.
export function trackGemini(feature: string, usage: GeminiUsage, startedAt: number) {
  const input = usage?.promptTokenCount ?? 0;
  const output = Math.max(0, (usage?.totalTokenCount ?? 0) - input);
  after(() => track("gemini", {
    requests: 1,
    [`req_${feature}`]: 1,
    input_tokens: input,
    output_tokens: output,
    ms: Date.now() - startedAt,
  }));
}

export function trackGeminiError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  after(() => track("gemini", { errors: 1, rate_limited: /429|quota|exhausted/i.test(msg) ? 1 : 0 }));
}

export function trackGroq(res: Response, audioSeconds: number, startedAt: number) {
  const h = (k: string) => res.headers.get(`x-ratelimit-${k}`);
  after(() => Promise.all([
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
