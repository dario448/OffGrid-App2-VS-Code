"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MiniPlanet } from "@/components/Creature";

const MY_PTS = 4820;

const ACTIVE_DUELS = [
  { id: 1, friend: { name: "Sophie T.", pts: 4105 }, myScore: 340, friendScore: 210, durationDays: 5, daysLeft: 2, xpReward: 500, startDate: "13 mai 2025" },
  { id: 2, friend: { name: "Alex M.",   pts: 3891 }, myScore: 125, friendScore: 198, durationDays: 3, daysLeft: 1, xpReward: 300, startDate: "15 mai 2025" },
];

const HISTORY = [
  { friend: "Camille D.", friendPts: 2750, result: "win",  myScore: 820, friendScore: 630, xpEarned: 500, date: "5 mai 2025" },
  { friend: "Thomas B.",  friendPts: 2980, result: "loss", myScore: 410, friendScore: 590, xpEarned: 100, date: "28 avril 2025" },
  { friend: "Julie L.",   friendPts: 3204, result: "win",  myScore: 980, friendScore: 740, xpEarned: 500, date: "20 avril 2025" },
];

const FRIENDS_LIST = [
  { name: "Sophie T.",  pts: 4105 },
  { name: "Alex M.",    pts: 3891 },
  { name: "Julie L.",   pts: 3204 },
  { name: "Thomas B.",  pts: 2980 },
  { name: "Camille D.", pts: 2750 },
];

const DURATIONS = [
  { days: 2, label: "2 jours",   xp: 200 },
  { days: 5, label: "5 jours",   xp: 500 },
  { days: 7, label: "1 semaine", xp: 800 },
];

const MAX_DUELS = 2;

