// Hand-drawn icon set for LancerFit Admin. Every glyph is custom, drawn on a
// 20 x 20 grid with 1.6px strokes to sit with the Chakra Petch geometry. No
// external icon library is used anywhere in the app.

export const paths = {
  // Overview: shield outline with a pulse line through it
  overview: (
    <>
      <path d="M10 2.5 L16.5 4.5 V9.5 C16.5 13.5 13.8 16.2 10 17.5 C6.2 16.2 3.5 13.5 3.5 9.5 V4.5 Z" />
      <path d="M5.5 10 H8 L9.3 7.5 L11 12 L12.2 10 H14.5" />
    </>
  ),
  // Challenges: pennant flag on a pole
  challenge: (
    <>
      <path d="M5.5 2.5 V17.5" />
      <path d="M5.5 3.5 H14.8 L12.2 6.8 L14.8 10 H5.5" />
    </>
  ),
  // Validation: stamp with check
  validate: (
    <>
      <rect x="4" y="12.5" width="12" height="4" rx="1" />
      <path d="M8 12.5 V9.5 C8 8 8.8 7 10 7 C11.2 7 12 8 12 9.5 V12.5" />
      <path d="M7.5 4.5 L9.2 6.2 L12.8 2.8" />
    </>
  ),
  // Leaderboards: podium steps
  podium: (
    <>
      <rect x="7.5" y="6.5" width="5" height="11" />
      <rect x="2.5" y="10.5" width="5" height="7" />
      <rect x="12.5" y="12.5" width="5" height="5" />
      <path d="M10 2 L10.7 3.6 L12.4 3.8 L11.2 5 L11.5 6.6 L10 5.8 L8.5 6.6 L8.8 5 L7.6 3.8 L9.3 3.6 Z" fill="currentColor" stroke="none" />
    </>
  ),
  // Daily quests: calendar with lightning bolt
  quest: (
    <>
      <rect x="3" y="4.5" width="14" height="12.5" rx="1.5" />
      <path d="M3 8 H17" />
      <path d="M6.5 2.5 V5.5 M13.5 2.5 V5.5" />
      <path d="M10.6 9.5 L8.6 12.5 H10.2 L9.4 15.2 L11.6 11.9 H10 Z" fill="currentColor" stroke="none" />
    </>
  ),
  // Activities: dumbbell
  activity: (
    <>
      <path d="M7 10 H13" />
      <rect x="4" y="6.5" width="2.6" height="7" rx="0.8" />
      <rect x="13.4" y="6.5" width="2.6" height="7" rx="0.8" />
      <path d="M2 8.5 V11.5 M18 8.5 V11.5" />
    </>
  ),
  // Settings: hex nut with center dot
  settings: (
    <>
      <path d="M10 2.8 L15.8 6.2 V13.8 L10 17.2 L4.2 13.8 V6.2 Z" />
      <circle cx="10" cy="10" r="2.4" />
    </>
  ),
  signout: (
    <>
      <path d="M8 3.5 H4.5 V16.5 H8" />
      <path d="M12 6.5 L15.5 10 L12 13.5 M15.5 10 H7.5" />
    </>
  ),
  plus: <path d="M10 4.5 V15.5 M4.5 10 H15.5" />,
  trash: (
    <>
      <path d="M4 5.5 H16 M8 5.5 V4 H12 V5.5" />
      <path d="M5.5 5.5 L6.3 16.5 H13.7 L14.5 5.5" />
      <path d="M8.5 8.5 V13.5 M11.5 8.5 V13.5" />
    </>
  ),
  check: <path d="M4 10.5 L8.2 14.5 L16 5.8" />,
  x: <path d="M5 5 L15 15 M15 5 L5 15" />,
  refresh: (
    <>
      <path d="M16 8 A6.3 6.3 0 0 0 4.6 6.8 M4 12 A6.3 6.3 0 0 0 15.4 13.2" />
      <path d="M16 3.5 V8 H11.5 M4 16.5 V12 H8.5" />
    </>
  ),
  bell: (
    <>
      <path d="M10 3 C7 3 5.3 5.2 5.3 8 V11.5 L3.8 14 H16.2 L14.7 11.5 V8 C14.7 5.2 13 3 10 3 Z" />
      <path d="M8.3 16.5 C8.6 17.3 9.2 17.8 10 17.8 C10.8 17.8 11.4 17.3 11.7 16.5" />
    </>
  ),
  arrowUp: <path d="M10 15.5 V4.5 M5.5 9 L10 4.5 L14.5 9" />,
  search: (
    <>
      <circle cx="9" cy="9" r="5.2" />
      <path d="M13 13 L16.8 16.8" />
    </>
  ),
  warning: (
    <>
      <path d="M10 3 L18 16.5 H2 Z" />
      <path d="M10 8 V12 M10 14.2 V14.4" />
    </>
  ),
};

export default function Icon({ name, size = 18, style }: { name: keyof typeof paths; size?: number; style?: React.CSSProperties }) {
  const glyph = paths[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}
