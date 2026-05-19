"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MiniPlanet } from "@/components/Creature";
import { useProfile } from "@/lib/useProfile";

const GLOBAL_LEADERS = [
  { rank: 1, name: "Mathieu R.",  country: "France",     co2: 4820, pts: 4820, avatar: "M", you: true  },
  { rank: 2, name: "Aiko T.",     country: "Japon",      co2: 4105, pts: 4105, avatar: "A", you: false },
  { rank: 3, name: "Lena K.",     country: "Allemagne",  co2: 3891, pts: 3891, avatar: "L", you: false },
  { rank: 4, name: "Oumar D.",    country: "Sénégal",    co2: 3204, pts: 3204, avatar: "O", you: false },
  { rank: 5, name: "Camila S.",   country: "Brésil",     co2: 2980, pts: 2980, avatar: "C", you: false },
  { rank: 6, name: "Yusuf A.",    country: "Maroc",      co2: 2750, pts: 2750, avatar: "Y", you: false },
  { rank: 7, name: "Emma W.",     country: "Canada",     co2: 2510, pts: 2510, avatar: "E", you: false },
];

const FRIENDS = [
  { name: "Sophie T.",  co2: 4105, pts: 4105, avatar: "S", status: "online",  streak: 21 },
  { name: "Alex M.",    co2: 3891, pts: 3891, avatar: "A", status: "online",  streak: 14 },
  { name: "Julie L.",   co2: 3204, pts: 3204, avatar: "J", status: "offline", streak: 7  },
  { name: "Thomas B.",  co2: 2980, pts: 2980, avatar: "T", status: "offline", streak: 3  },
  { name: "Camille D.", co2: 2750, pts: 2750, avatar: "C", status: "online",  streak: 9  },
];

const CHALLENGES = [
  { title: "7 jours consécutifs",  desc: "Expose ta batterie 7j d'affilée",   pts: 200, progress: 5, max: 7,   color: "#FB923C" },
  { title: "100g en une journée",  desc: "Évite 100g de CO₂ en 24h",          pts: 150, progress: 67, max: 100, color: "#A8FF3E" },
  { title: "Invite 3 amis",        desc: "Agrandis la communauté OffGrid",     pts: 300, progress: 1, max: 3,   color: "#A78BFA" },
  { title: "Spot #1 de ta ville",  desc: "Atteins le top classement local",    pts: 500, progress: 0, max: 1,   color: "#FCD34D" },
];

const GLOBAL_STATS = [
  { label: "Membres actifs", value: "12 847" },
  { label: "CO₂ évité",      value: "128t",  sub: "cette semaine" },
  { label: "kWh captés",     value: "94 200", sub: "ce mois" },
];

const MEDAL = ["🥇", "🥈", "🥉"];