export default function DuelsPage() {
  const [newDuelOpen, setNewDuelOpen]           = useState(false);
  const [selectedFriend, setSelectedFriend]     = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [sent, setSent]                         = useState(false);

  const activeCount = ACTIVE_DUELS.length;
  const canStartNew = activeCount < MAX_DUELS;
  const selectedDurationObj = DURATIONS.find(d => d.days === selectedDuration)!;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { setSent(false); setNewDuelOpen(false); setSelectedFriend(null); setSelectedDuration(5); }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-1/4 w-52 h-36 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #DC2626, transparent)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-8 left-1/3 w-40 h-28 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #FF6B6B, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(220,38,38,0.7)" }}>Duels</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Défie tes <span style={{ color: "#FCA5A5" }}>amis.</span>
            </h1>
            <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              2 à 7 jours · Le plus de XP gagne · Max 2 duels simultanés
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-5">
              <div className="text-center">
                <p className="font-space font-700 text-2xl leading-none" style={{ color: "#FCA5A5" }}>{activeCount}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>actifs</p>
              </div>
              <div className="text-center" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 20 }}>
                <p className="font-space font-700 text-2xl text-white leading-none">{HISTORY.filter(h => h.result === "win").length}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>victoires</p>
              </div>
            </div>
            <motion.button
              onClick={() => canStartNew && setNewDuelOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-700 text-sm"
              style={{
                background: canStartNew ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)",
                border: canStartNew ? "1px solid rgba(220,38,38,0.45)" : "1px solid rgba(255,255,255,0.1)",
                color: canStartNew ? "#FCA5A5" : "rgba(255,255,255,0.25)",
                cursor: canStartNew ? "pointer" : "not-allowed",
              }}
              whileHover={canStartNew ? { scale: 1.03, background: "rgba(220,38,38,0.3)" } : {}}
              whileTap={canStartNew ? { scale: 0.97 } : {}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                <line x1="13" y1="19" x2="19" y2="13"/>
                <line x1="16" y1="16" x2="20" y2="20"/>
                <line x1="19" y1="21" x2="21" y2="19"/>
              </svg>
              {canStartNew ? "Nouveau duel" : "Max 2 actifs"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Duels en cours ────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-syne font-700 text-snow text-lg">Duels en cours</h2>
          <span className="text-xs font-700 px-2 py-0.5 rounded-full text-white"
            style={{ background: activeCount > 0 ? "#DC2626" : "#374151" }}>
            {activeCount}/{MAX_DUELS}
          </span>
        </div>

        {activeCount === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl mb-3">⚔️</p>
            <p className="text-bark text-sm">Aucun duel en cours — lance le premier !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ACTIVE_DUELS.map((duel, i) => {
              const total    = duel.myScore + duel.friendScore;
              const myPct    = total === 0 ? 50 : Math.round((duel.myScore / total) * 100);
              const winning  = duel.myScore >= duel.friendScore;
              const timePct  = ((duel.durationDays - duel.daysLeft) / duel.durationDays) * 100;
              return (
                <motion.div key={duel.id} className="card p-5"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.08 }}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-700 px-2.5 py-1 rounded-full"
                      style={{ background: winning ? "rgba(168,255,62,0.12)" : "rgba(220,38,38,0.12)", color: winning ? "#A8FF3E" : "#FCA5A5" }}>
                      {winning ? "🏆 Tu mènes" : "⚠️ Tu es derrière"}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-bark">
                      <span>⏱ {duel.daysLeft}j restant{duel.daysLeft > 1 ? "s" : ""}</span>
                      <span style={{ color: "#FCA5A5" }} className="font-600">+{duel.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0">
                      <div className="rounded-full" style={{ boxShadow: "0 0 0 2px #A8FF3E, 0 0 12px rgba(168,255,62,0.3)" }}>
                        <MiniPlanet xp={MY_PTS} size={44} />
                      </div>
                      <p className="text-[11px] font-700 text-center text-gradient">Toi</p>
                      <p className="font-space font-700 text-base text-snow">{duel.myScore}</p>
                      <p className="text-[9px] text-bark">XP</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] text-bark">
                        <span>{myPct}%</span>
                        <span className="text-[10px] text-bark/40">VS</span>
                        <span>{100 - myPct}%</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden flex"
                        style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div className="h-full rounded-l-full"
                          style={{ background: "linear-gradient(90deg,#6DB82A,#A8FF3E)" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${myPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }} />
                        <motion.div className="h-full rounded-r-full"
                          style={{ background: "#DC2626" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - myPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }} />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-bark/40 mb-1">
                          <span>Début {duel.startDate}</span>
                          <span>{duel.durationDays}j</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <motion.div className="h-full rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}
                            initial={{ width: 0 }} animate={{ width: `${timePct}%` }}
                            transition={{ duration: 0.6, delay: 0.5 }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0">
                      <MiniPlanet xp={duel.friend.pts} size={44} />
                      <p className="text-[11px] font-700 text-snow text-center truncate w-full">{duel.friend.name}</p>
                      <p className="font-space font-700 text-base text-snow">{duel.friendScore}</p>
                      <p className="text-[9px] text-bark">XP</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Historique ────────────────────────────────────── */}
      <motion.div className="card p-6"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="font-syne font-700 text-snow mb-4">Historique des duels</p>
        <div className="flex flex-col gap-1">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex-shrink-0"><MiniPlanet xp={h.friendPts} size={36} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-snow font-600">{h.friend}</p>
                <p className="text-[11px] text-bark">{h.date}</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="font-space text-xs text-snow">{h.myScore} <span className="text-bark/30">vs</span> {h.friendScore}</p>
                <p className="text-[10px] text-bark">XP collectés</p>
              </div>
              <span className="text-[11px] font-700 px-2.5 py-1 rounded-full flex-shrink-0"
                style={h.result === "win"
                  ? { color: "#A8FF3E", background: "rgba(168,255,62,0.1)" }
                  : { color: "#FCA5A5", background: "rgba(220,38,38,0.1)" }}>
                {h.result === "win" ? `+${h.xpEarned} XP ✓` : `+${h.xpEarned} XP`}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Modal nouveau duel ────────────────────────────── */}
      <AnimatePresence>
        {newDuelOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,13,8,0.88)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !sent && setNewDuelOpen(false)}>
            <motion.div className="card w-full max-w-sm p-6"
              style={{ border: "1px solid rgba(220,38,38,0.2)" }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" className="text-center py-6"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <p className="text-4xl mb-3">⚔️</p>
                    <p className="font-syne font-700 text-snow text-lg">Défi envoyé !</p>
                    <p className="text-bark text-sm mt-1">Ton ami recevra une notification.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="font-syne font-700 text-snow text-lg mb-1">Nouveau duel</h2>
                    <p className="text-bark text-sm mb-5">Choisis un ami et une durée.</p>

                    <p className="text-[11px] text-bark uppercase tracking-widest mb-2">Choisir un ami</p>
                    <div className="flex flex-col gap-1.5 mb-5">
                      {FRIENDS_LIST.map(f => {
                        const busy = ACTIVE_DUELS.some(d => d.friend.name === f.name);
                        return (
                          <button key={f.name} disabled={busy}
                            onClick={() => !busy && setSelectedFriend(f.name)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                            style={{
                              border: selectedFriend === f.name ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(255,255,255,0.07)",
                              background: selectedFriend === f.name ? "rgba(220,38,38,0.08)" : busy ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.03)",
                              opacity: busy ? 0.4 : 1,
                              cursor: busy ? "not-allowed" : "pointer",
                            }}>
                            <MiniPlanet xp={f.pts} size={30} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-600 text-snow">{f.name}</p>
                              {busy && <p className="text-[10px] text-bark">Duel en cours</p>}
                            </div>
                            {selectedFriend === f.name && (
                              <span className="text-[11px] font-700" style={{ color: "#DC2626" }}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-bark uppercase tracking-widest mb-2">Durée</p>
                    <div className="flex gap-2 mb-5">
                      {DURATIONS.map(d => (
                        <button key={d.days} onClick={() => setSelectedDuration(d.days)}
                          className="flex-1 py-2.5 rounded-xl text-center transition-all"
                          style={{
                            border: selectedDuration === d.days ? "1px solid rgba(220,38,38,0.45)" : "1px solid rgba(255,255,255,0.07)",
                            background: selectedDuration === d.days ? "rgba(220,38,38,0.08)" : "rgba(255,255,255,0.03)",
                          }}>
                          <p className="text-xs font-700 text-snow">{d.label}</p>
                          <p className="text-[10px] mt-0.5 font-600" style={{ color: "#FCA5A5" }}>+{d.xp} XP</p>
                        </button>
                      ))}
                    </div>

                    {selectedFriend && (
                      <motion.div className="rounded-xl p-3 mb-4 text-center"
                        style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)" }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xs text-bark">
                          Mise : <span className="font-700 text-snow">+{selectedDurationObj.xp} XP</span> gagnant
                          {" · "}<span className="font-600" style={{ color: "#FCA5A5" }}>+100 XP</span> perdant
                        </p>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setNewDuelOpen(false)}
                        className="flex-1 py-3 rounded-xl text-bark text-sm hover:text-snow transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        Annuler
                      </button>
                      <motion.button onClick={handleSend} disabled={!selectedFriend}
                        className="flex-1 py-3 rounded-xl font-syne font-700 text-sm text-white transition-opacity"
                        style={{ background: "#DC2626", opacity: selectedFriend ? 1 : 0.35 }}
                        whileHover={selectedFriend ? { scale: 1.02 } : {}}
                        whileTap={selectedFriend ? { scale: 0.98 } : {}}>
                        Lancer ⚔️
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
