"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import type { Spot } from "@/components/SolarMap";

const SolarMap = dynamic(() => import("@/components/SolarMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center bg-white/5 rounded-2xl" style={{ minHeight: 440 }}>
      <div className="flex flex-col items-center gap-3">
        <motion.div className="w-8 h-8 rounded-full border-2 border-solar border-t-transparent"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        <span className="text-bark text-sm">Chargement de la carte…</span>
      </div>
    </div>
  ),
});

/* ── Distance haversine (mètres) ─────────────────────────── */
function distMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
}

/* ── Génère des spots autour de la position réelle ──────── */
function generateSpots(lat: number, lng: number): Spot[] {
  const defs = [
    /* 0–3 km */
    { dlat:  0.012, dlng:  0.018, name: "Esplanade centrale",        sun: "6.2h/j", intensity: 98 },
    { dlat: -0.015, dlng:  0.022, name: "Place du marché",           sun: "5.5h/j", intensity: 86 },
    { dlat:  0.008, dlng: -0.020, name: "Jardins publics",           sun: "4.1h/j", intensity: 65 },
    { dlat: -0.020, dlng: -0.010, name: "Parc de quartier",          sun: "4.9h/j", intensity: 74 },
    /* 3–6 km */
    { dlat:  0.038, dlng:  0.025, name: "Grand parc nord-est",       sun: "5.8h/j", intensity: 91 },
    { dlat: -0.032, dlng:  0.048, name: "Berges du canal",           sun: "5.3h/j", intensity: 82 },
    { dlat:  0.030, dlng: -0.050, name: "Zone dégagée ouest",        sun: "5.7h/j", intensity: 88 },
    { dlat: -0.045, dlng: -0.030, name: "Stade municipal",           sun: "5.1h/j", intensity: 79 },
    { dlat:  0.005, dlng:  0.058, name: "Front de mer est",          sun: "6.0h/j", intensity: 93, rare: true },
    /* 6–10 km */
    { dlat:  0.062, dlng:  0.015, name: "Parc du château",           sun: "6.1h/j", intensity: 90 },
    { dlat: -0.055, dlng:  0.075, name: "Terrain de sport",          sun: "4.8h/j", intensity: 72 },
    { dlat:  0.048, dlng: -0.078, name: "Colline panoramique",       sun: "6.8h/j", intensity: 99, rare: true },
    { dlat: -0.070, dlng: -0.055, name: "Prairie ouverte sud",       sun: "5.6h/j", intensity: 85 },
    { dlat:  0.075, dlng: -0.035, name: "Parc forestier nord",       sun: "3.9h/j", intensity: 60 },
    { dlat: -0.040, dlng:  0.095, name: "Zone commerciale est",      sun: "4.6h/j", intensity: 70 },
    /* 10–15 km */
    { dlat:  0.100, dlng:  0.065, name: "Plateau agricole",          sun: "7.1h/j", intensity: 97, rare: true },
    { dlat: -0.088, dlng:  0.110, name: "Zone industrielle dégagée", sun: "6.5h/j", intensity: 94 },
    { dlat:  0.118, dlng: -0.060, name: "Réserve naturelle",         sun: "5.9h/j", intensity: 89, rare: true },
    { dlat: -0.105, dlng: -0.085, name: "Campus universitaire",      sun: "5.2h/j", intensity: 78 },
    { dlat:  0.125, dlng:  0.012, name: "Champs ouverts nord",       sun: "6.4h/j", intensity: 96 },
    { dlat: -0.112, dlng:  0.045, name: "Parc technologique",        sun: "5.0h/j", intensity: 76 },
    { dlat:  0.058, dlng:  0.122, name: "Esplanade portuaire",       sun: "6.7h/j", intensity: 95, rare: true },
  ];
  return defs.map((d, i) => {
    const sLat = lat + d.dlat;
    const sLng = lng + d.dlng;
    const m = distMeters(lat, lng, sLat, sLng);
    return { id: i + 1, name: d.name, dist: fmtDist(m), sun: d.sun, intensity: d.intensity, lat: sLat, lng: sLng, rare: d.rare };
  });
}

type SunHour = { h: string; v: number; wm2: number };
type SunInfo = { hours: SunHour[]; sunrise: string; sunset: string; peakHour: string };

