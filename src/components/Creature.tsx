"use client";
import { motion, AnimatePresence } from "framer-motion";

/* ── 10 Stages ──────────────────────────────────────────────── */
export const ORBE_STAGES = [
  { id: "roche",    name: "Roche",    xpMin: 0,     xpMax: 200,      mood: "Endormi...",     desc: "Ton Orbe sommeille dans l'obscurité. Il attend la lumière du soleil.", tip: "Rends-toi dans un spot solaire pour l'éveiller !",  tipIcon: "💤", color: "#888" },
  { id: "caillou",  name: "Caillou",  xpMin: 200,   xpMax: 500,      mood: "S'étire...",      desc: "Ton Orbe commence à absorber de la lumière. Continue !",               tip: "Explore les spots autour de toi",                    tipIcon: "📍", color: "#A07840" },
  { id: "terria",   name: "Terria",   xpMin: 500,   xpMax: 1000,     mood: "Curieux !",       desc: "Une planète bleue-verte émerge. Ton Orbe prend vie !",                 tip: "3 spots solaires = évolution garantie",              tipIcon: "🌍", color: "#3A80C0" },
  { id: "virida",   name: "Virida",   xpMin: 1000,  xpMax: 2000,     mood: "En fleur !",      desc: "Ton Orbe rayonne de vert. Les nuages l'habillent de blanc.",            tip: "Spot rare détecté à 340m — bonus ×3 XP",             tipIcon: "⭐", color: "#2E8B40" },
  { id: "aquarius", name: "Aquarius", xpMin: 2000,  xpMax: 3500,     mood: "Brillant !",      desc: "Les océans couvrent ton Orbe. Un anneau commence à se former.",         tip: "Challenge : visiter 3 spots rares cette semaine",    tipIcon: "💧", color: "#1468A8" },
  { id: "sylvana",  name: "Sylvana",  xpMin: 3500,  xpMax: 5500,     mood: "Sauvage !",       desc: "Deux lunes orbitent autour de ton Orbe. Il attire les astres !",        tip: "Invite un ami pour un défi double XP",               tipIcon: "🌙", color: "#0D6B4A" },
  { id: "mystica",  name: "Mystica",  xpMin: 5500,  xpMax: 8000,     mood: "Mystérieux !",    desc: "Des brumes violettes enveloppent ton Orbe. Il brille d'étoiles.",        tip: "100 spots visités = badge légendaire",               tipIcon: "✨", color: "#5B28A8" },
  { id: "inferna",  name: "Inferna",  xpMin: 8000,  xpMax: 12000,    mood: "Ardent !",        desc: "Ton Orbe brûle d'énergie solaire. L'anneau de feu pulse sans fin.",      tip: "Streak de 30 jours = titre Maître du Soleil",        tipIcon: "🔥", color: "#C03800" },
  { id: "glacius",  name: "Glacius",  xpMin: 12000, xpMax: 18000,    mood: "Cristallin !",    desc: "Trois anneaux de cristal entourent ton Orbe. Il scintille dans l'espace.", tip: "Partage ton score avec 5 amis",                   tipIcon: "❄️", color: "#0890B0" },
  { id: "solaria",  name: "Solaria",  xpMin: 18000, xpMax: Infinity, mood: "Transcendé ✨",   desc: "Forme ultime. Ton Orbe rayonne comme une étoile. Tu es un champion !",   tip: "Inspire tes amis — partage ton univers",             tipIcon: "🏆", color: "#C88000" },
] as const;

type StageId = typeof ORBE_STAGES[number]["id"];

export function getOrbeStage(xp: number) {
  return ORBE_STAGES.find((s) => xp >= s.xpMin && xp < s.xpMax) ?? ORBE_STAGES[ORBE_STAGES.length - 1];
}

