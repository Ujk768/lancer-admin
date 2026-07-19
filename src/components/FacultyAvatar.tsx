// src/components/FacultyAvatar.tsx
//
// A student's REAL avatar for the admin console — the same PNG art the mobile
// app shows. The avatar PNGs (9 faculties × 5 level tiers) are copied into the
// admin's public/avatars/<facultyKey>/<tier>.png, and Vite serves public/ at
// the web root, so we render them with a plain <img>. The tier is derived from
// the student's level so a Hero shows the Hero art, not a Squire.
//
// The country flag is drawn as an emoji (the same source the app uses — no flag
// image files needed) tucked into the corner. If a PNG ever fails to load we
// fall back to the glass crest so a row is never empty.

import { useState } from "react";
import { themeForFaculty, avatarTierFromLevel } from "./facultyTheme";
import { flagEmoji } from "./flags";
import FacultyBadge from "./FacultyBadge";

export default function FacultyAvatar({
  facultyKey,
  level = 1,
  flagCode,
  size = 40,
  showFlag = true,
  ring = true,
}: {
  facultyKey?: string | null;
  level?: number;
  flagCode?: string | null;
  size?: number;
  showFlag?: boolean;
  ring?: boolean;
}) {
  const theme = themeForFaculty(facultyKey);
  const key = facultyKey && /^faculty[1-9]$/.test(facultyKey) ? facultyKey : "faculty9";
  const tier = avatarTierFromLevel(level);
  const [failed, setFailed] = useState(false);
  const radius = Math.round(size * 0.28);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {failed ? (
        <FacultyBadge facultyKey={key} size={size} />
      ) : (
        <img
          src={`/avatars/${key}/${tier}.png`}
          alt=""
          onError={() => setFailed(true)}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            objectFit: "cover",
            background: "#F0CF6E",
            boxShadow: ring ? `0 0 0 2px ${theme.accentLine}` : "none",
            display: "block",
          }}
        />
      )}
      {showFlag && flagCode && (
        <span
          style={{
            position: "absolute",
            bottom: -3,
            right: -4,
            fontSize: Math.round(size * 0.42),
            lineHeight: 1,
            filter: "drop-shadow(0 0 1px rgba(0,0,0,0.4))",
          }}
        >
          {flagEmoji(flagCode)}
        </span>
      )}
    </div>
  );
}