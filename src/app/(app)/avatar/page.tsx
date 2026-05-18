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
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-bark text-sm">Avatar</p>
        <h1 className="font-syne font-800 text-2xl text-snow mt-0.5">
          Ton <span style={{ color: "#0D9488" }}>Orbe</span>
        </h1>
      </motion.div>

      {/* Current avatar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Creature xp={USER_XP} health={82} solarActive />
      </motion.div>

      {/* Nickname card */}
      <motion.div
        className="card p-5"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-6">

          {/* Nickname section */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-bark uppercase tracking-widest mb-3">Surnom personnalisé</p>

            {/* Planet name — fixed */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-bark/60 uppercase tracking-wide">Planète :</span>
              <span className="font-syne font-700 text-snow text-base">{stage.name}</span>
              <span className="text-[10px] text-bark/40 border px-1.5 py-0.5 rounded"
                style={{ borderColor: "rgba(0,0,0,0.1)" }}>fixe</span>
            </div>

            {/* Custom nickname */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-bark/60 uppercase tracking-wide">Surnom :</span>
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div key="edit" className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value.slice(0, 24))}
                      placeholder="Ex : Mon compagnon…"
                      autoFocus
                      maxLength={24}
                      onKeyDown={(e) => e.key === "Enter" && handleSave()}
                      className="px-3 py-1.5 rounded-xl border text-snow text-sm focus:outline-none"
                      style={{ background: "rgba(0,0,0,0.03)", borderColor: "rgba(13,148,136,0.4)", minWidth: 180 }}
                    />
                    <motion.button onClick={handleSave}
                      className="px-3 py-1.5 rounded-xl text-xs font-700 text-white"
                      style={{ background: "#0D9488" }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      Enregistrer
                    </motion.button>
                    <button onClick={() => setEditing(false)}
                      className="px-2.5 py-1.5 rounded-xl text-xs text-bark border hover:text-snow transition-colors"
                      style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      ✕
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="display" className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}>
                    {nickname ? (
                      <span className="font-syne font-700 text-snow text-base">{nickname}</span>
                    ) : (
                      <span className="text-bark/40 text-sm italic">aucun surnom</span>
                    )}
                    <button
                      onClick={() => { setDraft(nickname); setEditing(true); }}
                      className="flex items-center gap-1.5 text-xs text-bark hover:text-snow transition-colors px-2 py-1 rounded-lg hover:bg-black/[0.04]"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      {nickname ? "Modifier" : "Ajouter"}
                    </button>
                    <AnimatePresence>
                      {saved && (
                        <motion.span className="text-[11px] text-emerald-600 font-600"
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
              Le nom de la planète (<span className="font-600">{stage.name}</span>) est lié à ton stade et évolue avec toi. Le surnom est facultatif et 100 % personnel.
            </p>
          </div>

          {/* Stage badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0"
            style={{ background: `${stage.color}10`, border: `1px solid ${stage.color}28` }}>
            <MiniPlanet xp={USER_XP} size={40} />
            <div>
              <p className="text-xs text-bark">Stade actuel</p>
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

      {/* Evolution guide */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-syne font-700 text-snow text-lg">Les 10 évolutions</h2>
          <span className="text-xs text-bark">débloquées selon les XP accumulés</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ORBE_STAGES.map((s, i) => {
            const isCurrent   = s.id === stage.id;
            const isUnlocked  = USER_XP >= s.xpMin;
            const xpForPlanet = s.xpMin === 0 ? 1 : s.xpMin;

            return (
              <motion.div
                key={s.id}
                className="card p-3 flex flex-col items-center gap-2 text-center relative overflow-visible"
                style={isCurrent
                  ? { borderColor: s.color, boxShadow: `0 0 0 2px ${s.color}22, 0 4px 16px ${s.color}12` }
                  : {}
                }
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.04 }}
                whileHover={{ y: -2 }}
              >
                {isCurrent && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[9px] font-700 px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                      style={{ background: s.color }}>
                      TON ORBE
                    </span>
                  </div>
                )}

                {/* Planet — locked ones keep slight color */}
                <div style={!isUnlocked ? { filter: "grayscale(60%) brightness(0.88)", opacity: 0.62 } : {}}>
                  <MiniPlanet xp={xpForPlanet} size={48} />
                </div>

                <div>
                  <p className="text-xs font-700 leading-tight"
                    style={{ color: isCurrent ? s.color : isUnlocked ? "#0D1F14" : "#9aaa9a" }}>
                    {s.name}
                  </p>
                  <p className="text-[9px] text-bark/60 mt-0.5">
                    {s.xpMax === Infinity
                      ? `${s.xpMin.toLocaleString("fr-FR")}+ XP`
                      : `${s.xpMin === 0 ? "0" : s.xpMin.toLocaleString("fr-FR")}–${s.xpMax.toLocaleString("fr-FR")}`}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px]">
                  <span className="text-bark/40">#{i + 1}</span>
                  {isCurrent  && <span style={{ color: s.color }}>● actuel</span>}
                  {!isCurrent && isUnlocked  && <span className="text-emerald-600">✓</span>}
                  {!isUnlocked && <span className="text-bark/30">🔒</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <p className="font-syne font-700 text-snow mb-5">Comment fonctionne l'Orbe ?</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: "☀️", title: "Recharge dans un spot", desc: "Chaque minute de recharge solaire te donne des XP. Les spots rares (⭐) rapportent ×3 XP." },
            { icon: "🪐", title: "Ton Orbe évolue",        desc: "À chaque nouveau stade, ta planète change d'apparence — plus de couleurs, d'anneaux, de lunes et d'effets." },
            { icon: "🏆", title: "Visible dans le classement", desc: "Ta planète actuelle s'affiche à côté de ton nom dans le classement communautaire. Grimpe pour impressionner !" },
          ].map((step, i) => (
            <motion.div key={step.title} className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }}>
              <div className="text-2xl mb-1">{step.icon}</div>
              <p className="text-sm font-700 text-snow">{step.title}</p>
              <p className="text-[11px] text-bark leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* XP table */}
        <div className="mt-6 pt-5 border-t border-black/[0.06]">
          <p className="text-xs text-bark uppercase tracking-widest mb-3">Récapitulatif des stades</p>
          <div className="flex flex-col gap-1">
            {ORBE_STAGES.map((s, i) => {
              const isCurrent  = s.id === stage.id;
              const isUnlocked = USER_XP >= s.xpMin;
              return (
                <div key={s.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={isCurrent ? { background: `${s.color}0d` } : {}}>
                  <span className="text-[10px] text-bark/40 w-4 text-right font-space">#{i + 1}</span>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isUnlocked ? s.color : "#d1d5db" }} />
                  <span className="text-xs font-600 w-20 flex-shrink-0"
                    style={{ color: isCurrent ? s.color : isUnlocked ? "#0D1F14" : "#9ca3af" }}>
                    {s.name}
                  </span>
                  <span className="text-[10px] text-bark flex-1">
                    {s.xpMax === Infinity
                      ? `${s.xpMin.toLocaleString("fr-FR")} XP et plus`
                      : `${s.xpMin === 0 ? "0" : s.xpMin.toLocaleString("fr-FR")} → ${s.xpMax.toLocaleString("fr-FR")} XP`}
                  </span>
                  {isCurrent   && <span className="text-[9px] font-700 px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: s.color }}>Toi</span>}
                  {!isCurrent && isUnlocked  && <span className="text-[10px] text-emerald-600 flex-shrink-0">✓ Passé</span>}
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
