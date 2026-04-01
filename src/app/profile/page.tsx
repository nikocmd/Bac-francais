"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Save, LogOut, User, Mail, PenLine } from "lucide-react";

const GRAMMAR_TOPICS = [
  "La négation",
  "L'interrogation",
  "Les propositions subordonnées",
  "Les propositions relatives",
  "Les propositions complétives",
  "Les propositions circonstancielles",
  "Les valeurs des temps verbaux",
  "Les temps et modes verbaux",
  "Les fonctions grammaticales (sujet, COD, COI…)",
  "Les types de phrases (déclarative, interrogative, exclamative, impérative)",
  "La voix active et la voix passive",
  "Les expansions du nom",
  "Les classes grammaticales (nom, verbe, adjectif…)",
  "Les connecteurs logiques",
  "Les discours rapportés (direct, indirect, indirect libre)",
  "Les valeurs du présent",
  "Les valeurs de l'imparfait",
  "Les valeurs du passé simple",
  "Les propositions indépendantes / coordonnées / juxtaposées",
];
import { getRankInfo, loadHunterFromDB, type HunterData } from "@/lib/gamification";

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [grammarQuestions, setGrammarQuestions] = useState<string[]>(GRAMMAR_TOPICS.slice(0, 3));
  const [filiere, setFiliere] = useState<"general" | "stmg">("general");
  const [hunter, setHunter] = useState<HunterData | null>(null);

  useEffect(() => {
    async function load() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser({ id: user.id, email: user.email ?? "" });

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, grammar_questions, filiere")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username ?? user.user_metadata?.username ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
        setAvatarPreview(profile.avatar_url ?? "");
        const gq = profile.grammar_questions;
        setGrammarQuestions(gq && gq.length > 0 ? gq.filter((q: string) => GRAMMAR_TOPICS.includes(q)) : GRAMMAR_TOPICS.slice(0, 3));
        setFiliere(profile.filiere === "stmg" ? "stmg" : "general");
      } else {
        setUsername(user.user_metadata?.username ?? "");
      }
      const h = await loadHunterFromDB(user.id);
      setHunter(h);
      setLoading(false);
    }
    load();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!user) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    setSaving(true);
    setError("");
    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });
      if (upErr) { setError("Erreur upload image."); setSaving(false); return; }
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      newAvatarUrl = data.publicUrl + `?t=${Date.now()}`;
      setAvatarUrl(newAvatarUrl);
    }

    const { error: upsErr } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      avatar_url: newAvatarUrl,
      grammar_questions: grammarQuestions,
      filiere,
      updated_at: new Date().toISOString(),
    });

    if (upsErr) { setError(upsErr.message); setSaving(false); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  }

  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 size={28} className="text-[#1a9fff] animate-spin" />
    </div>
  );

  const ri = hunter ? getRankInfo(hunter.level) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#0a1543] border border-[#19327f] shadow-[0_0_15px_rgba(26,159,255,0.2)]">
          <PenLine size={22} className="text-[#1a9fff]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Mon Profil</h1>
          <p className="text-[#6b7280] text-sm">Personnalise ton compte</p>
        </div>
      </div>

      {/* Avatar + rang */}
      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6
        shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full border-2 border-[#1a9fff]/60 overflow-hidden
            bg-[#050a2e] shadow-[0_0_20px_rgba(26,159,255,0.3)]">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-[#2a3a6e]" />
                </div>
            }
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#1a9fff] hover:bg-[#00d9ff]
              text-[#050a2e] transition-all shadow-lg">
            <Camera size={13} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <div className="space-y-1">
          <p className="font-black text-white text-lg">{username || "Élève"}</p>
          <p className="text-[#6b7280] text-sm flex items-center gap-1.5">
            <Mail size={13} /> {user?.email}
          </p>
          {ri && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded border border-[#1a9fff]/40 bg-[#1a9fff]/10
                text-[#00d9ff] font-bold tracking-widest">
                {ri.title}
              </span>
              <span className="text-xs text-[#FFD700] font-mono font-bold">LV.{hunter?.level}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-5
        shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur">
        <h2 className="text-xs font-black text-[#FFD700] uppercase tracking-widest">✦ Informations</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Pseudo</label>
          <input
            value={username} onChange={e => setUsername(e.target.value)}
            className="w-full bg-[#050a2e] border border-[#19327f]/60 rounded-xl px-4 py-3 text-sm
              text-white placeholder-[#2a3a6e] focus:outline-none focus:border-[#1a9fff]/60 transition-colors"
            placeholder="Ton pseudo"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Email</label>
          <input
            value={user?.email ?? ""} disabled
            className="w-full bg-[#050a2e]/50 border border-[#19327f]/30 rounded-xl px-4 py-3 text-sm
              text-[#6b7280] cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#a0b0d0] uppercase tracking-widest">Ma filière</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setFiliere("general")}
              className={`p-4 rounded-xl border text-left transition-all ${filiere === "general"
                ? "bg-[#1a9fff]/10 border-[#1a9fff]/60 shadow-[0_0_12px_rgba(26,159,255,0.2)]"
                : "bg-[#050a2e] border-[#19327f]/40 hover:border-[#19327f]"}`}>
              <p className="text-white font-black text-sm">📚 Bac Général</p>
              <p className="text-[#6b7280] text-xs mt-1">16 textes au programme</p>
              <p className="text-[#6b7280] text-xs">Spécialités — voie générale</p>
            </button>
            <button type="button" onClick={() => setFiliere("stmg")}
              className={`p-4 rounded-xl border text-left transition-all ${filiere === "stmg"
                ? "bg-[#FFD700]/10 border-[#FFD700]/40 shadow-[0_0_12px_rgba(255,215,0,0.2)]"
                : "bg-[#050a2e] border-[#19327f]/40 hover:border-[#19327f]"}`}>
              <p className="text-white font-black text-sm">📊 Bac Techno</p>
              <p className="text-[#FFD700] text-xs mt-1">12 textes max</p>
              <p className="text-[#6b7280] text-xs">STMG, STI2D, ST2S…</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-emerald-400 text-sm font-bold">
            ✓ Profil mis à jour !
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black tracking-widest text-sm
            uppercase bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all disabled:opacity-50
            shadow-[0_0_15px_rgba(26,159,255,0.3)]">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {/* Questions de grammaire */}
      <div className="bg-[#0a1543]/80 border border-[#19327f] rounded-2xl p-6 space-y-5
        shadow-[0_0_20px_rgba(25,50,127,0.3)] backdrop-blur">
        <div>
          <h2 className="text-xs font-black text-[#FFD700] uppercase tracking-widest">✦ Questions de grammaire</h2>
          <p className="text-[#6b7280] text-xs mt-1">Sélectionne les sujets qui seront tirés au sort pendant le mode examen</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GRAMMAR_TOPICS.map((topic) => {
            const selected = grammarQuestions.includes(topic);
            return (
              <button key={topic} type="button"
                onClick={() => setGrammarQuestions(prev =>
                  selected ? prev.filter(q => q !== topic) : [...prev, topic]
                )}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selected
                    ? "bg-[#1a9fff]/15 border-[#1a9fff]/60 text-[#00d9ff] shadow-[0_0_8px_rgba(26,159,255,0.2)]"
                    : "bg-[#050a2e] border-[#19327f]/40 text-[#6b7280] hover:border-[#19327f] hover:text-[#a0b0d0]"
                }`}>
                {selected ? "✓ " : ""}{topic}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#a0b0d0] font-mono">{grammarQuestions.length} sujet(s) sélectionné(s)</p>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black tracking-widest text-sm
            uppercase bg-[#1a9fff] hover:bg-[#00d9ff] text-[#050a2e] transition-all disabled:opacity-50
            shadow-[0_0_15px_rgba(26,159,255,0.3)]">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-[#0a1543]/80 border border-red-500/20 rounded-2xl p-6
        shadow-[0_0_20px_rgba(239,68,68,0.1)] backdrop-blur">
        <h2 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">✦ Session</h2>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
            bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
          <LogOut size={15} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
