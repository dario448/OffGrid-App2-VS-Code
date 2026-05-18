"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Creature from "@/components/Creature";

/* ── Animated number ─────────────────────────────────────── */
function AnimNum({ target, decimals = 0, suffix = "" }: { target: number; decimals?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const dur = 1800, start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(parseFloat((e * target).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, decimals]);
  return <>{decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString("fr-FR")}{suffix}</>;
}

/* ── Battery widget ──────────────────────────────────────── */
function BatteryWidget() {
  const level = 78;
  return (
    <div className="card card-hover p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-bark uppercase tracking-widest mb-1">Batterie OffGrid</p>
          <p className="font-syne font-700 text-2xl text-snow">Chargée à</p>
        </div>
        <motion.span
          className="font-space font-700 text-4xl text-solar"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Battery bar */}
      <div className="relative h-8 rounded-full bg-forest-3/30 overflow-hidden border border-forest-3/60">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #6DB82A, #A8FF3E)",
            boxShadow: "0 0 20px rgba(168,255,62,0.3)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-space text-xs text-forest font-700 mix-blend-difference">{level}% — Autonomie estimée : 2j 4h</span>
        </div>
      </div>

      {/* Stats sous la barre */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-black/[0.06]">
        {[
          { label: "Puissance solaire", value: "3.2W", active: true },
          { label: "Énergie produite aujourd'hui", value: "18.4 Wh", active: false },
          { label: "Dernière sync", value: "Il y a 2 min", active: false },
        ].map((s) => (
          <div key={s.label}>
            <p className={`font-space font-600 text-sm ${s.active ? "text-solar-dim" : "text-snow"}`}>{s.value}</p>
            <p className="text-[11px] text-bark mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Indicateur panneau solaire actif */}
      <div className="flex items-center gap-2 text-xs text-solar-dim">
        <motion.span className="w-2 h-2 rounded-full bg-solar-dim"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }} />
        Panneau solaire actif — recharge en cours
      </div>
    </div>
  );
}

/* ── CO2 widget ──────────────────────────────────────────── */
const CO2_PERIODS = {
  today: {
    label: "Aujourd'hui",
    value: 247, unit: "g",
    equiv: "≈ 1.5 km en voiture évités",
    bars: [
      { h: 40, label: "L", value: 110 },
      { h: 65, label: "M", value: 178 },
      { h: 30, label: "M", value: 82 },
      { h: 80, label: "J", value: 219 },
      { h: 55, label: "V", value: 151 },
      { h: 90, label: "S", value: 247, active: true },
      { h: 45, label: "D", value: 0 },
    ],
  },
  month: {
    label: "Ce mois",
    value: 1240, unit: "g",
    equiv: "≈ 7.5 km en voiture évités",
    bars: [
      { h: 60, label: "S1", value: 280 },
      { h: 75, label: "S2", value: 350 },
      { h: 55, label: "S3", value: 256 },
      { h: 90, label: "S4", value: 354, active: true },
    ],
  },
  year: {
    label: "Cette année",
    value: 14200, unit: "g",
    equiv: "≈ 86 km en voiture évités",
    bars: [
      { h: 40, label: "J", value: 820 },
      { h: 55, label: "F", value: 1050 },
      { h: 70, label: "M", value: 1300 },
      { h: 60, label: "A", value: 1150 },
      { h: 80, label: "M", value: 1480 },
      { h: 75, label: "J", value: 1390 },
      { h: 65, label: "J", value: 1250 },
      { h: 85, label: "A", value: 1580 },
      { h: 90, label: "S", value: 1680 },
      { h: 78, label: "O", value: 1450 },
      { h: 60, label: "N", value: 1150 },
      { h: 95, label: "D", value: 1850, active: true },
    ],
  },
  alltime: {
    label: "All time",
    value: 28400, unit: "g",
    equiv: "≈ 173 km en voiture évités",
    bars: [
      { h: 30, label: "2022", value: 4200 },
      { h: 55, label: "2023", value: 7800 },
      { h: 75, label: "2024", value: 10200 },
      { h: 95, label: "2025", value: 14200, active: true },
    ],
  },
} as const;

type Period = keyof typeof CO2_PERIODS;

function CO2Widget() {
  const [period, setPeriod] = useState<Period>("today");
  const [clickedBar, setClickedBar] = useState<number | null>(null);
  const data = CO2_PERIODS[period];

  const fmtBarVal = (v: number) =>
    v === 0 ? "—" : v >= 1000 ? `${(v / 1000).toFixed(2)} kg` : `${v} g`;

  return (
    <div className="card card-hover p-6 flex flex-col gap-4">
      {/* Header + tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-bark uppercase tracking-widest">CO₂ évité</p>
        <div className="flex gap-1">
          {(Object.keys(CO2_PERIODS) as Period[]).map((p) => (
            <button key={p} onClick={() => { setPeriod(p); setClickedBar(null); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-600 transition-all duration-200 ${
                period === p
                  ? "bg-solar text-forest"
                  : "text-bark hover:text-snow hover:bg-forest-3/30"
              }`}>
              {CO2_PERIODS[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Valeur principale */}
      <AnimatePresence mode="wait">
        <motion.div key={period} className="flex items-end gap-2"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <span className="font-space font-700 text-5xl text-solar leading-none">
            <AnimNum
              target={data.value >= 1000 ? parseFloat((data.value / 1000).toFixed(2)) : data.value}
              decimals={data.value >= 1000 ? 2 : 0}
            />
          </span>
          <span className="text-bark text-sm mb-1">
            {data.value >= 1000 ? "kg" : "g"} CO₂
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Équivalence */}
      <AnimatePresence mode="wait">
        <motion.p key={`eq-${period}`}
          className="text-[11px] text-solar-dim/80 -mt-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          {data.equiv}
        </motion.p>
      </AnimatePresence>

      {/* Bar chart */}
      <AnimatePresence mode="wait">
        <motion.div key={`chart-${period}`}
          className="relative"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}>

          {/* Tooltip flottant au-dessus du batonnet cliqué */}
          <AnimatePresence>
            {clickedBar !== null && (
              <motion.div
                key={`tip-${clickedBar}`}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${((clickedBar + 0.5) / data.bars.length) * 100}%`,
                  bottom: "100%",
                  transform: "translateX(-50%)",
                  paddingBottom: 6,
                }}
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.15 }}>
                <div className="bg-snow border border-solar/50 rounded-lg px-2 py-1 text-[10px] font-space font-600 text-solar whitespace-nowrap shadow-lg">
                  {fmtBarVal(data.bars[clickedBar]?.value ?? 0)}
                </div>
                <div className="w-0 h-0 mx-auto"
                  style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid rgba(168,255,62,0.5)" }} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-1 h-14">
            {data.bars.map((bar, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => setClickedBar(clickedBar === i ? null : i)}
              >
                <motion.div
                  className="w-full rounded-sm"
                  style={{
                    background: ("active" in bar && bar.active)
                      ? "#6DB82A"
                      : clickedBar === i
                      ? "rgba(109,184,42,0.45)"
                      : "rgba(109,184,42,0.18)",
                    boxShadow: ("active" in bar && bar.active)
                      ? "0 0 8px rgba(109,184,42,0.35)"
                      : clickedBar === i
                      ? "0 0 6px rgba(109,184,42,0.25)"
                      : "none",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.h}%` }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
                />
                <span className={`text-[9px] truncate w-full text-center transition-colors ${clickedBar === i ? "text-solar-dim" : "text-bark/50"}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
        <div>
          <p className="font-space text-sm text-snow">1 240g</p>
          <p className="text-[11px] text-bark">Ce mois-ci</p>
        </div>
        <div>
          <p className="font-space text-sm text-snow">14.2kg</p>
          <p className="text-[11px] text-bark">Cette année</p>
        </div>
        <div>
          <p className="font-space text-sm text-solar-dim font-700">🥇 #1</p>
          <p className="text-[11px] text-bark">Parmi tes amis</p>
        </div>
      </div>
    </div>
  );
}

/* ── Quick stats ─────────────────────────────────────────── */
function QuickStats() {
  const stats = [
    { label: "Points OffGrid", value: "1 240", unit: "pts", icon: "⭐", trend: "+48 ce mois",  accent: "#5A9E1A" },
    { label: "Rang mondial",   value: "#2 841", unit: "",   icon: "🌍", trend: "↑ 120 places", accent: "#0284C7" },
    { label: "Streak",         value: "14",    unit: "j",  icon: "🔥", trend: "Record : 21j",  accent: "#EA580C" },
    { label: "Amis actifs",    value: "8",     unit: "/12",icon: "👥", trend: "3 en ligne",    accent: "#7C3AED" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="card card-hover p-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
        >
          {/* Tint background */}
          <div className="absolute inset-0 rounded-[1.25rem] opacity-10"
            style={{ background: `radial-gradient(ellipse at top left, ${s.accent}, transparent 70%)` }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{s.icon}</span>
              <span className="text-[10px] font-600 px-2 py-0.5 rounded-full"
                style={{ color: s.accent, background: `${s.accent}18` }}>
                {s.trend}
              </span>
            </div>
            <p className="font-space font-700 text-xl text-snow">
              {s.value}<span className="text-sm text-bark ml-0.5">{s.unit}</span>
            </p>
            <p className="text-[11px] text-bark mt-0.5">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Activity feed ───────────────────────────────────────── */
function ActivityFeed() {
  const events = [
    { time: "Il y a 2 min",  text: "Panneau solaire actif — 3.2W captés",         type: "solar" },
    { time: "Il y a 1h",     text: "Sophie T. t'a dépassé dans le classement",    type: "social" },
    { time: "Il y a 3h",     text: "50g CO₂ évités · Badge \"Semaine verte\" débloqué", type: "co2" },
    { time: "Hier 18:32",    text: "Smartphone rechargé via USB-C",                type: "charge" },
    { time: "Hier 12:10",    text: "Spot solaire repéré : Parc de la Villette",    type: "map" },
    { time: "Il y a 2j",     text: "Récompense échangée : 1 place de cinéma",     type: "reward" },
  ];
  const colors: Record<string, string> = {
    solar: "text-solar-dim", social: "text-blue-600", co2: "text-emerald-600",
    charge: "text-purple-600", map: "text-amber-600", reward: "text-pink-600",
  };
  const icons: Record<string, string> = {
    solar: "☀️", social: "👥", co2: "🌿", charge: "⚡", map: "📍", reward: "🎁",
  };
  return (
    <div className="card p-6">
      <p className="font-syne font-700 text-snow mb-5">Activité récente</p>
      <div className="flex flex-col divide-y divide-forest-3/20">
        {events.map((e, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <span className="text-base mt-0.5">{icons[e.type]}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${colors[e.type]}`}>{e.text}</p>
              <p className="text-[11px] text-bark mt-0.5">{e.time}</p>
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
    { icon: "⚡", title: "Recharge solaire", desc: "10 min dans un spot", progress: 7, total: 10, xp: 50, tag: "Quotidienne" },
    { icon: "⭐", title: "Spot rare", desc: "Recharge dans un spot rare", progress: 0, total: 1, xp: 200, tag: "Hebdo" },
    { icon: "🌿", title: "CO₂ évité", desc: "Économiser 50g aujourd'hui", progress: 37, total: 50, xp: 100, tag: "Hebdo" },
    { icon: "👥", title: "Défi ami", desc: "Défier Sophie T.", progress: 0, total: 1, xp: 150, tag: "Social" },
  ];
  const tagColor: Record<string, string> = {
    Quotidienne: "text-solar-dim bg-solar-dim/10",
    Hebdo: "text-blue-600 bg-blue-600/10",
    Social: "text-purple-600 bg-purple-600/10",
  };
  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <p className="font-syne font-700 text-snow text-sm">Missions</p>
        <span className="text-[10px] text-solar-dim font-600">+500 XP dispo</span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {missions.map((m, i) => (
          <motion.div key={i} className="flex items-start gap-2"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <span className="text-base mt-0.5 shrink-0">{m.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-xs text-snow font-600 truncate">{m.title}</p>
                <span className="text-[10px] font-space text-solar-dim shrink-0 font-600">+{m.xp} XP</span>
              </div>
              <p className="text-[10px] text-bark truncate mb-1">{m.desc}</p>
              <div className="h-1 rounded-full bg-forest-3/30 overflow-hidden">
                <motion.div className="h-full rounded-full bg-solar"
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.progress / m.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }} />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-600 ${tagColor[m.tag]}`}>{m.tag}</span>
                <span className="text-[9px] text-bark">{m.progress}/{m.total}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="pt-2 border-t border-forest-3/20 text-center">
        <p className="text-[10px] text-bark">Reset dans <span className="text-solar-dim font-600">14h 23min</span></p>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-bark text-sm">Dimanche 18 mai · Paris, FR</p>
          <h1 className="font-syne font-800 text-3xl text-snow mt-0.5">
            Bonjour Mathieu <span className="text-solar">👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(109,184,42,0.08)", border: "1px solid rgba(109,184,42,0.22)" }}>
          <motion.span className="w-2 h-2 rounded-full bg-solar-dim"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-solar-dim text-xs font-600">Panneau solaire actif · 3.2W</span>
        </div>
      </motion.div>

      {/* Lumio + Missions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Creature xp={1240} health={82} solarActive />
        </div>
        <MissionsWidget />
      </div>

      {/* Quick stats */}
      <QuickStats />

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BatteryWidget />
        <CO2Widget />
      </div>

      {/* Activity */}
      <ActivityFeed />
    </div>
  );
}
