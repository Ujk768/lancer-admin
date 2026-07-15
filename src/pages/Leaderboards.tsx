import { useEffect, useState, useCallback } from "react";
import {
  getAllChallenges,
  getChallengeLeaderboard,
} from "../api/challenges/challengeApi";
import type {
  Challenge,
  LeaderboardEntry,
} from "../api/challenges/challengeTypes";
import { getSocket } from "../api/socket";

// Campus challenge leaderboards. Pick a challenge; its standings load live and
// refresh whenever a result is approved anywhere.

export default function Leaderboards() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>();

  useEffect(() => {
    getAllChallenges()
      .then((cs) => {
        setChallenges(cs);
        if (cs.length && selected == null) setSelected(cs[0].id);
      })
      .catch(() => setChallenges([]));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBoard = useCallback(async (challengeId: number) => {
    setBoard(undefined);
    try {
      setBoard(await getChallengeLeaderboard(challengeId));
    } catch {
      setBoard([]);
    }
  }, []);

  useEffect(() => {
    if (selected != null) loadBoard(selected);
  }, [selected, loadBoard]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const refresh = () => {
      if (selected != null) loadBoard(selected);
    };
    socket.on("validation:resolved", refresh);
    return () => socket.off("validation:resolved", refresh);
  }, [selected, loadBoard]);

  const current = challenges.find((c) => c.id === selected);

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Standings</span>
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Leaderboards</h1>
          </div>
        </div>
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(Number(e.target.value))}
          style={{
            border: "1px solid var(--line-strong)",
            borderRadius: 8,
            padding: "8px 12px",
            background: "#fff",
          }}
          aria-label="Choose a challenge"
        >
          {challenges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>{current ? current.title : "Select a challenge"}</h3>
          <span className="pill pill-gold">Live</span>
        </div>

        {board === undefined ? (
          <div style={{ padding: 24, display: "grid", gap: 12 }}>
            <div className="skeleton" />
            <div className="skeleton" style={{ width: "70%" }} />
          </div>
        ) : board.length === 0 ? (
          <div className="empty">
            <b>No standings yet</b>
            Standings appear as students log results and admins approve them in Validations.
          </div>
        ) : (
          <>
            <div className="lb-list-head">
              <span>Rank</span>
              <span>Student</span>
              <span>XP</span>
            </div>
            <div className="lb-list">
              {board.map((e) => (
                <div className={`lb-row${e.rank <= 3 ? " top" : ""}`} key={e.user.id}>
                  <div className="lb-rank">{e.rank}</div>
                  <div className="lb-id">
                    <div>
                      <div className="lb-id-name">{e.user.name}</div>
                      {e.user.faculty && <div className="lb-id-fac">{e.user.faculty}</div>}
                    </div>
                  </div>
                  <div className="lb-xp mono">+{e.points}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}