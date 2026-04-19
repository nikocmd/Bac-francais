"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Mic, Library, GraduationCap, LayoutDashboard, User, LogOut, FileText, Crown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/analyse", label: "Analyse", icon: BookOpen },
  { href: "/oral", label: "Oral", icon: Mic },
  { href: "/oeuvre", label: "Œuvre", icon: Library },
  { href: "/examen", label: "Examen", icon: GraduationCap },
  { href: "/mes-textes", label: "Données", icon: FileText },
];

interface Profile { username: string; avatar_url: string; is_premium: boolean }

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === "METS_TON_URL_ICI") { setAuthReady(true); return; }
    let sub: { unsubscribe: () => void } | null = null;
    let firstLoad = true;
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      async function load() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setProfile(null);
          setUserId(null);
          setAuthReady(true);
          return;
        }
        setUserId(user.id);
        const { data } = await supabase.from("profiles").select("username, avatar_url, is_premium").eq("id", user.id).single();
        if (data) setProfile(data);
        else setProfile({ username: user.user_metadata?.username ?? "Élève", avatar_url: "", is_premium: false });
        setAuthReady(true);
      }
      load();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event) => {
        if (firstLoad) { firstLoad = false; return; }
        load();
      });
      sub = subscription;
    });
    return () => sub?.unsubscribe();
  }, []);

  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    setUserId(null);
    setShowLogoutConfirm(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-[#19327f]/40 bg-[#050510]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-lg flex-shrink-0">
          <img src="/logo.svg" alt="logo" className="w-7 h-7 flex-shrink-0" />
          <span className="gradient-text">BacFrançaisAI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                path === href
                  ? "bg-[#1a9fff]/20 text-[#00d9ff] border border-[#1a9fff]/30"
                  : "text-[#6b7280] hover:text-[#e8e8f0] hover:bg-[#0a1543]"
              )}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
          <Link href="/dashboard"
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-1",
              path === "/dashboard"
                ? "bg-[#1a9fff] text-[#050510] font-black shadow-[0_0_12px_rgba(26,159,255,0.4)]"
                : "bg-[#1a9fff]/20 text-[#00d9ff] hover:bg-[#1a9fff]/30 border border-[#1a9fff]/30"
            )}>
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button className="md:hidden p-2 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#0a1543] transition-all"
          onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* User avatar */}
        <div className="relative hidden md:block">
          {!authReady ? (
            <div className="w-8 h-8 rounded-full bg-[#0a1543] border border-[#19327f]/40 animate-pulse" />
          ) : userId ? (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-[#19327f]/60
                  hover:border-[#1a9fff]/40 hover:bg-[#0a1543] transition-all">
                <div className="w-8 h-8 rounded-full border border-[#1a9fff]/50 overflow-hidden bg-[#050a2e]
                  shadow-[0_0_8px_rgba(26,159,255,0.3)] flex items-center justify-center">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    : <User size={16} className="text-[#1a9fff]" />}
                </div>
                <span className="hidden md:block text-sm font-bold text-[#e8e8f0] max-w-[100px] truncate">
                  {profile?.username ?? "Élève"}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#0a1543] border border-[#19327f]
                  rounded-xl shadow-[0_0_20px_rgba(25,50,127,0.5)] overflow-hidden z-50">
                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#a0b0d0]
                      hover:bg-[#19327f]/30 hover:text-white transition-colors">
                    <User size={14} /> Mon profil
                  </Link>
                  {profile?.is_premium ? (
                    <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#FFD700]">
                      <Crown size={14} /> <span className="font-black">Premium actif 👑</span>
                    </div>
                  ) : (
                    <Link href="/premium" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#FFD700]
                        hover:bg-[#FFD700]/10 transition-colors">
                      <Crown size={14} /> Passer Premium
                    </Link>
                  )}
                  <button onClick={() => { setMenuOpen(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400
                      hover:bg-red-500/10 transition-colors">
                    <LogOut size={14} /> Se déconnecter
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login"
              className="px-4 py-2 rounded-lg bg-[#1a9fff]/20 text-[#00d9ff] border border-[#1a9fff]/30
                text-sm font-bold hover:bg-[#1a9fff]/30 transition-all">
              Connexion
            </Link>
          )}
        </div>
      </div>


      {/* Mobile menu déroulant */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#19327f]/30 bg-[#050510]/98 backdrop-blur-md">
          <div className="flex flex-col px-4 py-3 space-y-1">
            {[...links, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  path === href
                    ? "bg-[#1a9fff]/20 text-[#00d9ff] border border-[#1a9fff]/30"
                    : "text-[#6b7280] hover:text-white hover:bg-[#0a1543]"
                )}>
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="border-t border-[#19327f]/30 pt-2 mt-1">
              {userId ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#a0b0d0] hover:text-white hover:bg-[#0a1543] transition-all">
                    <User size={18} /> Mon profil
                  </Link>
                  <button onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={18} /> Se déconnecter
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#1a9fff] hover:bg-[#1a9fff]/10 transition-all font-bold">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

    {/* Modal confirmation déconnexion */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-[#0a1543] border border-red-500/40 rounded-2xl p-8 max-w-sm w-full space-y-5 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <LogOut size={32} className="text-red-400 mx-auto" />
          <h3 className="text-xl font-black text-white">Se déconnecter ?</h3>
          <p className="text-[#a0b0d0] text-sm">Tu seras redirigé vers la page de connexion.</p>
          <button onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest text-sm transition-all">
            Confirmer
          </button>
          <button onClick={() => setShowLogoutConfirm(false)}
            className="w-full py-2 text-xs text-[#6b7280] hover:text-white transition-colors">
            Annuler
          </button>
        </div>
      </div>
    )}
    </>
  );
}
