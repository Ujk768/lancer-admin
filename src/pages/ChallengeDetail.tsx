import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeById, getChallengeParticipants ,getChallengeLeaderboard} from "../api/challenges/challengeApi";
// import { formatDate, seasonOf } from "../api/seasons";
// import { CHALLENGE_IMAGE_FALLBACK } from "";
import { CHALLENGE_IMAGE_FALLBACK, formatDate } from "../utils";
// import { useToast } from "../components/Toast";
// import { LeaderboardPodium, LeaderboardList } from "../components/LeaderboardBoard";
// import SeasonBadge, { seasonAccent } from "../components/SeasonBadge";
import Icon from "../components/Icon";
import type { Challenge, LeaderboardEntry } from "../api/challenges/challengeTypes";
import { useAuth } from "../context/AuthContext";

// Detail view for a single challenge. Shows the challenge image, its stored
// facts, and the full standings: a completed challenge shows final results,
// an active one shows live standings. Reached by clicking any challenge card.

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useAuth()
//   const toast = useToast();
  const [challenge, setChallenge] = useState<Challenge>();
  const [board, setBoard] = useState<LeaderboardEntry[]>(); // undefined = loading, null = none
  const [notFound, setNotFound] = useState(false);
  const [participants,setParticipants] = useState(0);

  useEffect(() => {
    console.log("calledd", id);
    (async () => {
      try {
        const c = await getChallengeById(id || "1");
        console.log("cahllenge",c)
        setChallenge(c);
        // const b = await getChallengeLeaderboard(id);
        // setBoard(b);
        const parti = await getChallengeParticipants(id || "1")
        parti ? setParticipants(parti.length) : ""
        const leaderboard = await getChallengeLeaderboard(id || "1")
        setBoard(leaderboard);
      } catch (err) {
        // setNotFound(true);
        // toast.error(err.message || "That challenge could not be loaded.");
      }
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (notFound) {
    return (
      <div className="card"><div className="empty">
        <b>Challenge not found</b>
        It may have been removed. Head back to the challenge list.
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-navy" onClick={() => navigate("/app/challenges")}>Back to challenges</button>
        </div>
      </div></div>
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

//   const season = seasonOf(challenge.startDate);
//   const accent = seasonAccent(season);
  const isCompleted = challenge.status === "completed";

  return (
    <>
      <button className="back-link" onClick={() => navigate("/app/challenges")}>
        <Icon name="arrowUp" size={15} style={{ transform: "rotate(-90deg)" }} /> Challenges
      </button>

      <div className="detail-hero" style={{ backgroundImage: `url(${challenge.challengeImage || CHALLENGE_IMAGE_FALLBACK})` }}>
        <div className="detail-hero-scrim" />
        <div className="detail-hero-content">
          <div className="detail-hero-tags">
            <span className="pill pill-navy">{challenge.category}</span>
            <span className={`pill ${isCompleted ? "pill-completed" : "pill-active"}`}>{challenge.status}</span>
            {/* {challenge.requiresValidation && <span className="pill pill-gold">Staff validated</span>} */}
          </div>
          <h1>{challenge.challengeName}</h1>
          {/* <div className="detail-hero-season">
            <SeasonBadge label={season} size={30} />
            <span style={{ color: "#fff", fontWeight: 600 }}>{season}</span>
          </div> */}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1fr) 320px", alignItems: "start", marginTop: 22 }}>
        <div style={{ display: "grid", gap: 20 }}>
          {challenge.challengeDescription && (
            <div className="card card-pad">
              <span className="eyebrow">About this challenge</span>
              <p style={{ marginTop: 10, fontSize: 15, color: "var(--ink)", lineHeight: 1.6 }}>
                {challenge.challengeDescription}
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
                <div className="skeleton" /><div className="skeleton" style={{ width: "70%" }} />
              </div>
            ) : !board || board.entries.length === 0 ? (
              <div className="empty">
                <b>No standings yet</b>
                {isCompleted
                  ? "This challenge finished without recorded results."
                  : "Standings appear here as students log and validate results."}
              </div>
            ) : (
              <>
                <div style={{ borderBottom: "1px solid var(--line)" }}>
                  {/* <LeaderboardPodium entries={board.entries} /> */}
                </div>
                <div className="lb-list-head">
                  <span>Rank</span><span>Student</span><span>Result</span><span>XP</span>
                </div>
                {/* <LeaderboardList entries={board.entries} showXp={isCompleted} /> */}
              </>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div className="card card-pad detail-facts">
            <span className="eyebrow">Challenge facts</span>
            <Fact label="Goal" value={`${challenge.pointsPerUnit} ${challenge.challengeUnit}`} />
            <Fact label="Window" value={`${formatDate(challenge.startDate)} to ${formatDate(challenge.endDate)}`} />
            <Fact label="Participants" value={String(participants)} mono />
            <Fact label="Created by" value={user?.firstName || ""} />
            {/* <Fact label="Validation" value={challenge.requiresValidation ? "Staff validated" : "Self logged"} /> */}
          </div>

          {/* <div className="card card-pad">
            <span className="eyebrow">Podium reward</span>
            <div className="detail-podium">
              <div className="dp-slot p1"><span className="dp-place">1st</span><b className="mono">{challenge.podium.first}</b><small>XP</small></div>
              <div className="dp-slot p2"><span className="dp-place">2nd</span><b className="mono">{challenge.podium.second}</b><small>XP</small></div>
              <div className="dp-slot p3"><span className="dp-place">3rd</span><b className="mono">{challenge.podium.third}</b><small>XP</small></div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

function Fact({ label, value, mono } :{label: string,value: string,mono?:boolean}) {
  return (
    <div className="fact-row">
      <span>{label}</span>
      <b className={mono ? "mono" : undefined}>{value}</b>
    </div>
  );
}
