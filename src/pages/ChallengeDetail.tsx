import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getChallengeById,
  getChallengeParticipants,
  getChallengeLeaderboard,
} from "../api/challenges/challengeApi";
import { CHALLENGE_IMAGE_FALLBACK, formatDate } from "../utils";
import Icon from "../components/Icon";
import type {
  Challenge,
  LeaderboardEntry,
} from "../api/challenges/challengeTypes";
import { getSocket } from "../api/socket";

// Detail view for a single challenge. Shows the image, its stored facts, and
// the full live standings. Field names now match the backend; the leaderboard
// is a plain array (LeaderboardEntry[]), not { entries }.

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge>();
  const [board, setBoard] = useState<LeaderboardEntry[]>(); // undefined = loading
  const [notFound, setNotFound] = useState(false);
  const [participants, setParticipants] = useState(0);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const c = await getChallengeById(id);
      setChallenge(c);
      const parti = await getChallengeParticipants(id);
      setParticipants(parti?.length ?? 0);
      const leaderboard = await getChallengeLeaderboard(id);
      setBoard(leaderboard || []);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Live refresh: when a result is approved/rejected or someone joins, re-pull.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const refresh = () => load();
    socket.on("validation:resolved", refresh);
    socket.on("challenge:participants", refresh);
    socket.on("validation:submitted", refresh);
    return () => {
      socket.off("validation:resolved", refresh);
      socket.off("challenge:participants", refresh);
      socket.off("validation:submitted", refresh);
    };
  }, [load]);

  if (notFound) {
    return (
      <div className="card">
        <div className="empty">
          <b>Challenge not found</b>
          It may have been removed. Head back to the challenge list.
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-navy" onClick={() => navigate("/app/challenges")}>
              Back to challenges
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="card card-pad">
        <div className="skeleton" style={{ height: 200, borderRadius: 12, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: "60%" }} />
      </div>
    );
  }

  const isCompleted = challenge.status === "completed";

  return (
    <>
      <button className="back-link" onClick={() => navigate("/app/challenges")}>
        <Icon name="arrowUp" size={15} style={{ transform: "rotate(-90deg)" }} /> Challenges
      </button>

      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${challenge.imageUrl || CHALLENGE_IMAGE_FALLBACK})` }}
      >
        <div className="detail-hero-scrim" />
        <div className="detail-hero-content">
          <div className="detail-hero-tags">
            {challenge.category && <span className="pill pill-navy">{challenge.category}</span>}
            <span className={`pill ${isCompleted ? "pill-completed" : "pill-active"}`}>
              {challenge.status}
            </span>
            {challenge.requiresValidation && (
              <span className="pill pill-gold">Staff validated</span>
            )}
          </div>
          <h1>{challenge.title}</h1>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          alignItems: "start",
          marginTop: 22,
        }}
      >
        <div style={{ display: "grid", gap: 20 }}>
          {challenge.description && (
            <div className="card card-pad">
              <span className="eyebrow">About this challenge</span>
              <p style={{ marginTop: 10, fontSize: 15, color: "var(--ink)", lineHeight: 1.6 }}>
                {challenge.description}
              </p>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <h3>{isCompleted ? "Final standings" : "Live standings"}</h3>
              {!isCompleted && <span className="pill pill-gold">Updating</span>}
            </div>

            {board === undefined ? (
              <div style={{ padding: 24, display: "grid", gap: 12 }}>
                <div className="skeleton" />
                <div className="skeleton" style={{ width: "70%" }} />
              </div>
            ) : board.length === 0 ? (
              <div className="empty">
                <b>No standings yet</b>
                {isCompleted
                  ? "This challenge finished without recorded results."
                  : "Standings appear here as students log and admins validate results."}
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
                          {e.user.faculty && (
                            <div className="lb-id-fac">{e.user.faculty}</div>
                          )}
                        </div>
                      </div>
                      <div className="lb-xp mono">+{e.points}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div className="card card-pad detail-facts">
            <span className="eyebrow">Challenge facts</span>
            <Fact label="Goal" value={`${challenge.goal || challenge.pointsPerUnit} ${challenge.unit}`} />
            <Fact
              label="Window"
              value={`${formatDate(challenge.startDate)} to ${formatDate(challenge.endDate)}`}
            />
            <Fact label="Participants" value={String(participants)} mono />
            <Fact label="Created by" value={challenge.createdBy || "—"} />
            <Fact
              label="Validation"
              value={challenge.requiresValidation ? "Staff validated" : "Self logged"}
            />
          </div>

          <div className="card card-pad">
            <span className="eyebrow">Podium reward</span>
            <div className="detail-podium">
              <div className="dp-slot p1">
                <span className="dp-place">1st</span>
                <b className="mono">{challenge.podium.first}</b>
                <small>XP</small>
              </div>
              <div className="dp-slot p2">
                <span className="dp-place">2nd</span>
                <b className="mono">{challenge.podium.second}</b>
                <small>XP</small>
              </div>
              <div className="dp-slot p3">
                <span className="dp-place">3rd</span>
                <b className="mono">{challenge.podium.third}</b>
                <small>XP</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="fact-row">
      <span>{label}</span>
      <b className={mono ? "mono" : undefined}>{value}</b>
    </div>
  );
}