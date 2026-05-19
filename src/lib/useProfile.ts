"use client";
import { useState, useEffect } from "react";

export interface Profile {
  firstName: string;
  lastName:  string;
  photo:     string | null; // base64 data URL
}

const DEFAULT: Profile = { firstName: "Mathieu", lastName: "R.", photo: null };
const LS_KEY   = "offgrid_profile";
const EV_NAME  = "offgrid_profile_change";

function load(): Profile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Profile) : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(LS_KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent(EV_NAME, { detail: p }));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT);

  useEffect(() => {
    setProfile(load());
    const handler = (e: Event) => setProfile((e as CustomEvent<Profile>).detail);
    window.addEventListener(EV_NAME, handler);
    return () => window.removeEventListener(EV_NAME, handler);
  }, []);

  return { profile, saveProfile };
}
