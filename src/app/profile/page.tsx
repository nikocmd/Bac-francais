"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Save, LogOut, User, Mail, PenLine } from "lucide-react";
import { getRankInfo, loadHunter } from "@/lib/gamification";

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
  const hunter = typeof window !== "undefined" ? loadHunter() : null;

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser({ id: user.id, email: user.email ?? "" });

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username ?? user.user_metadata?.username ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
        setAvatarPreview(profile.avatar_url ?? "");
      } else {
        setUsername(user.user_metadata?.username ?? "");
      }
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
      updated_at: new Date().toISOString(),
    });

    if (upsErr) { setError(upsErr.message); setSaving(false); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  }

  async function handleLogout() {
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
