"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Spot {
  id: number;
  name: string;
  dist: string;
  sun: string;
  intensity: number;
  lat: number;
  lng: number;
  rare?: boolean;
}

/* ── Fix icône Leaflet (Next.js) ─────────────────────────── */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Icône utilisateur ───────────────────────────────────── */
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <div style="
        position:absolute;width:24px;height:24px;border-radius:50%;
        background:rgba(66,133,244,0.2);animation:pulse-blue 2s ease-in-out infinite;
      "></div>
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:#4285f4;border:2.5px solid white;
        box-shadow:0 2px 8px rgba(66,133,244,0.6);
        position:relative;z-index:1;
      "></div>
    </div>
    <style>
      @keyframes pulse-blue {
        0%,100%{transform:scale(1);opacity:0.6}
        50%{transform:scale(2.2);opacity:0}
      }
    </style>
  `,
  iconSize:   [24, 24],
  iconAnchor: [12, 12],
});

/* ── Recenter sur spot sélectionné ──────────────────────── */
function RecenterOnSpot({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 14), { animate: true, duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

/* ── Bouton "ma position" ────────────────────────────────── */
function LocateMe({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <div
      className="leaflet-bottom leaflet-right"
      style={{ marginBottom: 24, marginRight: 10 }}
    >
      <div className="leaflet-control">
        <button
          onClick={() => map.flyTo([lat, lng], 15, { animate: true, duration: 0.8 })}
          title="Ma position"
          style={{
            width: 36, height: 36, background: "white", border: "2px solid rgba(0,0,0,0.2)",
            borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0 1px 5px rgba(0,0,0,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

interface SolarMapProps {
  spots: Spot[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  userLat: number;
  userLng: number;
}

export default function SolarMap({ spots, selectedId, onSelect, userLat, userLng }: SolarMapProps) {
  const selected = spots.find(s => s.id === selectedId);

  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={14}
      style={{ width: "100%", height: "100%", minHeight: 440, borderRadius: "inherit" }}
      zoomControl
    >
      {/* ── Tuiles fond blanc style Google Maps ── */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      {/* ── Bouton recentrer ──────────────────── */}
      <LocateMe lat={userLat} lng={userLng} />

      {/* ── Recenter quand spot sélectionné ─── */}
      {selected && <RecenterOnSpot lat={selected.lat} lng={selected.lng} />}

      {/* ── Position utilisateur ──────────────── */}
      <Marker position={[userLat, userLng]} icon={userIcon}>
        <Popup>
          <strong style={{ color: "#4285f4" }}>Ma position</strong>
          <br />
          <span style={{ fontSize: 11, color: "#666" }}>
            {userLat.toFixed(5)}, {userLng.toFixed(5)}
          </span>
        </Popup>
      </Marker>

      {/* ── Spots solaires ────────────────────── */}
      {spots.map((spot) => {
        const isSelected = spot.id === selectedId;
        const rareColor = "#f59e0b";
        return (
          <CircleMarker
            key={spot.id}
            center={[spot.lat, spot.lng]}
            radius={isSelected ? 16 : spot.rare ? 13 : 11}
            pathOptions={{
              color:       isSelected ? (spot.rare ? "#d97706" : "#5c9e1a") : spot.rare ? rareColor : "#6DB82A",
              fillColor:   spot.rare
                ? `rgba(245,158,11,${spot.intensity / 100 * 0.8})`
                : `rgba(168,255,62,${spot.intensity / 100 * 0.75})`,
              fillOpacity: 1,
              weight:      isSelected ? 3 : spot.rare ? 3 : 2,
            }}
            eventHandlers={{ click: () => onSelect(spot.id) }}
          >
            <Popup>
              <div style={{ fontFamily: "system-ui", minWidth: 160 }}>
                {spot.rare && <div style={{ color: "#d97706", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>⭐ SPOT RARE — Bonus ×3 XP</div>}
                <strong style={{ fontSize: 13, color: "#1a2e1a" }}>{spot.name}</strong>
                <br />
                <span style={{ color: spot.rare ? "#d97706" : "#5c9e1a", fontSize: 12 }}>
                  ☀️ {spot.sun} · {spot.intensity}% intensité
                </span>
                <br />
                <span style={{ fontSize: 11, color: "#666" }}>{spot.dist} de toi</span>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
