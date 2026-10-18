import { useEffect, useState, useCallback } from "react";
import {
  getAllChallenges,
  getChallengeLeaderboard,
} from "../api/challenges/challengeApi";
import type { Challenge, LeaderboardEntry } from "../api/challenges/challengeTypes";
import {
  getFacultyLeaderboard,
  getCampusLeaderboard,
  type FacultyStanding,
  type CampusStanding,
} from "../api/leaderboard/leaderboardApi";
import { getSocket } from "../api/socket";
import AdminLeaderboardBoard, { type BoardRow } from "../components/AdminLeaderboardBoard";
import { themeForFaculty } from "../components/facultyTheme";

// Three real-time boards in one place — Faculty, Campus, and per-Challenge —
// all rendered with the console's polished .lb-* podium/list styling and live
// student identities (avatar + flag + faculty). Tabs are styled inline so they
// render correctly regardless of which stylesheet is loaded.

type Tab = "faculty" | "campus" | "challenge";

export default function Leaderboards() {
  const [tab, setTab] = useState<Tab>("faculty");
  const [faculty, setFaculty] = useState<FacultyStanding[]>();
  const [campus, setCampus] = useState<CampusStanding[]>();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>();

  const loadFaculty = useCallback(async () => {
    try { setFaculty(await getFacultyLeaderboard()); } catch { setFaculty([]); }
  }, []);
  const loadCampus = useCallback(async () => {
    try { setCampus(await getCampusLeaderboard()); } catch { setCampus([]); }
  }, []);
  const loadBoard = useCallback(async (challengeId: number) => {
    setBoard(undefined);
    try { setBoard(await getChallengeLeaderboard(challengeId)); } catch { setBoard([]); }
  }, []);

  useEffect(() => { loadFaculty(); loadCampus(); }, [loadFaculty, loadCampus]);
  useEffect(() => {
    getAllChallenges()
      .then((cs) => { setChallenges(cs); if (cs.length && selected == null) setSelected(cs[0].id); })
      .catch(() => setChallenges([]));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (selected != null) loadBoard(selected); }, [selected, loadBoard]);

  // Real-time refresh on the same events the app listens to.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const refreshAll = () => {
      loadFaculty();
      loadCampus();
      if (selected != null) loadBoard(selected);
    };
    socket.on("validation:resolved", refreshAll);
    socket.on("challenge:created", refreshAll);
    return () => {
      socket.off("validation:resolved", refreshAll);
      socket.off("challenge:created", refreshAll);
    };
  }, [selected, loadBoard, loadFaculty, loadCampus]);

  const current = challenges.find((c) => c.id === selected);

  const facultyRows: BoardRow[] = (faculty || []).map((f) => ({
    key: f.facultyKey || f.faculty,
    rank: f.rank,
    name: themeForFaculty(f.facultyKey).name || f.faculty,
    xp: f.avgXp,
    facultyKey: f.facultyKey,
    faculty: f.faculty,
    sub: `${f.members} member${f.members === 1 ? "" : "s"}`,
  }));

  const campusRows: BoardRow[] = (campus || []).map((u) => ({
    key: u.userId,
    rank: u.rank,
    name: u.name,
    xp: u.xp,
    facultyKey: u.facultyKey,
    faculty: u.faculty,
    flagCode: u.nationality || undefined,
    level: u.level ?? Math.floor((u.xp || 0) / 2000) + 1,
    sub: themeForFaculty(u.facultyKey).name || u.faculty,
  }));

  const challengeRows: BoardRow[] = (board || []).map((e) => ({
    key: e.user.id,
    rank: e.rank,
    name: e.user.name,
    xp: e.points,
    facultyKey: (e.user as { facultyKey?: string }).facultyKey,
    faculty: e.user.faculty || undefined,
    flagCode: e.user.nationality || undefined,
    level: (e.user as { level?: number }).level ?? Math.floor(((e.user.totalXp as number) || 0) / 2000) + 1,
    sub: e.user.faculty || undefined,
  }));

  const tabs: [Tab, string][] = [["faculty", "Faculty"], ["campus", "Campus"], ["challenge", "Challenges"]];

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Standings · live</span>
          <div className="title-row">
            <span className="trident-rule"><span /><span /><span /></span>
            <h1 className="page-title">Leaderboards</h1>
          </div>
        </div>
        {tab === "challenge" && (
          <select
            value={selected ?? ""}
            onChange={(e) => setSelected(Number(e.target.value))}
            style={{ border: "1px solid var(--line-strong)", borderRadius: 8, padding: "8px 12px", background: "#fff" }}
            aria-label="Choose a challenge"
          >
            {challenges.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
      </div>

      {/* Segmented tabs (inline-styled so they never depend on external CSS) */}
      <div style={{ display: "inline-flex", gap: 4, padding: 5, marginBottom: 20, borderRadius: 12, background: "var(--social-bg, #eef2f8)", border: "1px solid var(--border, #e3e8f0)" }}>
        {tabs.map(([key, label]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                appearance: "none", border: 0, cursor: "pointer",
                padding: "9px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
                fontFamily: "inherit",
                color: active ? "#1a1205" : "var(--slate, #64748b)",
                background: active ? "linear-gradient(135deg, #F0CF6E, #D9AF3D)" : "transparent",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                transition: "background .18s, color .18s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="card">
        {tab === "faculty" && (
          <>
            <div className="card-head">
              <h3>Faculty standings</h3>
              <span className="pill pill-gold">Avg XP / member</span>
            </div>
            {faculty === undefined ? <Skeleton /> : <AdminLeaderboardBoard rows={facultyRows} grouped />}
          </>
        )}
        {tab === "campus" && (
          <>
            <div className="card-head">
              <h3>Campus standings</h3>
              <span className="pill pill-gold">Total XP</span>
            </div>
            {campus === undefined ? <Skeleton /> : <AdminLeaderboardBoard rows={campusRows} />}
          </>
        )}
        {tab === "challenge" && (
          <>
            <div className="card-head">
              <h3>{current ? current.title : "Select a challenge"}</h3>
              <span className="pill pill-gold">Live</span>
            </div>
            {board === undefined ? <Skeleton /> : <AdminLeaderboardBoard rows={challengeRows} />}
          </>
        )}
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 12 }}>
      <div className="skeleton" />
      <div className="skeleton" style={{ width: "70%" }} />
      <div className="skeleton" style={{ width: "85%" }} />
    </div>
  );
}