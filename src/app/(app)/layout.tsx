"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-forest">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 z-40 bg-white"
        style={{ borderRight: "1px solid rgba(0,0,0,0.07)" }}>

        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full border border-solar-dim/40 group-hover:border-solar-dim transition-colors" />
              <div className="absolute inset-1.5 rounded-full bg-solar group-hover:shadow-[0_0_10px_rgba(109,184,42,0.5)] transition-all" />
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <div key={deg} className="absolute w-0.5 h-1 bg-solar-dim/70 rounded-full origin-bottom"
                  style={{ left:"50%", bottom:"50%", transform:`translateX(-50%) rotate(${deg}deg) translateY(-12px)` }} />
              ))}
            </div>
            <span className="font-syne font-800 text-xl tracking-wider text-snow group-hover:text-solar-dim transition-colors">
              OFF<span className="text-solar-dim">GRID</span>
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
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors duration-200 relative"
                  whileHover={{ x: active ? 0 : 2 }}
                  style={{
                    color: active ? item.color : "#637A6E",
                    background: active ? item.bg : undefined,
                  }}
                >
                  {active && (
                    <motion.div layoutId="activeNav"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: item.bg, border: `1px solid ${item.color}30` }}
                      transition={{ type: "spring", stiffness: 350, damping: 35 }} />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-inter font-500"
                    style={{ color: active ? item.color : undefined }}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Orbe XP strip */}
        <div className="mx-3 mb-3 p-3 rounded-xl"
          style={{ background: "rgba(46,139,64,0.07)", border: "1px solid rgba(46,139,64,0.18)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-bark">Ton Orbe — Virida</span>
            <span className="text-[11px] font-space font-600" style={{ color: "#2E8B40" }}>1 240 XP</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: "#2E8B40" }}
              initial={{ width: 0 }} animate={{ width: "24%" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }} />
          </div>
          <p className="text-[10px] text-bark/70 mt-1">760 XP avant Aquarius</p>
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-forest transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-700"
              style={{ background: "linear-gradient(135deg, #A8FF3E, #6DB82A)", color: "#0D1F14" }}>
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-snow text-xs font-600 truncate">Mathieu R.</p>
              <p className="text-bark text-[10px] truncate">Rang #2 841 · Stade 4/10</p>
            </div>
            <Link href="/" className="text-bark hover:text-snow transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full border border-solar-dim/40" />
              <div className="absolute inset-1 rounded-full bg-solar" />
            </div>
            <span className="font-syne font-800 text-lg tracking-wider text-snow">
              OFF<span className="text-solar-dim">GRID</span>
            </span>
          </Link>
          <div className="flex gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className="p-2 rounded-lg transition-colors"
                style={{ color: pathname === item.href ? item.color : "#637A6E" }}>
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
