"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const REWARDS = [
  { id: 1, name: "Place de cinéma",     pts: 500,  category: "culture",  emoji: "🎬", available: true,  desc: "Valable dans tous les cinémas partenaires" },
  { id: 2, name: "Musée national",      pts: 300,  category: "culture",  emoji: "🏛️", available: true,  desc: "Entrée pour 1 personne" },
  { id: 3, name: "Concert / Festival",  pts: 800,  category: "culture",  emoji: "🎵", available: false, desc: "Places de concert et festivals partenaires" },
  { id: 4, name: "Café & Brunch bio",   pts: 250,  category: "food",     emoji: "☕", available: true,  desc: "Bon de réduction chez nos partenaires bio" },
  { id: 5, name: "Livre éco-conçu",     pts: 200,  category: "shopping", emoji: "📚", available: true,  desc: "Sélection de livres sur l'écologie" },
  { id: 6, name: "Transport vélo",      pts: 150,  category: "mobility", emoji: "🚲", available: true,  desc: "30 min de vélo libre-service" },
  { id: 7, name: "Yoga & Bien-être",    pts: 400,  category: "sport",    emoji: "🧘", available: true,  desc: "Cours d'essai offert" },
  { id: 8, name: "Plantez un arbre",    pts: 100,  category: "nature",   emoji: "🌳", available: true,  desc: "On plante un arbre en ton nom" },
];

const HISTORY = [
  { date: "12 mai 2025",   reward: "Place de cinéma",  pts: -500, status: "Utilisé" },
  { date: "28 avril 2025", reward: "Café & Brunch bio", pts: -250, status: "Utilisé" },
  { date: "10 avril 2025", reward: "Transport vélo",    pts: -150, status: "Expiré"  },
];

const CATEGORIES = ["Tout", "culture", "food", "shopping", "mobility", "sport", "nature"];

export default function RewardsPage() {
  const [filter, setFilter]       = useState("Tout");
  const [selected, setSelected]   = useState<number | null>(null);
  const [exchanged, setExchanged] = useState<number[]>([]);
  const points = 1240;

  const filtered      = filter === "Tout" ? REWARDS : REWARDS.filter(r => r.category === filter);
  const selectedReward = REWARDS.find(r => r.id === selected);

  const handleExchange = (id: number, pts: number) => {
    if (points >= pts) { setExchanged(prev => [...prev, id]); setSelected(null); }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-bark text-sm">Récompenses</p>
        <h1 className="font-syne font-800 text-2xl text-snow mt-0.5">
          Tes points, <span className="text-solar-dim">ton choix.</span>
        </h1>
      </motion.div>

      {/* Balance + progress */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-bark text-xs uppercase tracking-widest mb-1">Solde actuel</p>
          <p className="font-space font-700 text-5xl text-solar-dim">{points.toLocaleString("fr-FR")}</p>
          <p className="text-bark text-sm mt-0.5">points OffGrid</p>
        </div>

        <div className="hidden sm:block w-px h-16 bg-black/[0.07]" />

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between text-xs">
            <span className="text-bark">Prochain palier</span>
            <span className="text-snow font-600">1 500 pts → Badge Or</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
            <motion.div className="h-full bg-solar-dim rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(points / 1500) * 100}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
          </div>
          <p className="text-[11px] text-bark">260 pts manquants — encore 26g CO₂ à éviter</p>
        </div>

        <div className="hidden sm:block w-px h-16 bg-black/[0.07]" />

        <div className="flex-1 text-center">
          <p className="text-bark text-xs uppercase tracking-widest mb-1">Échangés à ce jour</p>
          <p className="font-space font-700 text-3xl text-snow">900</p>
          <p className="text-bark text-sm mt-0.5">points (3 récompenses)</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-600 transition-all duration-200 capitalize ${
              filter === cat
                ? "text-white"
                : "border text-bark hover:text-snow"
            }`}
            style={filter === cat
              ? { background: "#6DB82A" }
              : { borderColor: "rgba(0,0,0,0.1)" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Rewards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((r, i) => {
          const canAfford   = points >= r.pts;
          const isExchanged = exchanged.includes(r.id);
          return (
            <motion.button
              key={r.id}
              className="card card-hover p-4 text-left flex flex-col gap-3 transition-all duration-200"
              style={isExchanged ? { borderColor: "rgba(109,184,42,0.4)", background: "rgba(109,184,42,0.04)" } : {}}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: canAfford || isExchanged ? 1 : 0.45, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => !isExchanged && setSelected(r.id)}
              whileHover={canAfford && !isExchanged ? { scale: 1.02 } : {}}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{r.emoji}</span>
                {isExchanged && (
                  <span className="text-[10px] text-solar-dim font-700 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(109,184,42,0.12)" }}>Obtenu ✓</span>
                )}
                {!r.available && !isExchanged && (
                  <span className="text-[10px] text-bark border px-2 py-0.5 rounded-full"
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}>Bientôt</span>
                )}
              </div>
              <div>
                <p className="font-syne font-700 text-snow text-sm">{r.name}</p>
                <p className="text-[11px] text-bark mt-0.5 leading-tight">{r.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/[0.06]">
                <span className="font-space font-700 text-solar-dim text-sm">{r.pts} pts</span>
                {canAfford && !isExchanged && r.available && (
                  <span className="text-[10px] text-solar-dim border px-2 py-0.5 rounded-full"
                    style={{ borderColor: "rgba(109,184,42,0.4)" }}>Échanger</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Modal échange */}
      <AnimatePresence>
        {selected && selectedReward && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(242,248,238,0.85)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="card w-full max-w-sm p-6"
              style={{ borderColor: "rgba(109,184,42,0.25)" }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-5xl">{selectedReward.emoji}</span>
                <h2 className="font-syne font-700 text-snow text-lg mt-3">{selectedReward.name}</h2>
                <p className="text-bark text-sm mt-1">{selectedReward.desc}</p>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl mb-3" style={{ background: "rgba(0,0,0,0.04)" }}>
                <span className="text-bark text-sm">Coût</span>
                <span className="font-space font-700 text-solar-dim">{selectedReward.pts} pts</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl mb-5" style={{ background: "rgba(0,0,0,0.04)" }}>
                <span className="text-bark text-sm">Solde après</span>
                <span className="font-space font-700 text-snow">{points - selectedReward.pts} pts</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-3 rounded-xl border text-bark text-sm hover:text-snow transition-colors"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                  Annuler
                </button>
                <motion.button
                  onClick={() => handleExchange(selectedReward.id, selectedReward.pts)}
                  className="flex-1 py-3 rounded-xl font-syne font-700 text-sm text-white"
                  style={{ background: "#6DB82A" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(109,184,42,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirmer →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historique */}
      <div className="card p-6">
        <p className="font-syne font-700 text-snow mb-4">Historique d'échanges</p>
        <div className="flex flex-col divide-y divide-black/[0.06]">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm text-snow">{h.reward}</p>
                <p className="text-[11px] text-bark">{h.date}</p>
              </div>
              <div className="text-right">
                <p className="font-space text-sm text-solar-dim/80">{h.pts} pts</p>
                <p className={`text-[10px] ${h.status === "Utilisé" ? "text-emerald-600" : "text-bark"}`}>{h.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
