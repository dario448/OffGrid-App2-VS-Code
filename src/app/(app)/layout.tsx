"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { useRef, useState } from "react";
import { useProfile, saveProfile, type Profile } from "@/lib/useProfile";

const NAV = [
  {
    href: "/dashboard", label: "Tableau de bord",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    color: "#5A9E1A",
    bg: "rgba(168,255,62,0.15)",
  },
  {
    href: "/map", label: "Carte solaire",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.72 12.06a.5.5 0 0 0 .56 0C12.95 21.5 20 15.4 20 10a8 8 0 0 0-8-8z"/></svg>,
    color: "#0284C7",
    bg: "rgba(56,189,248,0.12)",
  },
  {
    href: "/rewards", label: "Récompenses",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    color: "#D97706",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    href: "/community", label: "Communauté",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: "#7C3AED",
    bg: "rgba(139,92,246,0.12)",
  },
  {
    href: "/avatar", label: "Mon Avatar",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(-25 12 12)"/></svg>,
    color: "#0D9488",
    bg: "rgba(13,148,136,0.12)",
  },
  {
    href: "/duels", label: "Duels",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>,
    color: "#DC2626",
    bg: "rgba(220,38,38,0.10)",
  },
];

function ProfileAvatar({ photo, initial, size = 32 }: { photo: string | null; initial: string; size?: number }) {
  return photo ? (
    <img src={photo} alt="profil" className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0"
      style={{ width: size, height: size, background: "linear-gradient(135deg,#A8FF3E,#6DB82A)", color: "#0D1F14" }}>
      {initial}
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { profile } = useProfile();
  const [draft, setDraft] = useState<Profile>({ ...profile });
  const [saved, setSaved]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft(d => ({ ...d, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveProfile(draft);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <motion.div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(242,248,238,0.88)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        style={{ border: "1px solid rgba(109,184,42,0.2)" }}
        initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}>
        <h2 className="font-syne font-700 text-snow text-lg mb-5">Modifier mon profil</h2>

        {/* Photo */}
        <div className="flex items-center gap-4 mb-5">
          <ProfileAvatar photo={draft.photo} initial={draft.firstName[0] ?? "M"} size={56} />
          <div>
            <p className="text-xs text-bark mb-1">Photo de profil</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <button onClick={() => fileRef.current?.click()}
              className="text-xs font-600 px-3 py-1.5 rounded-lg border transition-colors hover:text-snow"
              style={{ borderColor: "rgba(0,0,0,0.12)" }}>
              {draft.photo ? "Changer la photo" : "Ajouter une photo"}
            </button>
            {draft.photo && (
              <button onClick={() => setDraft(d => ({ ...d, photo: null }))}
                className="text-xs text-bark/50 ml-2 hover:text-red-500 transition-colors">
                Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Nom / prénom */}
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label className="text-xs text-bark mb-1 block">Prénom</label>
            <input
              value={draft.firstName}
              onChange={e => setDraft(d => ({ ...d, firstName: e.target.value.slice(0, 24) }))}
              className="w-full px-3 py-2.5 rounded-xl border text-snow text-sm focus:outline-none"
              style={{ background: "rgba(0,0,0,0.03)", borderColor: "rgba(109,184,42,0.35)" }}
              maxLength={24}
            />
          </div>
          <div>
            <label className="text-xs text-bark mb-1 block">Nom (initial)</label>
            <input
              value={draft.lastName}
              onChange={e => setDraft(d => ({ ...d, lastName: e.target.value.slice(0, 16) }))}
              className="w-full px-3 py-2.5 rounded-xl border text-snow text-sm focus:outline-none"
              style={{ background: "rgba(0,0,0,0.03)", borderColor: "rgba(109,184,42,0.35)" }}
              maxLength={16}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-bark text-sm hover:text-snow transition-colors"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            Annuler
          </button>
          <motion.button onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl font-syne font-700 text-sm text-white"
            style={{ background: saved ? "#16a34a" : "#6DB82A" }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {saved ? "✓ Sauvegardé" : "Enregistrer"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useProfile();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-forest">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 z-40"
        style={{
          background: "linear-gradient(180deg, #0B1F10 0%, #0F2418 55%, #0A1C0F 100%)",
          borderRight: "1px solid rgba(109,184,42,0.12)",
        }}>

        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full border border-solar/50 group-hover:border-solar transition-colors" />
              <div className="absolute inset-1.5 rounded-full bg-solar group-hover:shadow-[0_0_14px_rgba(168,255,62,0.6)] transition-all" />
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <div key={deg} className="absolute w-0.5 h-1 bg-solar/60 rounded-full origin-bottom"
                  style={{ left:"50%", bottom:"50%", transform:`translateX(-50%) rotate(${deg}deg) translateY(-12px)` }} />
              ))}
            </div>
            <span className="font-syne font-800 text-xl tracking-wider text-white group-hover:text-solar transition-colors">
              OFF<span className="text-solar">GRID</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 pt-4">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 relative"
                  whileHover={{ x: active ? 0 : 3 }}
                  style={{ color: active ? item.color : "rgba(255,255,255,0.45)" }}
                >
                  {active && (
                    <motion.div layoutId="activeNav"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
                      transition={{ type: "spring", stiffness: 350, damping: 35 }} />
                  )}
                  <span className="relative z-10" style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                  <span className="relative z-10 font-inter font-500"
                    style={{ color: active ? item.color : "rgba(255,255,255,0.55)" }}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div className="absolute right-3 w-1.5 h-1.5 rounded-full"
                      style={{ background: item.color }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }} />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Orbe XP strip */}
        <div className="mx-3 mb-3 p-3 rounded-xl"
          style={{ background: "rgba(168,255,62,0.06)", border: "1px solid rgba(168,255,62,0.14)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Ton Orbe — Virida</span>
            <span className="text-[11px] font-space font-600 text-solar">1 240 XP</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #6DB82A, #A8FF3E)" }}
              initial={{ width: 0 }} animate={{ width: "24%" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }} />
          </div>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>760 XP avant Aquarius</p>
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 px-2 py-2 rounded-xl w-full text-left group transition-all duration-200"
            style={{ background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <ProfileAvatar photo={profile.photo} initial={profile.firstName[0] ?? "M"} size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-600 truncate">{profile.firstName} {profile.lastName}</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>Rang #2 841 · Stade 4/10</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
      </AnimatePresence>

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{ background: "#0B1F10", borderBottom: "1px solid rgba(109,184,42,0.15)" }}>
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full border border-solar/50" />
              <div className="absolute inset-1 rounded-full bg-solar" />
            </div>
            <span className="font-syne font-800 text-lg tracking-wider text-white">
              OFF<span className="text-solar">GRID</span>
            </span>
          </Link>
          <div className="flex gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className="p-2 rounded-lg transition-colors"
                style={{ color: pathname === item.href ? item.color : "rgba(255,255,255,0.4)" }}>
                {item.icon}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
