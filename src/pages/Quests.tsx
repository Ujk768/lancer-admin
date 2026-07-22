import { useEffect, useState, useCallback } from "react";
import { QUEST_CATEGORIES } from "../utils";
import ConfirmDialog from "../components/ComfirmDialog";
import Icon from "../components/Icon";
import type { Quest } from "../api/quest/questTypes";
import {
  getAllQuests,
  getDailyQuests,
  setDailyQuests,
  clearDailyOverride,
  addQuest,
  removeQuest,
} from "../api/quest/questApi";
import { getSocket } from "../api/socket";

// Daily quest management with a hard 24-hour lock window.
//
// Rule: the quests LIVE right now (today's rotation) are LOCKED — an admin
// cannot change what students are already seeing. What an admin CAN edit is
// TOMORROW's rotation (the next 24h window, before it goes live): swap slots,
// delete a slot, or pin a custom set. Once a day becomes "today" it freezes.
// This gives students a stable, predictable daily set.

const DAILY_SLOTS = 3;

function dateKeyOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function prettyDate(key: string): string {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function Quests() {
  const [bank, setBank] = useState<Quest[] | null>(null);
  const [today, setToday] = useState<Quest[] | null>(null);
  const [tomorrow, setTomorrow] = useState<Quest[] | null>(null);
  const [tomorrowOverridden, setTomorrowOverridden] = useState(false);
  const [swapSlot, setSwapSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [toRemove, setToRemove] = useState<Quest>();
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState(QUEST_CATEGORIES[0]);
  const [formError, setFormError] = useState("");

  const todayKey = dateKeyOffset(0);
  const tomorrowKey = dateKeyOffset(1);

  const load = useCallback(async () => {
    try {
      const [allQuests, todayD, tomorrowD] = await Promise.all([
        getAllQuests(),
        getDailyQuests(todayKey),
        getDailyQuests(tomorrowKey),
      ]);
      setBank(allQuests);
      setToday(todayD.quests);
      setTomorrow(tomorrowD.quests);
      // Heuristic: if tomorrow's set differs from the default we can't easily
      // know here, so we track override state locally when the admin edits.
    } catch {
      setBank([]);
      setToday([]);
      setTomorrow([]);
    }
  }, [todayKey, tomorrowKey]);

  useEffect(() => { load(); }, [load]);

  // Live refresh if quests change elsewhere.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onUpd = () => load();
    socket.on("quests:updated", onUpd);
    return () => { socket.off("quests:updated", onUpd); };
  }, [load]);

  // Edit tomorrow only (the next-24h window). Swap a slot to a bank quest.
  async function swapTomorrow(slotIndex: number, quest: Quest) {
    try {
      const ids = (tomorrow || []).map((q) => q.id);
      while (ids.length < DAILY_SLOTS) ids.push(quest.id);
      ids[slotIndex] = quest.id;
      await setDailyQuests(tomorrowKey, ids);
      const refreshed = await getDailyQuests(tomorrowKey);
      setTomorrow(refreshed.quests);
      setTomorrowOverridden(true);
      setSwapSlot(null);
    } catch (err) {
      console.error("Swap failed", err);
    }
  }

  // Remove a slot from tomorrow's set.
  async function removeFromTomorrow(slotIndex: number) {
    try {
      const ids = (tomorrow || []).map((q) => q.id).filter((_, i) => i !== slotIndex);
      if (ids.length === 0) {
        await clearDailyOverride(tomorrowKey);
        setTomorrowOverridden(false);
      } else {
        await setDailyQuests(tomorrowKey, ids);
        setTomorrowOverridden(true);
      }
      const refreshed = await getDailyQuests(tomorrowKey);
      setTomorrow(refreshed.quests);
    } catch (err) {
      console.error("Remove failed", err);
    }
  }

  async function resetTomorrow() {
    try {
      await clearDailyOverride(tomorrowKey);
      setTomorrowOverridden(false);
      const refreshed = await getDailyQuests(tomorrowKey);
      setTomorrow(refreshed.quests);
    } catch (err) {
      console.error("Reset failed", err);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!title.trim()) { setFormError("Quest title is required."); return; }
    if (!(points > 0)) { setFormError("XP must be a positive number."); return; }
    try {
      await addQuest({ title: title.trim(), xp: points, category });
      setTitle(""); setPoints(0); setCategory(QUEST_CATEGORIES[0]);
      load();
    } catch (err) {
      setFormError((err as Error).message || "The quest could not be added.");
    }
  }

  async function confirmRemove() {
    if (!toRemove) return;
    try {
      await removeQuest(toRemove.id);
      setToRemove(undefined);
      load();
    } catch (err) {
      console.error("Remove from bank failed", err);
      setToRemove(undefined);
    }
  }

  const filteredBank = (bank || []).filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">24-hour lock window</span>
          <div className="title-row">
            <span className="trident-rule"><span /><span /><span /></span>
            <h1 className="page-title">Daily Quests</h1>
          </div>
        </div>
        {tomorrowOverridden && (
          <button className="btn btn-ghost" onClick={resetTomorrow}>
            <Icon name="refresh" size={15} /> Reset tomorrow to automatic
          </button>
        )}
      </div>

      {/* LIVE TODAY — locked */}
      <div className="card card-pad" style={{ marginBottom: 20, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="eyebrow">Live now · {prettyDate(todayKey)}</span>
          <span className="pill" style={{ background: "rgba(120,130,150,0.14)", color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            Locked
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", margin: "6px 0 16px" }}>
          These quests are already live for students today and can't be changed. Edits apply to tomorrow's set below.
        </p>
        <div className="grid grid-3">
          {today === null
            ? [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 90 }} />)
            : today.map((q, i) => (
                <div className="today-quest" key={q.id} style={{ opacity: 0.75 }}>
                  <div className="slot">SLOT {i + 1}</div>
                  <h4>{q.title}</h4>
                  <div className="q-xp mono" style={{ color: "var(--gold-deep)", fontWeight: 600, fontSize: 13 }}>
                    +{q.xp} XP · {q.category}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* TOMORROW — editable (next 24h window) */}
      <div className="card card-pad" style={{ marginBottom: 26, borderColor: "var(--gold)", borderWidth: 1, borderStyle: "solid" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="eyebrow">Up next · {prettyDate(tomorrowKey)}</span>
          <span className="pill pill-gold" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            Editable until live
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", margin: "6px 0 16px" }}>
          Swap or remove slots before this set goes live. Pick a bank quest below to fill a slot. Once tomorrow becomes today, it locks automatically.
        </p>
        <div className="grid grid-3">
          {tomorrow === null
            ? [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 110 }} />)
            : Array.from({ length: DAILY_SLOTS }, (_, i) => {
                const q = tomorrow[i];
                return (
                  <div className="today-quest" key={i} style={swapSlot === i ? { borderColor: "var(--gold)", borderWidth: 1, borderStyle: "solid" } : undefined}>
                    <div className="slot">SLOT {i + 1}</div>
                    {q ? (
                      <>
                        <h4>{q.title}</h4>
                        <div className="q-xp mono" style={{ color: "var(--gold-deep)", fontWeight: 600, fontSize: 13 }}>
                          +{q.xp} XP · {q.category}
                        </div>
                      </>
                    ) : (
                      <h4 style={{ color: "var(--slate)" }}>Empty slot</h4>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSwapSlot(swapSlot === i ? null : i)}>
                        {swapSlot === i ? "Cancel" : q ? "Swap" : "Fill"}
                      </button>
                      {q && (
                        <button className="btn btn-ghost btn-sm" onClick={() => removeFromTomorrow(i)} aria-label={`Remove slot ${i + 1}`}>
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
        {swapSlot !== null && (
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--navy-700)", background: "var(--gold-soft)", borderRadius: 8, padding: "10px 14px" }}>
            Pick a quest from the bank below to place it in slot {swapSlot + 1} for tomorrow.
          </div>
        )}
      </div>

      {/* QUEST BANK + ADD */}
      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", alignItems: "start" }}>
        <div className="card">
          <div className="card-head">
            <h3>Quest bank</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="search" size={15} style={{ color: "var(--slate)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quests"
                style={{ border: "1px solid var(--line-strong)", borderRadius: 8, padding: "7px 10px", fontSize: 13 }}
                aria-label="Search quest bank"
              />
              <span className="pill pill-navy">{bank?.length ?? 0} quests</span>
            </div>
          </div>
          {bank === null ? (
            <div style={{ padding: 24, display: "grid", gap: 12 }}>
              <div className="skeleton" />
              <div className="skeleton" style={{ width: "80%" }} />
            </div>
          ) : filteredBank.length === 0 ? (
            <div className="empty">No quests match that search.</div>
          ) : (
            filteredBank.map((q) => (
              <div className="quest-row" key={q.id}>
                <div className="q-title">
                  {q.title}
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{q.category}</div>
                </div>
                <span className="q-xp">+{q.xp} XP</span>
                {swapSlot !== null ? (
                  <button className="btn btn-navy btn-sm" onClick={() => swapTomorrow(swapSlot, q)}>
                    Use in slot {swapSlot + 1}
                  </button>
                ) : (
                  <button className="btn btn-ghost btn-sm" onClick={() => setToRemove(q)} aria-label={`Remove ${q.title}`}>
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="card card-pad">
          <span className="eyebrow">Add to the bank</span>
          <form onSubmit={handleAdd} className="form-grid" style={{ marginTop: 14 }} noValidate>
            {formError && <div className="field-error" role="alert">{formError}</div>}
            <div className="field">
              <span>Quest title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Do 20 minutes on the stair climber" />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <span>XP reward</span>
                <input type="number" min="1" value={points || ""} onChange={(e) => setPoints(+e.target.value)} placeholder="40" />
              </div>
              <div className="field">
                <span>Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {QUEST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-navy"><Icon name="plus" size={15} /> Add quest</button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={!!toRemove}
        danger
        title="Remove quest"
        message={toRemove ? `"${toRemove.title}" will stop appearing in daily rotations. Days it was already shown are unaffected.` : ""}
        confirmLabel="Remove quest"
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(undefined)}
      />
    </>
  );
}