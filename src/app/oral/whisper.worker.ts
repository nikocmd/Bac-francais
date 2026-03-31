// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { pipeline, env } from "@xenova/transformers";

// Single-threaded WASM for max browser compatibility (Safari included)
env.backends.onnx.wasm.numThreads = 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let asr: any = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, audio } = e.data;

  if (type === "load") {
    try {
      self.postMessage({ type: "status", text: "Chargement du modèle Whisper..." });
      asr = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny",
        {
          quantized: false, // force fp32 — évite les erreurs QDQ/NBits INT4
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progress_callback: (p: any) => {
            if (p.status === "downloading") {
              const pct = p.total ? Math.round((p.loaded / p.total) * 100) : 0;
              self.postMessage({ type: "status", text: `Téléchargement du modèle… ${pct}%` });
            }
          },
        }
      );
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
  }

  if (type === "transcribe") {
    try {
      // audio is a Float32Array at 16000 Hz
      const result = await asr(audio, {
        language: "french",
        task: "transcribe",
        chunk_length_s: 30,
      });
      self.postMessage({ type: "result", text: result.text.trim() });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
  }
};
