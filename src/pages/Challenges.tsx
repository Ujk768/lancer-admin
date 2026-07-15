import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CHALLENGE_IMAGE_FALLBACK, formatDate } from "../utils";
import ConfirmDialog from "../components/ComfirmDialog";
import Icon from "../components/Icon";
import { getAllChallenges, deleteChallenge } from "../api/challenges/challengeApi";
import type { Challenge } from "../api/challenges/challengeTypes";

// All challenges as image cards. Field names now match the backend's
// serializeChallenge() output exactly, so images, titles, categories and
// participant counts all render.

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [toDelete, setToDelete] = useState<Challenge | null>(null);
  const [filter, setFilter] = useState("all");

  async function load() {
    try {
      setChallenges(await getAllChallenges());
    } catch {
      setChallenges([]);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function confirmDelete() {
    const target = toDelete;
    setToDelete(null);
    if (!target) return;
    try {
      await deleteChallenge(target.id);
      load();
    } catch {
      // no-op: could surface a toast here
    }
  }

  const filtered = (challenges || []).filter(
    (c) => filter === "all" || c.status === filter,
  );

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Fitness challenges</span>
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Challenges</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              border: "1px solid var(--line-strong)",
              borderRadius: 8,
              padding: "8px 12px",
              background: "#fff",
            }}
            aria-label="Filter challenges by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <Link to="/app/challenges/new" className="btn btn-gold">
            <Icon name="plus" size={15} /> New challenge
          </Link>
        </div>
      </div>

      {challenges == null ? (
        <div className="challenge-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card" style={{ height: 260 }}>
              <div
                className="skeleton"
                style={{ height: "100%", borderRadius: 14 }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="challenge-grid">
          {filtered.map((c) => (
            <article className="challenge-card" key={c.id}>
              <button
                className="cc-clickable"
                onClick={() => navigate(`/app/challenge/${c.id}`)}
                aria-label={`Open ${c.title}`}
              >
                <div
                  className="cc-image"
                  style={{
                    backgroundImage: `url(${c.imageUrl || CHALLENGE_IMAGE_FALLBACK})`,
                  }}
                >
                  <span
                    className={`cc-status pill ${c.status === "active" ? "pill-active" : "pill-completed"}`}
                  >
                    {c.status}
                  </span>
                  <div className="cc-image-foot">
                    {c.category && <span className="pill pill-navy">{c.category}</span>}
                    {c.requiresValidation && (
                      <span className="pill pill-gold">Staff validated</span>
                    )}
                  </div>
                </div>
                <div className="cc-body">
                  <h4>{c.title}</h4>
                  <p className="cc-goal">
                    {c.pointsPerUnit} pts / {c.unit}
                  </p>
                  <div className="cc-meta">
                    <span>
                      {formatDate(c.startDate)} to {formatDate(c.endDate)}
                    </span>
                  </div>
                  <div className="cc-foot">
                    <div className="cc-podium mono" title="Podium points">
                      <b>{c.podium.first}</b> / {c.podium.second} / {c.podium.third}
                    </div>
                    <div className="cc-participants">
                      <span className="mono">{c.participants}</span> joined
                    </div>
                  </div>
                </div>
              </button>
              <button
                className="cc-delete"
                onClick={() => setToDelete(c)}
                aria-label={`Remove ${c.title}`}
              >
                <Icon name="trash" size={14} />
              </button>
              <span className="cc-open-hint">View standings</span>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        danger
        title="Remove challenge"
        message={
          toDelete
            ? `"${toDelete.title}" and its standings will no longer be visible to students. This cannot be undone.`
            : ""
        }
        confirmLabel="Remove challenge"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}