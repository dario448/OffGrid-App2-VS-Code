"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MiniPlanet } from "@/components/Creature";
import { useProfile } from "@/lib/useProfile";

const GLOBAL_LEADERS = [
  { rank: 1,  name: "Mathieu R.",   country: "France",       co2: 4820, pts: 4820, avatar: "M", you: true },
  { rank: 2,  name: "Aiko T.",      country: "Japon",        co2: 4105, pts: 4105, avatar: "A", you: false },
  { rank: 3,  name: "Lena K.",      country: "Allemagne",    co2: 3891, pts: 3891, avatar: "L", you: false },
  { rank: 4,  name: "Oumar D.",     country: "Sénégal",      co2: 3204, pts: 3204, avatar: "O", you: false },
  { rank: 5,  name: "Camila S.",    country: "Brésil",       co2: 2980, pts: 2980, avatar: "C", you: false },
  { rank: 6,  name: "Yusuf A.",     country: "Maroc",        co2: 2750, pts: 2750, avatar: "Y", you: false },
  { rank: 7,  name: "Emma W.",      country: "Canada",       co2: 2510, pts: 2510, avatar: "E", you: false },
];

const FRIENDS = [
  { name: "Sophie T.",  co2: 4105, pts: 4105, avatar: "S", status: "online",  streak: 21 },
  { name: "Alex M.",    co2: 3891, pts: 3891, avatar: "A", status: "online",  streak: 14 },
  { name: "Julie L.",   co2: 3204, pts: 3204, avatar: "J", status: "offline", streak: 7  },
  { name: "Thomas B.",  co2: 2980, pts: 2980, avatar: "T", status: "offline", streak: 3  },
  { name: "Camille D.", co2: 2750, pts: 2750, avatar: "C", status: "online",  streak: 9  },
];

const CHALLENGES = [
  { title: "7 jours consécutifs",     desc: "Expose ta batterie 7 jours d'affilée",  pts: 200, progress: 5, max: 7,  emoji: "🔥" },
  { title: "100g en une journée",     desc: "Évite 100g de CO₂ en 24h",              pts: 150, progress: 67, max: 100, emoji: "⚡" },
  { title: "Invite 3 amis",           desc: "Agrandis la communauté OffGrid",         pts: 300, progress: 1, max: 3,  emoji: "👥" },
  { title: "Spot #1 de ta ville",     desc: "Atteins le top classement local",        pts: 500, progress: 0, max: 1,  emoji: "🏆" },
];

const GLOBAL_STATS = [
  { label: "Membres actifs",  value: "12 847", unit: "" },
  { label: "CO₂ évité",       value: "128t",   unit: "cette semaine" },
  { label: "kWh captés",      value: "94 200", unit: "ce mois" },
];