/* ── Reusable blinking eye ──────────────────────────────────── */
function Eye({ cx, cy, pupilColor = "#222", delay = 0, size = 10 }: {
  cx: number; cy: number; pupilColor?: string; delay?: number; size?: number;
}) {
  const pr = size * 0.58;
  const gr = size * 0.2;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <motion.g
        animate={{ scaleY: [1, 1, 1, 1, 0.04, 0.04, 1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", times: [0, 0.42, 0.46, 0.49, 0.51, 0.54, 0.58, 1], delay }}
      >
        <circle r={size} fill="white" />
        <circle r={pr} fill={pupilColor} />
        <circle cx={pr * 0.45} cy={-pr * 0.45} r={gr} fill="rgba(255,255,255,0.85)" />
      </motion.g>
    </g>
  );
}

/* ── Planet SVGs ─────────────────────────────────────────────── */

function RocheSVG() {
  return (
    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle r={56} fill="#7a7a7a" />
      <ellipse cx={-14} cy={9} rx={18} ry={15} fill="rgba(0,0,0,0.12)" />
      <circle cx={-28} cy={-18} r={8} fill="rgba(0,0,0,0.18)" />
      <circle cx={-28} cy={-18} r={5} fill="rgba(0,0,0,0.12)" />
      <circle cx={22} cy={24} r={5} fill="rgba(0,0,0,0.15)" />
      <circle cx={32} cy={-6} r={4} fill="rgba(0,0,0,0.13)" />
      <ellipse cx={-18} cy={-20} rx={20} ry={14} fill="rgba(255,255,255,0.1)" transform="rotate(-25,-18,-20)" />
      <Eye cx={-18} cy={-5} pupilColor="#555" delay={0} size={9} />
      <Eye cx={18} cy={-5} pupilColor="#555" delay={0.3} size={9} />
      <path d="M-27,-14 Q-18,-19 -9,-15" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9,-15 Q18,-19 27,-14" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M-10,16 Q0,12 10,16" stroke="#777" strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.g>
  );
}

function CaillouSVG() {
  return (
    <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
      <circle r={58} fill="#b89460" />
      <ellipse cx={-10} cy={-14} rx={22} ry={16} fill="rgba(255,255,255,0.1)" />
      <ellipse cx={15} cy={20} rx={18} ry={12} fill="rgba(0,0,0,0.08)" />
      <ellipse cx={-22} cy={18} rx={12} ry={10} fill="rgba(255,200,100,0.2)" />
      <ellipse cx={-20} cy={-22} rx={18} ry={13} fill="rgba(255,255,255,0.12)" transform="rotate(-20,-20,-22)" />
      <Eye cx={-18} cy={-4} pupilColor="#5a3a10" delay={0} size={9} />
      <Eye cx={18} cy={-4} pupilColor="#5a3a10" delay={0.4} size={9} />
      <path d="M-27,-4 Q-18,-8 -9,-4" stroke="#8a6030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M9,-4 Q18,-8 27,-4" stroke="#8a6030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-10,16 Q0,17 10,16" stroke="#8a6030" strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.g>
  );
}

function TerriaSVG() {
  return (
    <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
      <circle r={65} fill="rgba(58,128,192,0.1)" />
      <circle r={60} fill="#3A80C0" />
      <ellipse cx={-8} cy={-10} rx={16} ry={14} fill="#3a9048" opacity={0.85} transform="rotate(20,-8,-10)" />
      <ellipse cx={18} cy={14} rx={10} ry={8} fill="#3a9048" opacity={0.65} />
      <ellipse cx={-22} cy={18} rx={8} ry={6} fill="#3a9048" opacity={0.55} />
      <ellipse cx={-18} cy={-22} rx={20} ry={13} fill="rgba(255,255,255,0.14)" transform="rotate(-20,-18,-22)" />
      <Eye cx={-18} cy={-6} pupilColor="#1a3a6a" delay={0} size={10} />
      <Eye cx={18} cy={-6} pupilColor="#1a3a6a" delay={0.2} size={10} />
      <path d="M-27,-16 Q-18,-21 -9,-17" stroke="#4a80c0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9,-17 Q18,-21 27,-16" stroke="#4a80c0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M-10,17 Q0,23 10,17" stroke="#4a80c0" strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.g>
  );
}

function ViridaSVG() {
  return (
    <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
      <circle r={68} fill="rgba(46,139,64,0.1)" />
      <circle r={62} fill="#2E8B40" />
      <ellipse cx={-12} cy={8} rx={20} ry={16} fill="#1a5c28" opacity={0.5} />
      <ellipse cx={20} cy={-10} rx={14} ry={10} fill="#1a5c28" opacity={0.4} />
      <motion.g animate={{ x: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx={-14} cy={-26} rx={15} ry={8} fill="rgba(255,255,255,0.82)" />
        <ellipse cx={-4} cy={-30} rx={10} ry={7} fill="rgba(255,255,255,0.72)" />
      </motion.g>
      <motion.g animate={{ x: [2, -2, 2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx={22} cy={22} rx={13} ry={7} fill="rgba(255,255,255,0.75)" />
      </motion.g>
      <ellipse cx={-20} cy={-24} rx={18} ry={13} fill="rgba(255,255,255,0.14)" transform="rotate(-20,-20,-24)" />
      <Eye cx={-18} cy={-2} pupilColor="#0d3a18" delay={0} size={11} />
      <Eye cx={18} cy={-2} pupilColor="#0d3a18" delay={0.35} size={11} />
      <path d="M-28,-13 Q-18,-19 -8,-14" stroke="#1a6030" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8,-14 Q18,-19 28,-13" stroke="#1a6030" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M-14,18 Q0,28 14,18" stroke="#1a6030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </motion.g>
  );
}

function AquariusSVG() {
  return (
    <motion.g animate={{ y: [0, -9, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {/* Ring back */}
      <path d="M -84 0 A 84 18 0 0 0 84 0" fill="none" stroke="#70c8f0" strokeWidth="4" opacity={0.28} transform="rotate(-20)" />
      <circle r={68} fill="rgba(20,104,168,0.12)" />
      <circle r={62} fill="#1468A8" />
      <ellipse cx={0} cy={-50} rx={22} ry={10} fill="rgba(255,255,255,0.72)" />
      <ellipse cx={0} cy={50} rx={17} ry={8} fill="rgba(255,255,255,0.5)" />
      <ellipse cx={-10} cy={-4} rx={18} ry={12} fill="rgba(255,255,255,0.1)" />
      <ellipse cx={-22} cy={-26} rx={18} ry={12} fill="rgba(255,255,255,0.14)" transform="rotate(-20,-22,-26)" />
      <Eye cx={-18} cy={-4} pupilColor="#082848" delay={0} size={11} />
      <Eye cx={18} cy={-4} pupilColor="#082848" delay={0.25} size={11} />
      <motion.text x="-20" y="-19" fontSize="9" fill="#90d8f8" textAnchor="middle"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>✦</motion.text>
      <motion.text x="20" y="-19" fontSize="9" fill="#90d8f8" textAnchor="middle"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>✦</motion.text>
      <path d="M-14,18 Q0,28 14,18" stroke="#70c8f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Ring front */}
      <path d="M -84 0 A 84 18 0 0 1 84 0" fill="none" stroke="#70c8f0" strokeWidth="4" opacity={0.72} transform="rotate(-20)" />
    </motion.g>
  );
}

function SylvanaSVG() {
  return (
    <motion.g animate={{ y: [0, -9, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
      {/* Ring back */}
      <path d="M -88 0 A 88 20 0 0 0 88 0" fill="none" stroke="#40c890" strokeWidth="3" opacity={0.22} transform="rotate(-18)" />
      <circle r={70} fill="rgba(13,107,74,0.1)" />
      <circle r={63} fill="#0D6B4A" />
      <ellipse cx={-8} cy={5} rx={22} ry={18} fill="#074832" opacity={0.45} />
      <ellipse cx={22} cy={-15} rx={16} ry={12} fill="#074832" opacity={0.35} />
      <ellipse cx={-24} cy={-20} rx={13} ry={9} fill="#1ab87a" opacity={0.35} />
      <ellipse cx={-22} cy={-28} rx={18} ry={12} fill="rgba(255,255,255,0.13)" transform="rotate(-22,-22,-28)" />
      {/* Orbiting moons */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "view-box" as never, transformOrigin: "50% 50%" }}
      >
        <circle cx={96} cy={0} r={9} fill="#b0c8b0" />
        <circle cx={96} cy={0} r={6} fill="#8aaa8a" />
        <ellipse cx={94} cy={-2} rx={4} ry={3} fill="rgba(255,255,255,0.2)" transform="rotate(-10,94,-2)" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "view-box" as never, transformOrigin: "50% 50%" }}
      >
        <circle cx={-96} cy={-22} r={6} fill="#d0e8d0" />
      </motion.g>
      <Eye cx={-18} cy={-4} pupilColor="#022818" delay={0} size={12} />
      <Eye cx={18} cy={-4} pupilColor="#022818" delay={0.3} size={12} />
      <path d="M-29,-16 Q-18,-23 -7,-17" stroke="#0d8a55" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M7,-17 Q18,-23 29,-16" stroke="#0d8a55" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M-15,18 Q0,30 15,18" stroke="#40c890" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ring front */}
      <path d="M -88 0 A 88 20 0 0 1 88 0" fill="none" stroke="#40c890" strokeWidth="3" opacity={0.62} transform="rotate(-18)" />
    </motion.g>
  );
}

function MysticaSVG() {
  return (
    <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}>
      <motion.circle r={80} fill="rgba(91,40,168,0.08)"
        animate={{ r: [80, 86, 80], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
      {/* Ring back */}
      <path d="M -90 0 A 90 22 0 0 0 90 0" fill="none" stroke="#b070f0" strokeWidth="5" opacity={0.18} transform="rotate(-22)" />
      <circle r={70} fill="rgba(91,40,168,0.15)" />
      <circle r={63} fill="#5B28A8" />
      <ellipse cx={-10} cy={-5} rx={24} ry={18} fill="rgba(192,132,252,0.18)" transform="rotate(30,-10,-5)" />
      <ellipse cx={15} cy={15} rx={18} ry={12} fill="rgba(60,15,100,0.3)" />
      <motion.g animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx={-30} cy={-30} r={2.5} fill="#c090fc" />
        <circle cx={35} cy={-22} r={2} fill="#c090fc" />
        <circle cx={-22} cy={35} r={2} fill="#c090fc" />
        <circle cx={30} cy={30} r={1.5} fill="#c090fc" />
      </motion.g>
      <ellipse cx={-22} cy={-28} rx={18} ry={12} fill="rgba(255,255,255,0.1)" transform="rotate(-22,-22,-28)" />
      <Eye cx={-18} cy={-5} pupilColor="#250050" delay={0} size={11} />
      <Eye cx={18} cy={-5} pupilColor="#250050" delay={0.2} size={11} />
      <motion.text x="-20" y="-20" fontSize="10" fill="#c090fc" textAnchor="middle"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>✦</motion.text>
      <motion.text x="20" y="-20" fontSize="10" fill="#c090fc" textAnchor="middle"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.5 }}>✦</motion.text>
      <path d="M-15,18 Q0,30 15,18" stroke="#c090fc" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ring front */}
      <path d="M -90 0 A 90 22 0 0 1 90 0" fill="none" stroke="#b070f0" strokeWidth="5" opacity={0.65} transform="rotate(-22)" />
    </motion.g>
  );
}

function InfernaSVG() {
  return (
    <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
      <motion.circle r={80} fill="rgba(192,56,0,0.1)"
        animate={{ r: [78, 86, 78], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }} />
      {/* Ring back */}
      <motion.path d="M -90 0 A 90 22 0 0 0 90 0" fill="none" stroke="#FF6800" strokeWidth="6" transform="rotate(-18)"
        animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 1.3, repeat: Infinity }} />
      <circle r={63} fill="#C03800" />
      <ellipse cx={-8} cy={5} rx={22} ry={18} fill="#8a2200" opacity={0.5} />
      <path d="M-20,10 Q-5,0 15,20" stroke="#FF5500" strokeWidth="3" fill="none" opacity={0.45} strokeLinecap="round" />
      <path d="M10,-20 Q20,-5 5,25" stroke="#FF7800" strokeWidth="2" fill="none" opacity={0.35} strokeLinecap="round" />
      <motion.ellipse cx={-15} cy={-15} rx={10} ry={8} fill="#FF5500" opacity={0.4}
        animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <motion.ellipse cx={20} cy={20} rx={8} ry={6} fill="#FF5500" opacity={0.3}
        animate={{ opacity: [0.2, 0.55, 0.2] }} transition={{ duration: 1.9, repeat: Infinity, delay: 0.4 }} />
      <ellipse cx={-22} cy={-28} rx={18} ry={12} fill="rgba(255,255,255,0.08)" transform="rotate(-22,-22,-28)" />
      <Eye cx={-18} cy={-5} pupilColor="#580a00" delay={0} size={11} />
      <Eye cx={18} cy={-5} pupilColor="#580a00" delay={0.2} size={11} />
      <path d="M-28,-15 Q-18,-23 -8,-18" stroke="#FF5500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M8,-18 Q18,-23 28,-15" stroke="#FF5500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-15,18 Q0,30 15,18" stroke="#FF7800" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ring front */}
      <motion.path d="M -90 0 A 90 22 0 0 1 90 0" fill="none" stroke="#FF6800" strokeWidth="6" transform="rotate(-18)"
        animate={{ stroke: ["#FF4400", "#FF9900", "#FF4400"], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 1.3, repeat: Infinity }} />
    </motion.g>
  );
}

function GlaciusSVG() {
  return (
    <motion.g animate={{ y: [0, -11, 0] }} transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}>
      <motion.circle r={82} fill="rgba(8,144,176,0.07)"
        animate={{ r: [82, 88, 82] }} transition={{ duration: 2.2, repeat: Infinity }} />
      {/* Ring 1 back */}
      <path d="M -92 0 A 92 20 0 0 0 92 0" fill="none" stroke="#90e8ff" strokeWidth="3" opacity={0.2} transform="rotate(-25)" />
      {/* Ring 2 back */}
      <path d="M -80 0 A 80 14 0 0 0 80 0" fill="none" stroke="#c8f8ff" strokeWidth="2" opacity={0.22} transform="rotate(12)" />
      <circle r={65} fill="#0890B0" />
      <ellipse cx={-14} cy={-20} rx={18} ry={12} fill="rgba(255,255,255,0.15)" transform="rotate(-20,-14,-20)" />
      <ellipse cx={20} cy={15} rx={14} ry={9} fill="rgba(255,255,255,0.1)" />
      <path d="M-25,-10 L-36,-26 L-20,-31 L-10,-20Z" fill="rgba(255,255,255,0.13)" />
      <path d="M20,-5 L30,-21 L38,-10 L28,5Z" fill="rgba(255,255,255,0.1)" />
      <ellipse cx={0} cy={-52} rx={22} ry={10} fill="rgba(255,255,255,0.75)" />
      <ellipse cx={0} cy={52} rx={18} ry={8} fill="rgba(255,255,255,0.6)" />
      <Eye cx={-18} cy={-5} pupilColor="#083848" delay={0} size={11} />
      <Eye cx={18} cy={-5} pupilColor="#083848" delay={0.2} size={11} />
      <motion.text x="-20" y="-20" fontSize="11" fill="#c8f8ff" textAnchor="middle"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.2, repeat: Infinity }}>✦</motion.text>
      <motion.text x="20" y="-20" fontSize="11" fill="#c8f8ff" textAnchor="middle"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}>✦</motion.text>
      <path d="M-15,18 Q0,30 15,18" stroke="#c8f8ff" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ring fronts */}
      <path d="M -92 0 A 92 20 0 0 1 92 0" fill="none" stroke="#90e8ff" strokeWidth="3" opacity={0.65} transform="rotate(-25)" />
      <path d="M -80 0 A 80 14 0 0 1 80 0" fill="none" stroke="#c8f8ff" strokeWidth="2" opacity={0.52} transform="rotate(12)" />
      {/* Thin drifting third ring */}
      <motion.ellipse cx={0} cy={0} rx={104} ry={7} fill="none" stroke="#e8feff" strokeWidth="1.5"
        transform="rotate(4)"
        animate={{ opacity: [0.12, 0.35, 0.12] }} transition={{ duration: 3, repeat: Infinity }} />
    </motion.g>
  );
}

