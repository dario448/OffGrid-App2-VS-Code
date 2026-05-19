"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Creature from "@/components/Creature";
import { useProfile } from "@/lib/useProfile";

/* ── Animated number ─────────────────────────────────────── */
function AnimNum({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const dur = 1600, start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(parseFloat((e * target).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, decimals]);
  return <>{decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString("fr-FR")}</>;
}

/* ── Circular progress ring ──────────────────────────────── */
function RingProgress({ pct, size = 96, stroke = 7, color = "#A8FF3E", children }: {
  pct: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ── Battery widget ──────────────────────────────────────── */
function BatteryWidget() {
  const level = 78;
  return (
    <div className="card card-hover p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-bark uppercase tracking-widest mb-1">Batterie OffGrid</p>
          <p className="font-syne font-700 text-lg text-snow">Autonomie estimée</p>
          <p className="text-bark text-sm mt-0.5">2 jours · 4 heures</p>
        </div>
        <RingProgress pct={level} size={88} stroke={6} color="#A8FF3E">
          <div className="text-center">
            <span className="font-space font-700 text-xl leading-none text-gradient">{level}</span>
            <span className="text-[10px] text-bark block">%</span>
          </div>
        </RingProgress>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { label: "Puissance solaire", value: "3.2 W", accent: "#A8FF3E" },
          { label: "Produit auj.", value: "18.4 Wh", accent: "#E6F5E0" },
          { label: "Dernière sync", value: "2 min", accent: "#E6F5E0" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-space font-700 text-sm" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-[10px] text-bark mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: "#A8FF3E" }}>
        <motion.span className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "#A8FF3E" }}
          animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 3px #A8FF3E", "0 0 10px #A8FF3E", "0 0 3px #A8FF3E"] }}
          transition={{ duration: 1.5, repeat: Infinity }} />
        Panneau solaire actif — recharge en cours
      </div>
    </div>
  );
}

/* ── CO2 widget ──────────────────────────────────────────── */
const CO2_PERIODS = {
  today:   { label: "Auj.", value: 247,   equiv: "≈ 1.5 km en voiture", bars: [
    { label: "L", value: 110 }, { label: "M", value: 178 }, { label: "M", value: 82 },
    { label: "J", value: 219 }, { label: "V", value: 151 }, { label: "S", value: 247, active: true },
    { label: "D", value: 0 },
  ]},
  month:   { label: "Mois", value: 1240,  equiv: "≈ 7.5 km en voiture", bars: [
    { label: "S1", value: 280 }, { label: "S2", value: 350 },
    { label: "S3", value: 256 }, { label: "S4", value: 354, active: true },
  ]},
  year:    { label: "Année", value: 14200, equiv: "≈ 86 km en voiture", bars: [
    { label: "J", value: 820 },  { label: "F", value: 1050 }, { label: "M", value: 1300 },
    { label: "A", value: 1150 }, { label: "M", value: 1480 }, { label: "J", value: 1390 },
    { label: "J", value: 1250 }, { label: "A", value: 1580 }, { label: "S", value: 1680 },
    { label: "O", value: 1450 }, { label: "N", value: 1150 }, { label: "D", value: 1850, active: true },
  ]},
  alltime: { label: "Total", value: 28400, equiv: "≈ 173 km en voiture", bars: [
    { label: "2022", value: 4200 }, { label: "2023", value: 7800 },
    { label: "2024", value: 10200 }, { label: "2025", value: 14200, active: true },
  ]},
} as const;

type Period = keyof typeof CO2_PERIODS;

function CO2Widget() {
  const [period, setPeriod] = useState<Period>("today");
  const [hovered, setHovered] = useState<number | null>(null);
  const data = CO2_PERIODS[period];

  const fmtVal = (v: number) => v === 0 ? "—" : v >= 1000 ? `${(v / 1000).toFixed(2)} kg` : `${v} g`;
  const maxVal = Math.max(...data.bars.map(b => b.value));
  const BAR_H = 60;

  return (
    <div className="card card-hover p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] text-bark uppercase tracking-widest mb-2">CO₂ évité</p>
          <AnimatePresence mode="wait">
            <motion.div key={period} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <div className="flex items-end gap-2 leading-none">
                <span className="font-space font-700 text-4xl text-gradient">
                  <AnimNum target={data.value >= 1000 ? parseFloat((data.value / 1000).toFixed(2)) : data.value} decimals={data.value >= 1000 ? 2 : 0} />
                </span>
                <span className="text-bark text-sm mb-1">{data.value >= 1000 ? "kg" : "g"} CO₂</span>
              </div>
              <p className="text-[11px] text-bark mt-1.5">{data.equiv}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {(Object.keys(CO2_PERIODS) as Period[]).map((p) => (
            <button key={p} onClick={() => { setPeriod(p); setHovered(null); }}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-600 transition-all duration-200"
              style={period === p
                ? { background: "linear-gradient(135deg,#6DB82A,#A8FF3E)", color: "#060D08" }
                : { color: "rgba(230,245,224,0.4)", background: "rgba(255,255,255,0.04)" }}>
              {CO2_PERIODS[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <AnimatePresence mode="wait">
        <motion.div key={`chart-${period}`} className="relative"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

          {/* Tooltip */}
          <AnimatePresence>
            {hovered !== null && (
              <motion.div className="absolute z-20 pointer-events-none"
                style={{ left: `${((hovered + 0.5) / data.bars.length) * 100}%`, bottom: "calc(100% + 4px)", transform: "translateX(-50%)" }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.12 }}>
                <div className="rounded-lg px-2 py-1 text-[10px] font-space font-700 whitespace-nowrap"
                  style={{ background: "#162512", border: "1px solid rgba(168,255,62,0.3)", color: "#A8FF3E" }}>
                  {fmtVal(data.bars[hovered]?.value ?? 0)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-1.5" style={{ height: BAR_H + 20 }}>
            {data.bars.map((bar, i) => {
              const h = maxVal > 0 ? (bar.value / maxVal) * BAR_H : 0;
              const isActive = "active" in bar && bar.active;
              const isHover = hovered === i;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                  <motion.div className="w-full rounded-md"
                    style={{
                      background: isActive
                        ? "linear-gradient(180deg, #A8FF3E, #6DB82A)"
                        : isHover
                        ? "rgba(168,255,62,0.35)"
                        : "rgba(168,255,62,0.12)",
                      boxShadow: isActive ? "0 0 12px rgba(168,255,62,0.3)" : "none",
                    }}
                    initial={{ height: 0 }} animate={{ height: h }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }} />
                  <span className="text-[9px] truncate w-full text-center"
                    style={{ color: isHover || isActive ? "#A8FF3E" : "rgba(230,245,224,0.3)" }}>
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { label: "Ce mois", value: "1 240g" },
          { label: "Cette année", value: "14.2kg" },
          { label: "Rang amis", value: "🥇 #1" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="font-space text-sm font-600 text-snow">{s.value}</p>
            <p className="text-[10px] text-bark">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Quick stats ─────────────────────────────────────────── */
function QuickStats() {
  const stats = [
    { label: "Points OffGrid", value: "1 240", unit: "pts", icon: "⭐", trend: "+48 ce mois",  color: "#A8FF3E",  glow: "rgba(168,255,62,0.12)" },
    { label: "Rang mondial",   value: "#2 841", unit: "",   icon: "🌍", trend: "↑ 120 places", color: "#38BDF8",  glow: "rgba(56,189,248,0.10)" },
    { label: "Streak",         value: "14",    unit: "j",  icon: "🔥", trend: "Record: 21j",   color: "#FB923C",  glow: "rgba(251,146,60,0.10)" },
    { label: "Amis actifs",    value: "8",     unit: "/12",icon: "👥", trend: "3 en ligne",    color: "#A78BFA",  glow: "rgba(167,139,250,0.10)" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label}
          className="card card-hover p-5 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.07 }}>
          {/* Colored top border */}
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[1.25rem]"
            style={{ background: `linear-gradient(90deg, ${s.color}00, ${s.color}, ${s.color}00)` }} />
          {/* Glow corner */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-8 translate-x-8"
            style={{ background: `radial-gradient(circle, ${s.glow}, transparent 70%)` }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: s.glow }}>
                {s.icon}
              </div>
              <span className="text-[10px] font-600 px-2 py-0.5 rounded-full"
                style={{ color: s.color, background: `${s.color}14` }}>
                {s.trend}
              </span>
            </div>
            <p className="font-space font-700 text-2xl leading-none" style={{ color: s.color }}>
              {s.value}
              <span className="text-sm text-bark font-400 ml-0.5">{s.unit}</span>
            </p>
            <p className="text-[11px] text-bark mt-1.5">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Activity feed ───────────────────────────────────────── */
function ActivityFeed() {
  const events = [
    { time: "Il y a 2 min",  text: "Panneau solaire actif — 3.2W captés",               icon: "☀️", color: "#A8FF3E" },
    { time: "Il y a 1h",     text: "Sophie T. t'a dépassé dans le classement",           icon: "👥", color: "#38BDF8" },
    { time: "Il y a 3h",     text: "50g CO₂ évités · Badge « Semaine verte » débloqué",  icon: "🌿", color: "#34D399" },
    { time: "Hier 18:32",    text: "Smartphone rechargé via USB-C",                       icon: "⚡", color: "#A78BFA" },
    { time: "Hier 12:10",    text: "Spot solaire repéré : Parc de la Villette",           icon: "📍", color: "#FCD34D" },
    { time: "Il y a 2j",     text: "Récompense échangée : 1 place de cinéma",             icon: "🎁", color: "#F472B6" },
  ];
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="font-syne font-700 text-snow">Activité récente</p>
        <span className="text-[11px] text-bark">Tout voir →</span>
      </div>
      <div className="flex flex-col gap-1">
        {events.map((e, i) => (
          <motion.div key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-default"
            style={{ background: "transparent" }}
            onMouseEnter={ev => (ev.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={ev => (ev.currentTarget.style.background = "transparent")}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}>
            {/* Left accent bar */}
            <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: e.color, opacity: 0.6 }} />
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: `${e.color}14` }}>
              {e.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-snow font-400 truncate">{e.text}</p>
              <p className="text-[10px] text-bark mt-0.5">{e.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Missions ────────────────────────────────────────────── */
function MissionsWidget() {
  const missions = [
    { icon: "⚡", title: "Recharge solaire",  desc: "10 min dans un spot",        progress: 7,  total: 10, xp: 50,  color: "#A8FF3E" },
    { icon: "⭐", title: "Spot rare",          desc: "Recharge dans un spot rare", progress: 0,  total: 1,  xp: 200, color: "#FCD34D" },
    { icon: "🌿", title: "CO₂ évité",         desc: "Économiser 50g aujourd'hui", progress: 37, total: 50, xp: 100, color: "#34D399" },
    { icon: "👥", title: "Défi ami",           desc: "Défier Sophie T.",           progress: 0,  total: 1,  xp: 150, color: "#A78BFA" },
  ];
  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <p className="font-syne font-700 text-snow text-sm">Missions du jour</p>
        <span className="text-[10px] font-600 text-gradient">+500 XP dispo</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {missions.map((m, i) => (
          <motion.div key={i} className="flex items-start gap-3"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
              style={{ background: `${m.color}15` }}>
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <p className="text-xs text-snow font-600 truncate">{m.title}</p>
                <span className="text-[10px] font-space font-700 flex-shrink-0" style={{ color: m.color }}>+{m.xp} XP</span>
              </div>
              <p className="text-[10px] text-bark mb-1.5">{m.desc}</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.progress / m.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }} />
              </div>
              <p className="text-[9px] text-bark mt-1">{m.progress}/{m.total}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="pt-3 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] text-bark">Reset dans <span className="font-600" style={{ color: "#A8FF3E" }}>14h 23min</span></p>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { profile } = useProfile();
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 left-1/3 w-72 h-48 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #A8FF3E, transparent)", filter: "blur(48px)" }} />
          <div className="absolute -bottom-8 right-1/4 w-52 h-32 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #6DB82A, transparent)", filter: "blur(32px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-5">
          <div className="flex items-center gap-4">
            {profile.photo ? (
              <img src={profile.photo} alt="profil"
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                style={{ boxShadow: "0 0 0 2px #A8FF3E, 0 0 24px rgba(168,255,62,0.35)" }} />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-syne font-800 text-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#A8FF3E,#6DB82A)", color: "#060D08", boxShadow: "0 0 24px rgba(168,255,62,0.3)" }}>
                {profile.firstName[0] ?? "M"}
              </div>
            )}
            <div>
              <p className="text-sm mb-0.5" style={{ color: "rgba(168,255,62,0.55)" }}>Lundi 19 mai · Paris, FR</p>
              <h1 className="font-syne font-800 text-3xl text-white">
                Bonjour {profile.firstName} <span style={{ color: "#A8FF3E" }}>👋</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(168,255,62,0.1)", border: "1px solid rgba(168,255,62,0.25)" }}>
              <motion.span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#A8FF3E" }}
                animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 4px #A8FF3E", "0 0 12px #A8FF3E", "0 0 4px #A8FF3E"] }}
                transition={{ duration: 1.6, repeat: Infinity }} />
              <span className="text-xs font-600" style={{ color: "#A8FF3E" }}>Solaire actif · 3.2W</span>
            </div>
            <div className="flex gap-5 text-right">
              <div>
                <p className="font-space font-700 text-xl text-white leading-none">78%</p>
                <p className="text-[10px] text-bark mt-0.5">Batterie</p>
              </div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 20 }}>
                <p className="font-space font-700 text-xl text-gradient leading-none">1 240</p>
                <p className="text-[10px] text-bark mt-0.5">Points XP</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick stats ───────────────────────────────────── */}
      <QuickStats />

      {/* ── Orbe + Missions ──────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Creature xp={1240} health={82} solarActive />
        </div>
        <MissionsWidget />
      </div>

      {/* ── Battery + CO2 ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <BatteryWidget />
        <CO2Widget />
      </div>

      {/* ── Activity ─────────────────────────────────────── */}
      <ActivityFeed />
    </div>
  );
}