export default function CommunityPage() {
  const [tab, setTab] = useState<"global" | "friends">("friends");
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  const { profile } = useProfile();

  const rows = tab === "friends"
    ? FRIENDS.slice(0, 7).map((f, i) => ({ ...f, rank: i + 1, you: false, country: undefined }))
    : GLOBAL_LEADERS;
  const topCo2 = tab === "friends" ? FRIENDS[0].co2 : GLOBAL_LEADERS[0].co2;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-1/4 w-56 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #A78BFA, transparent)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-8 left-1/4 w-40 h-28 rounded-full opacity-12"
            style={{ background: "radial-gradient(circle, #A8FF3E, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-5">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(167,139,250,0.7)" }}>Communauté</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Qui économise <span style={{ color: "#A8FF3E" }}>le plus ?</span>
            </h1>
            <div className="flex gap-6 mt-4">
              {GLOBAL_STATS.map(s => (
                <div key={s.label}>
                  <p className="font-space font-700 text-xl text-white leading-none">{s.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.button onClick={() => setAddFriendOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-700 text-sm"
            style={{ background: "rgba(168,255,62,0.12)", border: "1px solid rgba(168,255,62,0.3)", color: "#A8FF3E" }}
            whileHover={{ scale: 1.03, background: "rgba(168,255,62,0.2)" }} whileTap={{ scale: 0.97 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Ajouter un ami
          </motion.button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Leaderboard ──────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["friends", "global"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-xl text-sm font-600 transition-all duration-200"
                style={tab === t
                  ? { background: "linear-gradient(135deg,#6DB82A,#A8FF3E)", color: "#060D08" }
                  : { border: "1px solid rgba(255,255,255,0.09)", color: "rgba(230,245,224,0.45)", background: "rgba(255,255,255,0.03)" }}>
                {t === "friends" ? "👥 Amis" : "🌍 Mondial"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {rows.map((user, i) => (
                  <motion.div key={user.name}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                    style={{
                      borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: user.you ? "rgba(168,255,62,0.04)" : "transparent",
                    }}
                    onMouseEnter={e => { if (!user.you) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = user.you ? "rgba(168,255,62,0.04)" : "transparent"; }}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>

                    {/* Rank */}
                    <span className="w-7 text-center font-space font-700 text-sm flex-shrink-0"
                      style={{ color: i < 3 ? ["#FCD34D","#CBD5E1","#FB923C"][i] : "rgba(230,245,224,0.3)" }}>
                      {i < 3 ? MEDAL[i] : user.rank}
                    </span>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {user.you && profile.photo ? (
                        <img src={profile.photo} alt="profil"
                          className="w-9 h-9 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 2px #A8FF3E" }} />
                      ) : (
                        <div className="rounded-full overflow-hidden"
                          style={user.you ? { boxShadow: "0 0 0 2px #A8FF3E" } : {}}>
                          <MiniPlanet xp={user.pts} size={36} />
                        </div>
                      )}
                      {"status" in user && user.status && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                          style={{ borderColor: "#0E1C0B", background: user.status === "online" ? "#34D399" : "#4B5563" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 truncate" style={{ color: user.you ? "#A8FF3E" : "#E6F5E0" }}>
                        {user.you ? `${profile.firstName} ${profile.lastName}` : user.name}
                        {user.you && <span className="text-[10px] text-bark ml-1.5 font-400">(toi)</span>}
                      </p>
                      <p className="text-[11px] text-bark">
                        {"country" in user && user.country ? user.country : `🔥 Streak ${"streak" in user ? user.streak : 0}j`}
                      </p>
                    </div>

                    {/* CO2 bar */}
                    <div className="hidden sm:flex flex-col items-end gap-1.5 w-28">
                      <span className="font-space text-xs font-700 text-gradient">
                        {user.co2.toLocaleString("fr-FR")}g
                      </span>
                      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: user.you ? "#A8FF3E" : "linear-gradient(90deg,#6DB82A88,#6DB82A)" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(user.co2 / topCo2) * 100}%` }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              {tab === "global" ? (
                <p className="text-xs text-bark">
                  Rang mondial : <span className="font-600 text-gradient">#2 841</span>
                  {" "}sur 12 847 membres
                </p>
              ) : (
                <p className="text-xs text-bark">
                  Ton rang parmi tes amis : <span className="font-600 text-gradient">#1</span>
                  {" "}sur {FRIENDS.length} ami{FRIENDS.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Défis + Invitations ──────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <p className="font-syne font-700 text-snow mb-4 text-sm">Défis en cours</p>
            <div className="flex flex-col gap-4">
              {CHALLENGES.map((c, i) => (
                <motion.div key={c.title}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs text-snow font-600 leading-tight">{c.title}</p>
                      <p className="text-[10px] text-bark mt-0.5">{c.desc}</p>
                    </div>
                    <span className="text-[10px] font-700 flex-shrink-0" style={{ color: c.color }}>+{c.pts}pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.progress / c.max) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.09, duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-bark whitespace-nowrap">{c.progress}/{c.max}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="font-syne font-700 text-snow text-sm mb-2">Inviter des amis</p>
            <p className="text-[11px] text-bark mb-4">
              Chaque ami invité = <span className="font-600 text-gradient">100 pts bonus</span> dès qu'il rejoint OffGrid.
            </p>
            <motion.button onClick={() => setAddFriendOpen(true)}
              className="w-full py-2.5 rounded-xl text-xs font-700 transition-all"
              style={{ border: "1px solid rgba(168,255,62,0.25)", color: "#A8FF3E", background: "rgba(168,255,62,0.05)" }}
              whileHover={{ scale: 1.02, background: "rgba(168,255,62,0.1)" }}>
              Partager mon lien →
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Modal ajouter un ami ──────────────────────────── */}
      <AnimatePresence>
        {addFriendOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,13,8,0.88)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAddFriendOpen(false)}>
            <motion.div className="card w-full max-w-sm p-6"
              style={{ border: "1px solid rgba(168,255,62,0.18)" }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <h2 className="font-syne font-700 text-snow mb-1">Ajouter un ami</h2>
              <p className="text-bark text-sm mb-5">Entre son email ou son pseudo OffGrid.</p>
              <input type="text" value={friendInput} onChange={e => setFriendInput(e.target.value)}
                placeholder="sophie@email.com ou @sophie_t"
                className="input-dark w-full mb-3" />
              <div className="flex gap-3">
                <button onClick={() => setAddFriendOpen(false)}
                  className="flex-1 py-3 rounded-xl text-bark text-sm hover:text-snow transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Annuler
                </button>
                <motion.button onClick={() => setAddFriendOpen(false)}
                  className="flex-1 py-3 rounded-xl font-syne font-700 text-sm"
                  style={{ background: "linear-gradient(135deg,#6DB82A,#A8FF3E)", color: "#060D08" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
