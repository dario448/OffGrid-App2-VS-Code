"use client";

import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <div className="relative w-7 h-7">
        <div className="absolute inset-0 rounded-full border border-solar/40 group-hover:border-solar/80 transition-colors" />
        <div className="absolute inset-1.5 rounded-full bg-solar group-hover:shadow-[0_0_12px_rgba(168,255,62,0.8)] transition-all" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-0.5 h-1 bg-solar/60 rounded-full origin-bottom"
            style={{
              left: "50%",
              bottom: "50%",
              transform: `translateX(-50%) rotate(${deg}deg) translateY(-12px)`,
            }}
          />
        ))}
      </div>
      <span className="font-syne font-800 text-xl tracking-wider text-snow group-hover:text-solar transition-colors">
        OFF<span className="text-solar">GRID</span>
      </span>
    </Link>
  );
}
