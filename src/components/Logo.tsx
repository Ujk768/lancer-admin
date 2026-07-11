import { useState } from "react";

// University of Windsor Lancers shield. Prefers /logo.png if the real asset
// has been dropped into /public, otherwise renders a faithful SVG recreation
// of the shield: navy field, gold inner border, white trident W.

function ShieldSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.26)}
      viewBox="0 0 100 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="University of Windsor Lancers shield"
    >
      <path
        d="M50 0 C34 6 16 8 2 6 L2 62 C2 92 22 112 50 126 C78 112 98 92 98 62 L98 6 C84 8 66 6 50 0 Z"
        fill="#101E3F"
      />
      <path
        d="M50 8 C37 12.5 23 14.5 10 13.4 L10 62 C10 87 27 104.5 50 117 C73 104.5 90 87 90 62 L90 13.4 C77 14.5 63 12.5 50 8 Z"
        fill="none"
        stroke="#E9C45A"
        strokeWidth="6"
      />
      <path d="M24 26 C28 25.5 32.5 24.8 36.5 23.8 L44 78 L37 92 C28 74 24.5 48 24 26 Z" fill="#fff" />
      <path d="M50 20 L57.5 88 L50 103 L42.5 88 Z" fill="#fff" />
      <path d="M76 26 C72 25.5 67.5 24.8 63.5 23.8 L56 78 L63 92 C72 74 75.5 48 76 26 Z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ size = 44 }) {
  const [pngFailed, setPngFailed] = useState(false);
  if (pngFailed) return <ShieldSvg size={size} />;
  return (
    <img
      src="/logo.png"
      alt="University of Windsor Lancers shield"
      width={size}
      style={{ height: "auto", display: "block" }}
      onError={() => setPngFailed(true)}
    />
  );
}
