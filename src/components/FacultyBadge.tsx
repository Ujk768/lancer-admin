// src/components/FacultyBadge.tsx
//
// A faculty's REAL crest badge for the admin console — the same PNG art the app
// shows on sign-up and the faculty leaderboard. The badge PNGs (1..9) are copied
// into the admin's public/facultyBadges/<n>.png and Vite serves public/ at the
// web root, so we render the real image with a plain <img>. It sits in a glass
// "carrel" box tinted to the faculty accent, matching the mobile treatment. If
// the PNG ever fails to load, an SVG crest fallback (tinted per faculty) renders
// so a slot is never empty.

import { useState } from "react";
import { themeForFaculty } from "./facultyTheme";

// facultyKey "faculty3" -> badge index 3
function badgeIndex(facultyKey?: string | null): number | null {
  const m = facultyKey && facultyKey.match(/^faculty([1-9])$/);
  return m ? Number(m[1]) : null;
}

export default function FacultyBadge({ facultyKey, size = 40 }: { facultyKey?: string | null; size?: number }) {
  const theme = themeForFaculty(facultyKey);
  const idx = badgeIndex(facultyKey);
  const [failed, setFailed] = useState(false);
  const radius = Math.round(size * 0.28);
  const inner = Math.round(size * 0.72);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: `1.5px solid ${theme.accentLine}`,
        background: `linear-gradient(135deg, ${withAlpha(theme.accent, 0.22)}, ${withAlpha(theme.accent, 0.06)}), linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%), rgba(255,255,255,0.04)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        overflow: "hidden",
      }}
    >
      {idx && !failed ? (
        <img
          src={`/facultyBadges/${idx}.png`}
          alt=""
          onError={() => setFailed(true)}
          style={{ width: inner, height: inner, objectFit: "contain", display: "block" }}
        />
      ) : (
        <CrestFallback size={size} accent={theme.accent} facultyKey={facultyKey || "def"} />
      )}
    </div>
  );
}

function CrestFallback({ size, accent, facultyKey }: { size: number; accent: string; facultyKey: string }) {
  const s = Math.round(size * 0.58);
  return (
    <svg width={s} height={s} viewBox="0 0 100 110" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`crest-${facultyKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0.10" />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L92 20 V52 C92 82 72 100 50 106 C28 100 8 82 8 52 V20 Z"
        fill={`url(#crest-${facultyKey})`}
        stroke={accent}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M50 26 L50 84 M34 40 L50 30 L66 40" stroke={accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const h = (hex || "#4A93D8").replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}