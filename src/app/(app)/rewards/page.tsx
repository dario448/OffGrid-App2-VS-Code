"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const REWARDS = [
  { id: 1,  name: "Place de cinéma",      pts: 500, category: "culture",  emoji: "🎬", available: true,  desc: "Valable dans tous les cinémas partenaires",   popular: true,  likes: 1284, color: "#A78BFA", bg: "rgba(167,139,250,0.1)"  },
  { id: 2,  name: "Musée national",       pts: 300, category: "culture",  emoji: "🏛️", available: true,  desc: "Entrée pour 1 personne",                       popular: false, likes: 432,  color: "#38BDF8", bg: "rgba(56,189,248,0.1)"   },
  { id: 3,  name: "Concert / Festival",   pts: 800, category: "culture",  emoji: "🎵", available: false, desc: "Places de concert et festivals partenaires",    popular: true,  likes: 2341, color: "#F472B6", bg: "rgba(244,114,182,0.1)"  },
  { id: 4,  name: "Café & Brunch bio",    pts: 250, category: "food",     emoji: "☕", available: true,  desc: "Bon de réduction chez nos partenaires bio",     popular: true,  likes: 1876, color: "#FCD34D", bg: "rgba(252,211,77,0.08)"  },
  { id: 5,  name: "Livre éco-conçu",      pts: 200, category: "shopping", emoji: "📚", available: true,  desc: "Sélection de livres sur l'écologie",            popular: false, likes: 398,  color: "#34D399", bg: "rgba(52,211,153,0.08)"  },
  { id: 6,  name: "Transport vélo",       pts: 150, category: "mobility", emoji: "🚲", available: true,  desc: "30 min de vélo libre-service",                  popular: true,  likes: 3102, color: "#A8FF3E", bg: "rgba(168,255,62,0.08)"  },
  { id: 7,  name: "Yoga & Bien-être",     pts: 400, category: "sport",    emoji: "🧘", available: true,  desc: "Cours d'essai offert",                          popular: false, likes: 621,  color: "#2DD4BF", bg: "rgba(45,212,191,0.08)"  },
  { id: 8,  name: "Plantez un arbre",     pts: 100, category: "nature",   emoji: "🌳", available: true,  desc: "On plante un arbre en ton nom",                 popular: true,  likes: 4218, color: "#6DB82A", bg: "rgba(109,184,42,0.08)"  },
  { id: 9,  name: "Cours de cuisine bio", pts: 350, category: "food",     emoji: "🥗", available: true,  desc: "Atelier 2h dans un restaurant partenaire",      popular: false, likes: 287,  color: "#FB923C", bg: "rgba(251,146,60,0.08)"  },
  { id: 10, name: "Pass musée 1 mois",    pts: 600, category: "culture",  emoji: "🎨", available: true,  desc: "Accès illimité à 12 musées partenaires",        popular: false, likes: 514,  color: "#818CF8", bg: "rgba(129,140,248,0.08)" },
];

const HISTORY = [
  { date: "12 mai 2025",   reward: "Place de cinéma",   pts: -500, status: "Utilisé", color: "#A78BFA" },
  { date: "28 avril 2025", reward: "Café & Brunch bio", pts: -250, status: "Utilisé", color: "#FCD34D" },
  { date: "10 avril 2025", reward: "Transport vélo",    pts: -150, status: "Expiré",  color: "#4B5563" },
];

const CATEGORIES = ["Tout", "Populaire", "culture", "food", "shopping", "mobility", "sport", "nature"];
const CAT_LABELS: Record<string, string> = {
  "Tout": "✦ Tout", "Populaire": "🔥 Populaire",
  "culture": "🎭 Culture", "food": "🥗 Food", "shopping": "🛍 Shopping",
  "mobility": "🚲 Mobilité", "sport": "🏃 Sport", "nature": "🌿 Nature",
};