function SolariaSVG() {
  return (
    <motion.g animate={{ y: [0, -12, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
      <motion.circle r={96} fill="rgba(200,128,0,0.07)"
        animate={{ r: [96, 106, 96], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle r={82} fill="rgba(200,128,0,0.09)"
        animate={{ r: [82, 87, 82] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
      {/* Rings back */}
      <path d="M -96 0 A 96 22 0 0 0 96 0" fill="none" stroke="#E5A800" strokeWidth="5" opacity={0.18} transform="rotate(-20)" />
      <path d="M -82 0 A 82 16 0 0 0 82 0" fill="none" stroke="#f87171" strokeWidth="3" opacity={0.18} transform="rotate(14)" />
      <path d="M -106 0 A 106 28 0 0 0 106 0" fill="none" stroke="#a78bfa" strokeWidth="2" opacity={0.14} transform="rotate(-38)" />
      <circle r={67} fill="#C88000" />
      <ellipse cx={-10} cy={-8} rx={26} ry={20} fill="rgba(255,255,255,0.12)" transform="rotate(20,-10,-8)" />
      <ellipse cx={18} cy={20} rx={18} ry={12} fill="rgba(248,113,113,0.2)" />
      <ellipse cx={-20} cy={20} rx={14} ry={10} fill="rgba(167,139,250,0.2)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.circle key={deg}
          cx={Math.cos((deg * Math.PI) / 180) * 82}
          cy={Math.sin((deg * Math.PI) / 180) * 82}
          r={3} fill="#E5A800"
          animate={{ opacity: [0.15, 0.8, 0.15], r: [2, 4, 2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }} />
      ))}
      <Eye cx={-18} cy={-5} pupilColor="#5a2c00" delay={0} size={12} />
      <Eye cx={18} cy={-5} pupilColor="#5a2c00" delay={0.15} size={12} />
      <path d="M-29,-16 Q-18,-25 -7,-17" stroke="#E5A800" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M7,-17 Q18,-25 29,-16" stroke="#E5A800" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[-42, 42, -14, 14].map((ang, i) => (
        <motion.text key={ang}
          x={Math.cos((ang * Math.PI) / 180) * 84}
          y={Math.sin((ang * Math.PI) / 180) * 84}
          fontSize="11" fill={["#f87171", "#a78bfa", "#60c878", "#E5A800"][i]} textAnchor="middle"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}>
          ✦
        </motion.text>
      ))}
      <path d="M-18,18 Q0,34 18,18" stroke="#fff8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Rings front */}
      <motion.path d="M -96 0 A 96 22 0 0 1 96 0" fill="none" stroke="#E5A800" strokeWidth="5" transform="rotate(-20)"
        animate={{ opacity: [0.58, 0.85, 0.58] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <path d="M -82 0 A 82 16 0 0 1 82 0" fill="none" stroke="#f87171" strokeWidth="3" opacity={0.52} transform="rotate(14)" />
      <path d="M -106 0 A 106 28 0 0 1 106 0" fill="none" stroke="#a78bfa" strokeWidth="2" opacity={0.38} transform="rotate(-38)" />
    </motion.g>
  );
}

const PLANET_MAP: Record<StageId, React.ReactNode> = {
  roche:    <RocheSVG />,
  caillou:  <CaillouSVG />,
  terria:   <TerriaSVG />,
  virida:   <ViridaSVG />,
  aquarius: <AquariusSVG />,
  sylvana:  <SylvanaSVG />,
  mystica:  <MysticaSVG />,
  inferna:  <InfernaSVG />,
  glacius:  <GlaciusSVG />,
  solaria:  <SolariaSVG />,
};

/* ── Mini planet (for leaderboards, etc.) ───────────────────── */
export function MiniPlanet({ xp, size = 38 }: { xp: number; size?: number }) {
  const stage = getOrbeStage(xp);
  const idx = ORBE_STAGES.findIndex((s) => s.id === stage.id);
  const hasRing = idx >= 4;
  return (
    <motion.svg
      viewBox="-52 -52 104 104" width={size} height={size}
      animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {hasRing && (
        <ellipse cx={0} cy={0} rx={46} ry={10} fill="none" stroke={stage.color} strokeWidth="2.5" opacity={0.45} transform="rotate(-20)" />
      )}
      <circle r={32} fill={stage.color} />
      <ellipse cx={-11} cy={-12} rx={12} ry={8} fill="rgba(255,255,255,0.18)" transform="rotate(-20,-11,-12)" />
      {/* Eyes */}
      <circle cx={-10} cy={-1} r={6} fill="white" />
      <circle cx={-9} cy={-0.5} r={3.5} fill="rgba(0,0,0,0.55)" />
      <circle cx={-7.5} cy={-2} r={1.2} fill="rgba(255,255,255,0.85)" />
      <circle cx={10} cy={-1} r={6} fill="white" />
      <circle cx={11} cy={-0.5} r={3.5} fill="rgba(0,0,0,0.55)" />
      <circle cx={12.5} cy={-2} r={1.2} fill="rgba(255,255,255,0.85)" />
      {/* Smile */}
      <path d="M-8,10 Q0,16 8,10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {hasRing && (
        <ellipse cx={0} cy={0} rx={46} ry={10} fill="none" stroke={stage.color} strokeWidth="2.5" opacity={0.7}
          transform="rotate(-20)" style={{ clipPath: "inset(50% 0 0 0)" }} />
      )}
    </motion.svg>
  );
}

/* ── Main Orbe Component ────────────────────────────────────── */
interface CreatureProps {
  xp?: number;
  health?: number;
  solarActive?: boolean;
}

export default function Creature({ xp = 1240, health = 82, solarActive = true }: CreatureProps) {
  const stage = getOrbeStage(xp);
  const stageIdx = ORBE_STAGES.findIndex((s) => s.id === stage.id);
  const nextStage = stageIdx < ORBE_STAGES.length - 1 ? ORBE_STAGES[stageIdx + 1] : null;
  const xpInStage = xp - stage.xpMin;
  const xpRange = stage.xpMax === Infinity ? xp : stage.xpMax - stage.xpMin;
  const progress = Math.min(xpInStage / xpRange, 1);

  return (
    <div className="card card-hover p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-bark uppercase tracking-widest mb-1">Ton Orbe</p>
          <p className="font-syne font-800 text-xl text-snow">{stage.name}</p>
          <p className="text-sm mt-0.5 font-500" style={{ color: stage.color }}>{stage.mood}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end mb-1">
            {solarActive && (
              <motion.span className="w-1.5 h-1.5 rounded-full bg-solar"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
            )}
            <span className="text-xs font-space font-700" style={{ color: stage.color }}>
              {xp.toLocaleString("fr-FR")} XP
            </span>
          </div>
          <span className="text-[10px] text-bark">Stade {stageIdx + 1} / 10</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <svg viewBox="-120 -120 240 240" width={180} height={180}>
            <AnimatePresence mode="wait">
              <motion.g key={stage.id}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {PLANET_MAP[stage.id]}
              </motion.g>
            </AnimatePresence>
          </svg>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {nextStage && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-bark">Vers {nextStage.name}</span>
                <span className="font-space font-600" style={{ color: stage.color }}>
                  {(stage.xpMax - xp).toLocaleString("fr-FR")} XP
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: stage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-bark flex items-center gap-1.5">
                Vitalité
                <span className="relative group/tip">
                  <span className="w-3.5 h-3.5 rounded-full border border-bark/35 flex items-center justify-center text-[9px] text-bark/50 cursor-help select-none leading-none hover:border-bark/60 hover:text-bark/80 transition-colors">?</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl text-[10px] leading-relaxed text-snow bg-white shadow-lg border border-black/[0.08] opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-30 text-left whitespace-normal font-inter font-400">
                    La <span className="font-600">Vitalité</span> mesure l&apos;activité solaire récente de ton Orbe. <span className="font-600">100 %</span> = rechargé aujourd&apos;hui. Le pourcentage diminue si ton Orbe n&apos;absorbe pas de lumière pendant plusieurs jours consécutifs.
                  </span>
                </span>
              </span>
              <span style={{ color: health > 60 ? "#5A9E1A" : health > 30 ? "#c08000" : "#c03030" }}>{health}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: health > 60 ? "#6DB82A" : health > 30 ? "#d4a000" : "#e04040" }}
                initial={{ width: 0 }}
                animate={{ width: `${health}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} />
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] leading-snug" style={{ color: stage.color }}>
            <span className="shrink-0">{stage.tipIcon}</span>
            <span>{stage.tip}</span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed border-t pt-3" style={{ color: "rgba(13,31,20,0.5)", borderColor: "rgba(0,0,0,0.06)" }}>
        {stage.desc}
      </p>
    </div>
  );
}
