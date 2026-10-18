import { useEffect, useState, useCallback } from "react";
import {
  getPendingApprovals,
  approveParticipant,
  rejectParticipant,
} from "../api/challenges/challengeApi";
import type { PendingApproval } from "../api/challenges/challengeTypes";
import Icon from "../components/Icon";
import ConfirmDialog from "../components/ComfirmDialog";
import { getSocket } from "../api/socket";
import { formatDate } from "../utils";

// The approval queue. When a student logs a result on the mobile app, it lands
// here. The admin approves (points are awarded and the student joins the
// leaderboard) or rejects. Everything updates live over the socket.

export default function Validations() {
  const [pending, setPending] = useState<PendingApproval[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toReject, setToReject] = useState<PendingApproval | null>(null);

  const load = useCallback(async () => {
    try {
      setPending(await getPendingApprovals());
    } catch {
      setPending([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live: a new submission arrives, or another admin resolved one.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const refresh = () => load();
    socket.on("validation:submitted", refresh);
    socket.on("validation:resolved", refresh);
    return () => {
      socket.off("validation:submitted", refresh);
      socket.off("validation:resolved", refresh);
    };
  }, [load]);

  async function onApprove(p: PendingApproval) {
    setBusyId(p.participantId);
    try {
      await approveParticipant(p.participantId);
      setPending((cur) => (cur || []).filter((x) => x.participantId !== p.participantId));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  }

  async function onRejectConfirmed() {
    const p = toReject;
    setToReject(null);
    if (!p) return;
    setBusyId(p.participantId);
    try {
      await rejectParticipant(p.participantId);
      setPending((cur) => (cur || []).filter((x) => x.participantId !== p.participantId));
    } catch {
      // no-op
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Staff validation</span>
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Validations</h1>
          </div>
        </div>
      </div>

      {pending == null ? (
        <div style={{ display: "grid", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="card card-pad">
              <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: "70%" }} />
            </div>
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div className="card">
          <div className="empty">
            <b>Nothing to review</b>
            When a student logs a challenge result, it appears here for approval.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {pending.map((p) => {
            const awarded = (p.challenge.pointsPerUnit || 0) * p.claimed;
            return (
              <div className="card card-pad validation-row" key={p.participantId}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <h4 style={{ margin: 0 }}>{p.student.name}</h4>
                    {p.student.faculty && (
                      <span className="pill pill-navy">{p.student.faculty}</span>
                    )}
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--slate)" }}>
                    Claimed <b>{p.claimed} {p.challenge.unit}</b> in{" "}
                    <b>{p.challenge.title}</b>
                    {p.submittedAt ? ` · ${formatDate(p.submittedAt)}` : ""}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--slate)" }}>
                    Approving awards <b className="mono">+{awarded} XP</b> and adds them to the
                    leaderboard.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-approve"
                    disabled={busyId === p.participantId}
                    onClick={() => onApprove(p)}
                  >
                    <Icon name="check" size={14} /> Approve
                  </button>
                  <button
                    className="btn btn-ghost"
                    disabled={busyId === p.participantId}
                    onClick={() => setToReject(p)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!toReject}
        danger
        title="Reject result"
        message={
          toReject
            ? `Reject ${toReject.student.name}'s claim of ${toReject.claimed} ${toReject.challenge.unit} in "${toReject.challenge.title}"? They won't receive points.`
            : ""
        }
        confirmLabel="Reject result"
        onConfirm={onRejectConfirmed}
        onCancel={() => setToReject(null)}
      />
    </>
  );
}