export default function MapPage() {
  const [userPos, setUserPos]     = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState]   = useState<"loading" | "ok" | "denied" | "unavailable">("loading");
  const [accuracy, setAccuracy]   = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sunInfo, setSunInfo]     = useState<SunInfo | null>(null);
  const [sunLoading, setSunLoading] = useState(false);

  const spots: Spot[] = userPos ? generateSpots(userPos.lat, userPos.lng) : [];
  const selectedSpot  = spots.find(s => s.id === selectedId);
  const nearbySpots   = userPos
    ? [...spots]
        .sort((a, b) =>
          distMeters(userPos.lat, userPos.lng, a.lat, a.lng) -
          distMeters(userPos.lat, userPos.lng, b.lat, b.lng)
        )
        .slice(0, 6)
    : [];

  /* ── Données solaires open-meteo ────────────────────────── */
  useEffect(() => {
    if (!userPos) return;
    setSunLoading(true);
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${userPos.lat.toFixed(4)}&longitude=${userPos.lng.toFixed(4)}` +
      `&hourly=shortwave_radiation&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const times: string[]  = data.hourly.time;
        const rads: number[]   = data.hourly.shortwave_radiation;
        const today = times[0].slice(0, 10);
        const daySlice = times
          .map((t, i) => ({ h: t.slice(11, 13), v: rads[i] ?? 0 }))
          .filter((x) => x.h >= "06" && x.h <= "20");
        const maxRad = Math.max(...daySlice.map((x) => x.v), 1);
        const hours: SunHour[] = daySlice.map((x) => ({
          h:   x.h + "h",
          v:   Math.round((x.v / maxRad) * 100),
          wm2: Math.round(x.v),
        }));
        const peak = daySlice.reduce((a, b) => (b.v > a.v ? b : a));
        const fmtTime = (iso: string) => iso.slice(11, 16);
        setSunInfo({
          hours,
          sunrise:  fmtTime(data.daily.sunrise[0]),
          sunset:   fmtTime(data.daily.sunset[0]),
          peakHour: peak.h + "h",
        });
        void today;
      })
      .catch(() => setSunInfo(null))
      .finally(() => setSunLoading(false));
  }, [userPos?.lat, userPos?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── watchPosition en temps réel ────────────────────────── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(Math.round(pos.coords.accuracy));
        setGeoState("ok");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoState("denied");
        else setGeoState("unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ── États de chargement / erreur ───────────────────────── */
  if (geoState === "loading") {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 min-h-[60vh]">
        <motion.div className="w-16 h-16 rounded-full border-4 border-solar border-t-transparent"
          animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
        <div className="text-center">
          <p className="font-syne font-700 text-snow text-lg">Localisation en cours…</p>
          <p className="text-bark text-sm mt-1">Autorise l'accès à ta position pour voir les spots solaires près de toi.</p>
        </div>
      </div>
    );
  }

  if (geoState === "denied") {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 min-h-[60vh]">
        <div className="text-5xl">📍</div>
        <div className="text-center max-w-sm">
          <p className="font-syne font-700 text-snow text-lg mb-2">Accès refusé</p>
          <p className="text-bark text-sm leading-relaxed">
            La carte solaire a besoin de ta position pour trouver les spots ensoleillés autour de toi.
            Active la localisation dans les paramètres de ton navigateur et recharge la page.
          </p>
          <button onClick={() => window.location.reload()}
            className="mt-5 px-6 py-2.5 rounded-full font-syne font-700 text-sm"
            style={{ background: "#6DB82A", color: "#fff" }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (geoState === "unavailable" || !userPos) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 min-h-[60vh]">
        <div className="text-5xl">🌐</div>
        <div className="text-center max-w-sm">
          <p className="font-syne font-700 text-snow text-lg mb-2">Géolocalisation indisponible</p>
          <p className="text-bark text-sm">La géolocalisation n'est pas supportée ou disponible sur cet appareil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="hero-banner p-6 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-52 h-28 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #FCD34D, transparent)", filter: "blur(36px)" }} />
          <div className="absolute bottom-0 right-1/4 w-40 h-20 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0EA5E9, transparent)", filter: "blur(28px)" }} />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: "rgba(14,165,233,0.7)" }}>Carte solaire</p>
            <h1 className="font-syne font-800 text-3xl text-white">
              Spots ensoleillés <span style={{ color: "#FCD34D" }}>près de toi</span>
            </h1>
            <div className="flex gap-5 mt-4">
              {[
                { label: "Conditions", value: "Ensoleillé ☀️" },
                { label: "UV Index",   value: "7 — Élevé" },
                { label: "Prévisions", value: "jusqu'à 18h" },
              ].map((w) => (
                <div key={w.label}>
                  <p className="font-space font-600 text-sm text-white">{w.value}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{w.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(168,255,62,0.12)", border: "1px solid rgba(168,255,62,0.3)" }}>
            <motion.span className="w-2 h-2 rounded-full"
              style={{ background: "#A8FF3E" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-xs font-600" style={{ color: "#A8FF3E" }}>Position live</span>
            {accuracy && <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>±{accuracy}m</span>}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Carte ──────────────────────────────── */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-forest-3/40" style={{ minHeight: 440 }}>
          <SolarMap
            spots={spots}
            selectedId={selectedId}
            onSelect={setSelectedId}
            userLat={userPos.lat}
            userLng={userPos.lng}
          />
        </div>

        {/* ── Panneau latéral ────────────────────── */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {selectedSpot && (
              <motion.div key={selectedSpot.id} className="card p-5"
                style={{ borderColor: "rgba(168,255,62,0.3)", boxShadow: "0 0 20px rgba(168,255,62,0.07)" }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-solar-dim uppercase tracking-widest mb-1">Spot sélectionné</p>
                    <p className="font-syne font-700 text-snow text-sm leading-tight">{selectedSpot.name}</p>
                    <p className="text-bark text-xs mt-0.5">{selectedSpot.dist} de toi</p>
                  </div>
                  <div className="text-right">
                    <p className="font-space font-700 text-2xl text-solar-dim">{selectedSpot.intensity}%</p>
                    <p className="text-[10px] text-bark">Intensité</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "rgba(0,0,0,0.08)" }}>
                  <motion.div className="h-full rounded-full bg-solar-dim"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSpot.intensity}%` }}
                    transition={{ duration: 0.6 }} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-forest-3/20 rounded-lg p-2.5 text-center">
                    <p className="font-space text-sm text-solar-dim font-700">{selectedSpot.sun}</p>
                    <p className="text-[10px] text-bark">Soleil/jour</p>
                  </div>
                  <div className="bg-forest-3/20 rounded-lg p-2.5 text-center">
                    <p className="font-space text-sm text-snow">~{Math.round(selectedSpot.intensity * 0.4)}%</p>
                    <p className="text-[10px] text-bark">Recharge bonus</p>
                  </div>
                </div>
                <motion.a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-syne font-700 text-xs"
                  style={{ background: "#A8FF3E", color: "#080D0A" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Itinéraire →
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liste */}
          <div className="card p-4 flex flex-col gap-1">
            <p className="text-xs text-bark uppercase tracking-widest mb-2">6 spots les plus proches</p>
            {nearbySpots.map((spot) => (
              <button key={spot.id} onClick={() => setSelectedId(spot.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 w-full ${
                  selectedId === spot.id
                    ? "border"
                    : "hover:bg-black/[0.02] border border-transparent"
                }`}
              style={selectedId === spot.id ? { background: "rgba(109,184,42,0.08)", borderColor: "rgba(109,184,42,0.3)" } : {}}>
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: spot.rare ? "#f59e0b" : `rgba(168,255,62,${spot.intensity / 100})` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-snow truncate">{spot.name}</p>
                    {spot.rare && <span className="text-[9px] text-amber-400 font-700 shrink-0">⭐ RARE</span>}
                  </div>
                  <p className="text-[10px] text-bark">{spot.dist} · {spot.sun}</p>
                </div>
                <span className={`text-xs font-space font-600 ${selectedId === spot.id ? "text-solar-dim" : "text-bark"}`}>
                  {spot.intensity}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courbe journalière */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-syne font-700 text-snow">Ensoleillement aujourd'hui</p>
          <div className="flex items-center gap-1.5">
            {sunLoading && (
              <motion.div className="w-3 h-3 rounded-full border-2 border-solar-dim border-t-transparent"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            )}
            <span className="text-[10px] text-bark/60">
              {sunInfo ? "Données météo réelles · open-meteo.com" : sunLoading ? "Chargement…" : "Données indisponibles"}
            </span>
          </div>
        </div>
        {(() => {
          const hours = sunInfo?.hours ?? [];
          const BAR_MAX = 64;
          return hours.length > 0 ? (
            <>
              <div className="flex items-end gap-1 h-20">
                {hours.map((h, i) => {
                  const isPeak = h.v === 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div className="w-full rounded-t-sm"
                        style={{
                          background: isPeak
                            ? "linear-gradient(to top, #6DB82A, #A8FF3E)"
                            : h.v > 60
                            ? "rgba(109,184,42,0.55)"
                            : "rgba(109,184,42,0.2)",
                          boxShadow: isPeak ? "0 0 10px rgba(109,184,42,0.35)" : "none",
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: (h.v / 100) * BAR_MAX }}
                        transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }} />
                      <span className="text-[8px] text-bark/60">{h.h}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 text-xs text-bark">
                <span>🌅 Lever · {sunInfo?.sunrise ?? "—"}</span>
                <span className="text-solar-dim font-600">Pic · {sunInfo?.peakHour ?? "—"}</span>
                <span>🌇 Coucher · {sunInfo?.sunset ?? "—"}</span>
              </div>
            </>
          ) : !sunLoading ? (
            <p className="text-bark text-sm text-center py-6">Impossible de charger les données solaires.</p>
          ) : (
            <div className="flex items-end gap-1 h-20 opacity-30">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: 20, background: "rgba(109,184,42,0.2)" }} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