export default function RewardsPage() {
  const [filter, setFilter]       = useState("Tout");
  const [selected, setSelected]   = useState<number | null>(null);
  const [exchanged, setExchanged] = useState<number[]>([]);
  const points = 1240;

  const filtered = filter === "Populaire" ? REWARDS.filter(r => r.popular)
    : filter === "Tout" ? REWARDS
    : REWARDS.filter(r => r.category === filter);

  const selectedReward = REWARDS.find(r => r.id === selected);
  const handleExchange = (id: number, pts: number) => {
    if (points >= pts) { setExchanged(prev => [...prev, id]); setSelected(null); }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-1/3 w-56 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #FCD34D, transparent)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-8 left-1/4 w-40 h-28 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #A8FF3E, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-sm mb-1" style={{ color: "rgba(252,211,77,0.7)" }}>Récompenses</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Tes points, <span style={{ color: "#FCD34D" }}>ton choix.</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="font-space font-700 text-4xl text-white leading-none">{points.toLocaleString("fr-FR")}</p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>points disponibles</p>
            </div>
            <div className="flex flex-col gap-2" style={{ minWidth: 150 }}>
              <div className="flex justify-between text-[11px]">
                <span style={{ color: "rgba(255,255,255,0.45)" }}>Prochain palier</span>
                <span className="text-white font-600">Badge Or</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#D97706,#FCD34D)" }}
                  initial={{ width: 0 }} animate={{ width: `${(points / 1500) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
              </div>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>260 pts manquants</p>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 20 }}>
              <p className="font-space font-700 text-2xl text-white">900</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>échangés</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Filtres ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-4 py-1.5 rounded-full text-xs font-600 transition-all duration-200"
            style={filter === cat
              ? { background: cat === "Populaire" ? "#DC2626" : "linear-gradient(135deg,#6DB82A,#A8FF3E)", color: "#060D08" }
              : { border: "1px solid rgba(255,255,255,0.09)", color: "rgba(230,245,224,0.5)", background: "rgba(255,255,255,0.03)" }}>
            {CAT_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* ── Populaire bandeau ─────────────────────────────── */}
      <AnimatePresence>
        {filter === "Populaire" && (
          <motion.div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="text-xl">🔥</span>
            <p className="text-xs text-bark">
              Les <span className="font-600 text-snow">récompenses préférées</span> de la communauté OffGrid et de tes amis.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid ─────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r, i) => {
          const canAfford   = points >= r.pts;
          const isExchanged = exchanged.includes(r.id);
          return (
            <motion.button key={r.id}
              className="card text-left flex flex-col overflow-hidden relative"
              style={{ opacity: canAfford || isExchanged ? 1 : 0.4 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: canAfford || isExchanged ? 1 : 0.4, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !isExchanged && r.available && canAfford && setSelected(r.id)}
              whileHover={canAfford && !isExchanged && r.available ? { y: -3, boxShadow: `0 12px 40px ${r.color}25, 0 0 0 1px ${r.color}20` } : {}}>

              {/* Colored top accent */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />

              {/* Emoji + badges */}
              <div className="px-5 pt-6 pb-4 flex items-start justify-between" style={{ background: r.bg }}>
                <span className="text-4xl drop-shadow-sm">{r.emoji}</span>
                <div className="flex flex-col items-end gap-1.5">
                  {r.popular && !isExchanged && (
                    <span className="text-[9px] font-700 px-2 py-0.5 rounded-full text-white"
                      style={{ background: "#DC2626" }}>🔥 Populaire</span>
                  )}
                  {isExchanged && (
                    <span className="text-[10px] font-700 px-2 py-0.5 rounded-full"
                      style={{ color: "#A8FF3E", background: "rgba(168,255,62,0.12)", border: "1px solid rgba(168,255,62,0.2)" }}>
                      ✓ Obtenu
                    </span>
                  )}
                  {!r.available && !isExchanged && (
                    <span className="text-[10px] text-bark px-2 py-0.5 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Bientôt</span>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 flex flex-col gap-2 flex-1">
                <div className="mt-3">
                  <p className="font-syne font-700 text-snow text-sm">{r.name}</p>
                  <p className="text-[11px] text-bark mt-0.5 leading-tight">{r.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="font-space font-700 text-sm" style={{ color: r.color }}>{r.pts} pts</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-bark/50">❤️ {r.likes.toLocaleString("fr-FR")}</span>
                    {canAfford && !isExchanged && r.available && (
                      <span className="text-[10px] font-700 px-2 py-0.5 rounded-full"
                        style={{ color: r.color, border: `1px solid ${r.color}44`, background: `${r.color}10` }}>
                        Échanger
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Modal échange ─────────────────────────────────── */}
      <AnimatePresence>
        {selected && selectedReward && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,13,8,0.88)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}>
            <motion.div className="card w-full max-w-sm overflow-hidden"
              style={{ border: `1px solid ${selectedReward.color}30` }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden" style={{ background: selectedReward.bg }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${selectedReward.color}15, transparent 70%)` }} />
                <span className="text-6xl relative">{selectedReward.emoji}</span>
                <h2 className="font-syne font-700 text-snow text-lg mt-3">{selectedReward.name}</h2>
                <p className="text-bark text-sm mt-1">{selectedReward.desc}</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center p-3 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-bark text-sm">Coût</span>
                  <span className="font-space font-700" style={{ color: selectedReward.color }}>{selectedReward.pts} pts</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-bark text-sm">Solde après</span>
                  <span className="font-space font-700 text-snow">{points - selectedReward.pts} pts</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-xl text-bark text-sm hover:text-snow transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    Annuler
                  </button>
                  <motion.button onClick={() => handleExchange(selectedReward.id, selectedReward.pts)}
                    className="flex-1 py-3 rounded-xl font-syne font-700 text-sm"
                    style={{ background: selectedReward.color, color: "#060D08" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Confirmer →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Historique ────────────────────────────────────── */}
      <div className="card p-6">
        <p className="font-syne font-700 text-snow mb-4">Historique d'échanges</p>
        <div className="flex flex-col gap-1">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: h.color, opacity: 0.6 }} />
              <div className="flex-1">
                <p className="text-sm text-snow">{h.reward}</p>
                <p className="text-[11px] text-bark">{h.date}</p>
              </div>
              <div className="text-right">
                <p className="font-space text-sm" style={{ color: h.color }}>{h.pts} pts</p>
                <p className="text-[10px] text-bark">{h.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
