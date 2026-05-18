"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<"login" | "register">("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(168,255,62,0.07) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "linear-gradient(rgba(168,255,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,255,62,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Rings */}
      {[300, 500, 700].map((s, i) => (
        <motion.div key={s} className="absolute rounded-full border border-solar/8"
          style={{ width: s, height: s }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1 }} />
      ))}

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card */}
        <div className="card p-8">
          <div className="flex justify-center mb-8"><Logo href="/dashboard" /></div>

          <h1 className="font-syne font-700 text-xl text-center mb-1">
            {mode === "login" ? "Bon retour 👋" : "Rejoindre OffGrid"}
          </h1>
          <p className="text-bark text-sm text-center mb-8">
            {mode === "login" ? "Connecte-toi pour voir ton impact." : "Crée ton compte en 30 secondes."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-bark uppercase tracking-widest mb-1.5 block">Prénom</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Mathieu"
                  className="w-full px-4 py-3 rounded-xl bg-forest-3/20 border border-forest-3/60 focus:border-solar/50 focus:outline-none text-snow placeholder-bark/50 text-sm transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-bark uppercase tracking-widest mb-1.5 block">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="toi@email.com"
                className="w-full px-4 py-3 rounded-xl bg-forest-3/20 border border-forest-3/60 focus:border-solar/50 focus:outline-none text-snow placeholder-bark/50 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-bark uppercase tracking-widest mb-1.5 block">Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-forest-3/20 border border-forest-3/60 focus:border-solar/50 focus:outline-none text-snow placeholder-bark/50 text-sm transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3.5 rounded-xl font-syne font-700 text-sm mt-2"
              style={{ background: "#A8FF3E", color: "#080D0A" }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168,255,62,0.35)" }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === "login" ? "Se connecter →" : "Créer mon compte →"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm text-bark hover:text-solar transition-colors"
            >
              {mode === "login" ? "Pas encore de compte ? Créer le mien" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>

        <p className="text-center text-bark/40 text-xs mt-6">
          OffGrid App · Énergie solaire autonome
        </p>
      </motion.div>
    </div>
  );
}
