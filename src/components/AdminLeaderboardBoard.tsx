// src/components/AdminLeaderboardBoard.tsx
//
// The shared admin leaderboard: a raised podium (top 3) + a ranked list,
// rendered with the console's EXISTING .lb-* CSS (podium, medal, plinth, rows)
// so it matches the polished challenge-detail design (image 3) instead of the
// broken custom styles that shipped before. Every entry shows the student's
// knight avatar (SVG, faculty-tinted, tier by level), country flag, and faculty
// label — the same identity they have in the app.
//
// Two modes:
//   • grouped = false (campus / per-challenge): each row is a student.
//   • grouped = true  (faculty): each row is a faculty; the glass crest badge
//     stands in for the faculty and the metric is average XP.

import FacultyAvatar from "./FacultyAvatar";
import FacultyBadge from "./FacultyBadge";
import { flagEmoji } from "./flags";
import { themeForFaculty } from "./facultyTheme";

export interface BoardRow {
  key: string | number;
  rank: number;
  name: string;
  xp: number;
  facultyKey?: string | null;
  faculty?: string | null;
  flagCode?: string | null;
  level?: number;
  result?: string | null; // optional per-challenge result (e.g. "52 push-ups")
  sub?: string | null;
}

const MEDAL: Record<number, string> = {
  1: "linear-gradient(135deg, #F0CF6E, #CFA63B)",
  2: "linear-gradient(135deg, #D9DFE9, #B4BECE)",
  3: "linear-gradient(135deg, #E0BB8C, #C08E5C)",
};

function fmt(n: number): string {
  return (n ?? 0).toLocaleString("en-US");
}

function PodiumColumn({ row, place, grouped }: { row?: BoardRow; place: number; grouped: boolean }) {
  if (!row) return <div className="lb-col empty" />;
  const theme = themeForFaculty(row.facultyKey ?? row.faculty);
  return (
    <div className={`lb-col p${place}`}>
      <div className="lb-avatar-wrap" style={{ boxShadow: `0 0 0 3px ${theme.accentLine}` }}>
        {grouped ? (
          <FacultyBadge facultyKey={row.facultyKey ?? row.faculty} size={place === 1 ? 60 : 50} />
        ) : (
          <FacultyAvatar
            facultyKey={row.facultyKey ?? row.faculty}
            level={row.level ?? 1}
            flagCode={row.flagCode}
            size={place === 1 ? 60 : 50}
          />
        )}
        <span className="lb-medal" style={{ background: MEDAL[place] }}>{place}</span>
      </div>
      <div className="lb-col-name" title={row.name}>{row.name}</div>
      <div className="lb-col-result" style={{ color: theme.accent, fontFamily: "inherit" }}>
        {row.sub || theme.name}
      </div>
      <div className="lb-col-xp">{fmt(row.xp)}{grouped ? " avg XP" : " XP"}</div>
      <div className="lb-plinth" style={{ background: MEDAL[place] }}>
        <span>{place === 1 ? "1st" : place === 2 ? "2nd" : "3rd"}</span>
      </div>
    </div>
  );
}

export default function AdminLeaderboardBoard({
  rows,
  grouped = false,
  showResult = false,
}: {
  rows: BoardRow[];
  grouped?: boolean;
  showResult?: boolean;
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="empty">
        <b>No standings yet</b>
        Standings appear as students log results and admins approve them.
      </div>
    );
  }

  const top3 = rows.slice(0, 3);

  return (
    <div>
      {/* Podium: 2nd · 1st · 3rd */}
      <div className="lb-podium">
        <PodiumColumn row={top3[1]} place={2} grouped={grouped} />
        <PodiumColumn row={top3[0]} place={1} grouped={grouped} />
        <PodiumColumn row={top3[2]} place={3} grouped={grouped} />
      </div>

      {/* Column header */}
      <div className="lb-list-head">
        <span>Rank</span>
        <span>{grouped ? "Faculty" : "Student"}</span>
        {showResult && <span>Result</span>}
        <span>{grouped ? "Avg XP" : "XP"}</span>
      </div>

      {/* Ranked list */}
      <div className="lb-list">
        {rows.map((e) => {
          const theme = themeForFaculty(e.facultyKey ?? e.faculty);
          return (
            <div
              className={`lb-row${e.rank <= 3 ? " top" : ""}`}
              key={e.key}
              style={showResult ? { gridTemplateColumns: "56px 1fr 120px 90px" } : undefined}
            >
              <div className="lb-rank" style={e.rank <= 3 ? { background: MEDAL[e.rank], color: "#1a1205" } : undefined}>
                {e.rank}
              </div>
              <div className="lb-id">
                {grouped ? (
                  <FacultyBadge facultyKey={e.facultyKey ?? e.faculty} size={38} />
                ) : (
                  <FacultyAvatar facultyKey={e.facultyKey ?? e.faculty} level={e.level ?? 1} flagCode={e.flagCode} size={38} />
                )}
                <div>
                  <div className="lb-id-name">
                    {e.name}
                    {!grouped && e.flagCode && <span style={{ fontSize: 15 }}>{flagEmoji(e.flagCode)}</span>}
                  </div>
                  <div className="lb-id-fac" style={{ color: theme.accent }}>{e.sub || theme.name}</div>
                </div>
              </div>
              {showResult && <div className="lb-result">{e.result || "—"}</div>}
              <div className="lb-xp strong">{fmt(e.xp)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}