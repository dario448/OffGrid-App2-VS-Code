"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Creature, { ORBE_STAGES, MiniPlanet, getOrbeStage } from "@/components/Creature";

const USER_XP = 1240;

export default function AvatarPage() {
  const stage    = getOrbeStage(USER_XP);
  const stageIdx = ORBE_STAGES.findIndex((s) => s.id === stage.id);
  const next     = stageIdx < ORBE_STAGES.length - 1 ? ORBE_STAGES[stageIdx + 1] : null;

  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState("");
  const [nickname, setNickname] = useState("");
  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    setNickname(draft.trim());
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/3 w-52 h-36 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #2DD4BF, transparent)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-8 right-1/4 w-40 h-28 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #A8FF3E, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-5">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(45,212,191,0.7)" }}>Mon Orbe</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Ton <span style={{ color: "#2DD4BF" }}>Orbe</span> évolue
            </h1>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="font-space font-700 text-xl text-white leading-none">{USER_XP.toLocaleString("fr-FR")}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>XP total</p>
              </div>
              <div>
                <p className="font-space font-700 text-xl leading-none" style={{ color: "#2DD4BF" }}>{stage.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Stade actuel</p>
              </div>
              {next && (
                <div>
                  <p className="font-space font-700 text-xl text-white leading-none">{(next.xpMin - USER_XP).toLocaleString("fr-FR")}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>XP avant {next.name}</p>
                </div>
              )}
            </div>
          </div>
          {/* Stage badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0"
            style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}>
            <MiniPlanet xp={USER_XP} size={44} />
            <div>
              <p className="text-[11px] text-bark">Stade actuel</p>
              <p className="text-sm font-700 text-snow">{stageIdx + 1}/10 — {stage.name}</p>
              {next && (
                <p className="text-[10px] mt-0.5" style={{ color: stage.color }}>
                  {(stage.xpMax - USER_XP).toLocaleString("fr-FR")} XP → {next.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Creature ──────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Creature xp={USER_XP} health={82} solarActive />
      </motion.div>

      {/* ── Nickname ──────────────────────────────────────── */}
      <motion.div className="card p-5"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-bark uppercase tracking-widest mb-3">Surnom personnalisé</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-bark uppercase tracking-wide">Planète :</span>
              <span className="font-syne font-700 text-snow text-base">{stage.name}</span>
              <span className="text-[9px] text-bark px-1.5 py-0.5 rounded"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>fixe</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-bark uppercase tracking-wide">Surnom :</span>
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div key="edit" className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}>
                    <input value={draft} onChange={e => setDraft(e.target.value.slice(0, 24))}
                      placeholder="Ex : Mon compagnon…" autoFocus maxLength={24}
                      onKeyDown={e => e.key === "Enter" && handleSave()}
                      className="input-dark" style={{ borderColor: "rgba(45,212,191,0.4)", minWidth: 180 }} />
                    <motion.button onClick={handleSave}
                      className="px-3 py-1.5 rounded-xl text-xs font-700"
                      style={{ background: "#0D9488", color: "white" }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      Enregistrer
                    </motion.button>
                    <button onClick={() => setEditing(false)}
                      className="px-2.5 py-1.5 rounded-xl text-xs text-bark hover:text-snow transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>✕</button>
                  </motion.div>
                ) : (
                  <motion.div key="display" className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}>
                    {nickname
                      ? <span className="font-syne font-700 text-snow text-base">{nickname}</span>
                      : <span className="text-bark/40 text-sm italic">aucun surnom</span>}
                    <button onClick={() => { setDraft(nickname); setEditing(true); }}
                      className="flex items-center gap-1.5 text-xs text-bark hover:text-snow transition-colors px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      {nickname ? "Modifier" : "Ajouter"}
                    </button>
                    <AnimatePresence>
                      {saved && (
                        <motion.span className="text-[11px] font-600" style={{ color: "#34D399" }}
                          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                          ✓ Sauvegardé
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-[10px] text-bark/50 leading-relaxed">
              Le nom de la planète (<span className="font-600">{stage.name}</span>) est lié à ton stade et évolue avec toi.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Les 10 évolutions ─────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-syne font-700 text-snow text-lg">Les 10 évolutions</h2>
          <span className="text-xs text-bark">débloquées par XP</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ORBE_STAGES.map((s, i) => {
            const isCurrent  = s.id === stage.id;
            const isUnlocked = USER_XP >= s.xpMin;
            const xpForPlanet = s.xpMin === 0 ? 1 : s.xpMin;
            return (
              <motion.div key={s.id}
                className="card p-3 flex flex-col items-center gap-2 text-center relative overflow-visible cursor-default"
                style={isCurrent
                  ? { borderColor: `${s.color}60`, boxShadow: `0 0 0 1px ${s.color}22, 0 4px 20px ${s.color}15` }
                  : {}}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.04 }}
                whileHover={{ y: -2 }}>
                {isCurrent && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[8px] font-700 px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                      style={{ background: s.color }}>TON ORBE</span>
                  </div>
                )}
                <div style={!isUnlocked ? { filter: "grayscale(70%) brightness(0.6)", opacity: 0.5 } : {}}>
                  <MiniPlanet xp={xpForPlanet} size={48} />
                </div>
                <div>
                  <p className="text-xs font-700 leading-tight"
                    style={{ color: isCurrent ? s.color : isUnlocked ? "#E6F5E0" : "#4B6B4B" }}>
                    {s.name}
                  </p>
                  <p className="text-[9px] text-bark/50 mt-0.5">
                    {s.xpMax === Infinity
                      ? `${s.xpMin.toLocaleString("fr-FR")}+ XP`
                      : `${s.xpMin === 0 ? "0" : s.xpMin.toLocaleString("fr-FR")}–${s.xpMax.toLocaleString("fr-FR")}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px]">
                  <span className="text-bark/30">#{i + 1}</span>
                  {isCurrent   && <span style={{ color: s.color }}>● actuel</span>}
                  {!isCurrent && isUnlocked  && <span style={{ color: "#34D399" }}>✓</span>}
                  {!isUnlocked && <span className="text-bark/25">🔒</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Comment ça marche ─────────────────────────────── */}
      <motion.div className="card p-6"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="font-syne font-700 text-snow mb-5">Comment fonctionne l'Orbe ?</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: "☀️", title: "Recharge dans un spot",       desc: "Chaque minute solaire donne des XP. Les spots rares (⭐) rapportent ×3 XP." },
            { icon: "🪐", title: "Ton Orbe évolue",             desc: "À chaque stade, ta planète change — plus de couleurs, d'anneaux et de lunes." },
            { icon: "🏆", title: "Visible dans le classement",  desc: "Ta planète s'affiche à côté de ton nom. Grimpe pour impressionner !" },
          ].map((step, i) => (
            <motion.div key={step.title} className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}>
              <div className="text-2xl mb-1">{step.icon}</div>
              <p className="text-sm font-700 text-snow">{step.title}</p>
              <p className="text-[11px] text-bark leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] text-bark uppercase tracking-widest mb-3">Récap des stades</p>
          <div className="flex flex-col gap-1">
            {ORBE_STAGES.map((s, i) => {
              const isCurrent  = s.id === stage.id;
              const isUnlocked = USER_XP >= s.xpMin;
              return (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  style={isCurrent ? { background: `${s.color}10` } : {}}>
                  <span className="text-[10px] text-bark/30 w-4 text-right font-space">#{i + 1}</span>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isUnlocked ? s.color : "#2A3F2A" }} />
                  <span className="text-xs font-600 w-20 flex-shrink-0"
                    style={{ color: isCurrent ? s.color : isUnlocked ? "#E6F5E0" : "#3A5A3A" }}>
                    {s.name}
                  </span>
                  <span className="text-[10px] text-bark flex-1">
                    {s.xpMax === Infinity
                      ? `${s.xpMin.toLocaleString("fr-FR")} XP et plus`
                      : `${s.xpMin === 0 ? "0" : s.xpMin.toLocaleString("fr-FR")} → ${s.xpMax.toLocaleString("fr-FR")} XP`}
                  </span>
                  {isCurrent   && <span className="text-[9px] font-700 px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: s.color, color: "#060D08" }}>Toi</span>}
                  {!isCurrent && isUnlocked  && <span className="text-[10px] flex-shrink-0" style={{ color: "#34D399" }}>✓ Passé</span>}
                  {!isUnlocked && <span className="text-[10px] text-bark/30 flex-shrink-0">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