export default function CommunityPage() {
  const [tab, setTab]             = useState<"global" | "friends">("friends");
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendInput, setFriendInput]     = useState("");
  const { profile } = useProfile();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-56 h-28 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #7C3AED, transparent)", filter: "blur(36px)" }} />
          <div className="absolute bottom-0 left-1/4 w-40 h-20 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #A8FF3E, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(139,92,246,0.7)" }}>Communauté</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Qui économise <span style={{ color: "#A8FF3E" }}>le plus ?</span>
            </h1>
            <div className="flex gap-6 mt-4">
              {GLOBAL_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-space font-700 text-xl text-white">{s.value}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.button
            onClick={() => setAddFriendOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-syne font-700 text-sm"
            style={{ background: "rgba(168,255,62,0.15)", border: "1px solid rgba(168,255,62,0.35)", color: "#A8FF3E" }}
            whileHover={{ scale: 1.03, background: "rgba(168,255,62,0.22)" }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Ajouter un ami
          </motion.button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Leaderboard ───────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["friends", "global"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-600 transition-all duration-200 ${
                  tab === t ? "bg-solar-dim text-white" : "border border-forest-3/60 text-bark hover:text-snow"
                }`}>
                {t === "friends" ? "👥 Amis" : "🌍 Mondial"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="divide-y divide-black/[0.05]">
              {(tab === "friends" ? FRIENDS.slice(0, 7).map((f, i) => ({ ...f, rank: i + 1, you: false })) : GLOBAL_LEADERS).map((user, i) => (
                <motion.div
                  key={user.name}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02] ${user.you ? "bg-solar/5" : ""}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {/* Rang */}
                  <span className={`w-7 text-center font-space font-700 text-sm flex-shrink-0 ${
                    i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-bark/50"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : user.rank}
                  </span>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {user.you && profile.photo ? (
                      <img src={profile.photo} alt="profil"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-solar-dim ring-offset-1" />
                    ) : (
                      <div className={`rounded-full overflow-hidden flex items-center justify-center ${
                        user.you ? "ring-2 ring-solar-dim ring-offset-1" : ""
                      }`}>
                        <MiniPlanet xp={user.pts} size={38} />
                      </div>
                    )}
                    {"status" in user && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        user.status === "online" ? "bg-emerald-500" : "bg-gray-300"
                      }`} />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-sm font-600 truncate ${user.you ? "text-solar-dim" : "text-snow"}`}>
                        {user.you ? `${profile.firstName} ${profile.lastName}` : user.name}
                        {user.you && <span className="text-xs text-bark ml-1">(toi)</span>}
                      </p>
                    </div>
                    <p className="text-[11px] text-bark">
                      {"country" in user ? user.country : `Streak : ${"streak" in user ? user.streak : 0}j 🔥`}
                    </p>
                  </div>

                  {/* Barre CO2 + valeur */}
                  <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                    <span className="font-space text-xs font-600 text-solar-dim">
                      {user.co2.toLocaleString("fr-FR")}g
                    </span>
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <motion.div className="h-full bg-solar-dim rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.co2 / (tab === "friends" ? FRIENDS[0].co2 : GLOBAL_LEADERS[0].co2)) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer rang */}
            <div className="px-5 py-3 border-t border-black/[0.05] bg-black/[0.02] text-center">
              {tab === "global" ? (
                <p className="text-xs text-bark">
                  Rang mondial : <span className="text-solar-dim font-600">#2 841</span>
                  {" "}sur 12 847 membres
                </p>
              ) : (
                <p className="text-xs text-bark">
                  Ton rang parmi tes amis : <span className="text-solar-dim font-600">#1</span>
                  {" "}sur {FRIENDS.length} ami{FRIENDS.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Défis + sidebar ────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <p className="font-syne font-700 text-snow mb-4">Défis en cours</p>
            <div className="flex flex-col gap-4">
              {CHALLENGES.map((c, i) => (
                <motion.div key={c.title}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-snow font-600 leading-tight">{c.title}</p>
                      <p className="text-[10px] text-bark">{c.desc}</p>
                    </div>
                    <span className="text-[10px] text-solar-dim whitespace-nowrap font-600">+{c.pts}pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <motion.div className="h-full bg-solar-dim rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.progress / c.max) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-bark whitespace-nowrap">{c.progress}/{c.max}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Invitations */}
          <div className="card p-5">
            <p className="font-syne font-700 text-snow text-sm mb-3">Inviter des amis</p>
            <p className="text-[11px] text-bark mb-4">
              Chaque ami invité te rapporte <span className="text-solar-dim font-600">100 pts bonus</span> quand il rejoint OffGrid.
            </p>
            <motion.button
              onClick={() => setAddFriendOpen(true)}
              className="w-full py-2.5 rounded-xl border text-xs font-700 transition-colors"
              style={{ borderColor: "rgba(109,184,42,0.4)", color: "#5A9E1A" }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(109,184,42,0.06)" }}
            >
              Partager mon lien →
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal ajouter un ami */}
      <AnimatePresence>
        {addFriendOpen && (
          <motion.div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(242,248,238,0.85)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAddFriendOpen(false)}>
            <motion.div className="card w-full max-w-sm p-6"
              style={{ borderColor: "rgba(109,184,42,0.25)" }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <h2 className="font-syne font-700 text-snow mb-1">Ajouter un ami</h2>
              <p className="text-bark text-sm mb-5">Entre son email ou son pseudo OffGrid.</p>
              <input
                type="text"
                value={friendInput}
                onChange={e => setFriendInput(e.target.value)}
                placeholder="sophie@email.com ou @sophie_t"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none text-snow placeholder-bark/50 text-sm transition-colors mb-3"
                style={{ background: "rgba(0,0,0,0.03)", borderColor: "rgba(0,0,0,0.1)" }}
              />
              <div className="flex gap-3">
                <button onClick={() => setAddFriendOpen(false)}
                  className="flex-1 py-3 rounded-xl border text-bark text-sm hover:text-snow transition-colors"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                  Annuler
                </button>
                <motion.button
                  onClick={() => setAddFriendOpen(false)}
                  className="flex-1 py-3 rounded-xl font-syne font-700 text-sm text-white"
                  style={{ background: "#6DB82A" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  Envoyer →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
