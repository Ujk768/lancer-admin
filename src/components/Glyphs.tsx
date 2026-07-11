// Country flags and faculty crests, ported from the mobile prototype to web
// SVG. Used on the leaderboard and validation screens so each student reads
// with the same identity they see in the app.

export function Flag({ code = "ca", width = 20 }) {
  const w = width;
  const h = Math.round(width * 0.7);
  return (
    <svg width={w} height={h} viewBox="0 0 20 14" style={{ display: "block", borderRadius: 2, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}>
      {code === "ca" && (
        <>
          <rect width={20} height={14} fill="#fff" />
          <rect width={5} height={14} fill="#D52B1E" />
          <rect x={15} width={5} height={14} fill="#D52B1E" />
          <path d="M10 3l.7 2.2 2.2-.3-1.4 1.7 1.4 1.7-2.2-.3L10 11l-.7-2.3-2.2.3 1.4-1.7L7.1 4.9l2.2.3L10 3Z" fill="#D52B1E" />
        </>
      )}
      {code === "et" && (
        <>
          <rect width={20} height={4.67} y={0} fill="#078930" />
          <rect width={20} height={4.67} y={4.67} fill="#FCDD09" />
          <rect width={20} height={4.66} y={9.34} fill="#DA121A" />
          <circle cx={10} cy={7} r={3.4} fill="#0F47AF" />
          <path d="M10 4.4l.5 1.6h1.7l-1.35 1 .5 1.6L10 8.6l-1.35 1 .5-1.6-1.35-1h1.7L10 4.4Z" fill="#FCDD09" />
        </>
      )}
      {code === "ng" && (
        <>
          <rect width={6.67} height={14} x={0} fill="#008751" />
          <rect width={6.66} height={14} x={6.67} fill="#fff" />
          <rect width={6.67} height={14} x={13.33} fill="#008751" />
        </>
      )}
      {code === "in" && (
        <>
          <rect width={20} height={4.67} fill="#FF9933" />
          <rect width={20} height={4.67} y={4.67} fill="#fff" />
          <rect width={20} height={4.66} y={9.34} fill="#138808" />
          <circle cx={10} cy={7} r={2} fill="none" stroke="#000080" strokeWidth={0.5} />
        </>
      )}
      {code === "cn" && (
        <>
          <rect width={20} height={14} fill="#DE2910" />
          <path d="M3 2.2l.6 1.8H5.5L4 5.1l.6 1.8L3 5.8 1.4 6.9 2 5.1.5 4h1.9L3 2.2Z" fill="#FFDE00" />
          <path d="M7 2l.3.7.7.1-.5.5.1.7L7 4.3l-.6.3.1-.7-.5-.5.7-.1L7 2Z" fill="#FFDE00" />
          <path d="M8 4.4l.3.6.6.1-.45.45.1.65L8 5.9l-.55.35.1-.65L7.1 5.1l.6-.1L8 4.4Z" fill="#FFDE00" />
        </>
      )}
      {code === "pk" && (
        <>
          <rect width={20} height={14} fill="#01411C" />
          <rect width={5} height={14} fill="#fff" />
          <circle cx={12.5} cy={7} r={3.2} fill="#fff" />
          <circle cx={13.5} cy={7} r={3.2} fill="#01411C" />
          <path d="M15.2 5.4l.4 1.1 1.1.1-.85.7.3 1.1-1-.65-1 .65.3-1.1-.85-.7 1.1-.1.4-1.1Z" fill="#fff" />
        </>
      )}
      {code === "br" && (
        <>
          <rect width={20} height={14} fill="#009639" />
          <path d="M10 2l8 5-8 5-8-5 8-5Z" fill="#FEDF00" />
          <circle cx={10} cy={7} r={3} fill="#002776" />
        </>
      )}
      {code === "fr" && (
        <>
          <rect width={6.67} height={14} fill="#0055A4" />
          <rect width={6.66} height={14} x={6.67} fill="#fff" />
          <rect width={6.67} height={14} x={13.33} fill="#EF4135" />
        </>
      )}
    </svg>
  );
}

export function FacultyCrest({ id, color, size = 21 }: { id: string; color: string; size?: number }) {
  const common: { stroke: string; strokeWidth: number; fill: "none"; strokeLinecap: "round"; strokeLinejoin: "round" } = {
    stroke: color,
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      {id === "cs" && <path d="M9 9 5 12.5 9 16M15 9l4 3.5L15 16M13 7l-2 10" {...common} />}
      {id === "eng" && (
        <>
          <circle cx={12} cy={12} r={3.4} fill="none" stroke={color} strokeWidth={2} />
          <path d="M12 4.5v2.2M12 17.3v2.2M19.5 12h-2.2M6.7 12H4.5M17.3 6.7l-1.6 1.6M8.3 15.7l-1.6 1.6M17.3 17.3l-1.6-1.6M8.3 8.3 6.7 6.7" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {id === "sci" && (
        <>
          <path d="M10 4h4M10.5 4v5L6.5 17a2 2 0 0 0 1.8 3h7.4a2 2 0 0 0 1.8-3L13.5 9V4" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={10.5} cy={15} r={1} fill={color} />
          <circle cx={13.5} cy={17} r={1} fill={color} />
        </>
      )}
      {id === "biz" && (
        <>
          <rect x={4.5} y={8.5} width={15} height={10} rx={1.8} fill="none" stroke={color} strokeWidth={2} />
          <path d="M9 8.5V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M4.5 13h15" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {id === "kin" && (
        <>
          <circle cx={12} cy={5.5} r={2.1} fill={color} />
          <path d="M12 8v5m0 0-3 6m3-6 3 6M8 10.5l4-1 4 1" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {id === "nur" && (
        <>
          <path d="M12 20s-7-4.2-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.8 12 20 12 20Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <path d="M12 10.5v3M10.5 12h3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// Faculty registry: colour + crest id, used to render a student's identity.
export const FACULTIES = {
  cs: { label: "Computer Science", color: "#4A93D8", crest: "cs" },
  eng: { label: "Engineering", color: "#E0803B", crest: "eng" },
  sci: { label: "Science", color: "#5BA85B", crest: "sci" },
  biz: { label: "Business", color: "#C9A227", crest: "biz" },
  kin: { label: "Human Kinetics", color: "#C4453C", crest: "kin" },
  nur: { label: "Nursing", color: "#8E63C9", crest: "nur" },
};

export type FacultyKey = keyof typeof FACULTIES;

