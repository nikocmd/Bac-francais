import { z } from "zod";

export const analyseSchema = z.object({
  texte: z.string().min(1, "Le texte est requis").max(5000, "Texte trop long (max 5000 car.)"),
  titre: z.string().max(200).optional().default(""),
  auteur: z.string().max(100).optional().default(""),
  oeuvre: z.string().max(200).optional().default(""),
  axe: z.string().max(300).optional().default(""),
});

export const examenSchema = z.object({
  transcription: z.string().min(1).max(8000),
  oeuvre: z.string().max(200).optional().default(""),
  auteur: z.string().max(100).optional().default(""),
  axe: z.string().max(300).optional().default(""),
  texte: z.string().max(5000).optional().default(""),
});

export const oralSchema = z.object({
  transcription: z.string().min(1).max(8000),
  oeuvre: z.string().max(200).optional().default(""),
  auteur: z.string().max(100).optional().default(""),
  axe: z.string().max(300).optional().default(""),
  texte: z.string().max(5000).optional().default(""),
});

export const oeuvreSchema = z.object({
  question: z.string().min(1).max(1000),
  oeuvre: z.string().max(200).optional().default(""),
  auteur: z.string().max(100).optional().default(""),
});

export const oeuvreAideSchema = z.object({
  question: z.string().min(1).max(1000),
  oeuvre: z.string().max(200).optional().default(""),
  auteur: z.string().max(100).optional().default(""),
  context: z.string().max(2000).optional().default(""),
});

export const grammaireSchema = z.object({
  sujet: z.string().min(1).max(200),
});

export const checkoutSchema = z.object({
  priceId: z.string().min(1).max(100),
});

// Helper: parse + return 400 on failure
export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Zod v4 uses .issues, v3 uses .errors — support both
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zodErr = result.error as any;
    const issues: Array<{ message: string }> = zodErr.issues ?? zodErr.errors ?? [];
    const msg = issues.map((e: { message: string }) => e.message).join(", ");
    return { success: false, error: msg || "Données invalides" };
  }
  return { success: true, data: result.data as z.infer<T> };
}
