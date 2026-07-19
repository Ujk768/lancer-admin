import { useEffect, useState } from "react";
// import {
//   listQuestBank,
//   addQuest,
//   removeQuest,
//   getDailyQuests,
//   setDailyQuests,
//   clearDailyOverride,
// } from "../api/client";
import { QUEST_CATEGORIES } from "../utils";
// import { todayKey } from "../api/seasons";
// import { useToast } from "../components/Toast";
import ConfirmDialog from "../components/ComfirmDialog";
import Icon from "../components/Icon";
import type { Quest } from "../api/quest/questTypes";
import {
getAllQuests,
getDailyQuests,
clearDailyOverride,
addQuest,
setDailyQuests
} from "../api/quest/questApi";

// Daily quest management. Three quests rotate automatically from the bank
// each day with zero admin work. Admins can swap individual slots for today,
// pin a custom set, or reset back to the automatic rotation. The bank itself
// can grow or shrink at any time.

export default function Quests() {
  //   const toast = useToast();
  const [bank, setBank] = useState<Quest[]>([]);
  const [today, setToday] = useState<Quest[]>([]);
  const [overridden, setOverridden] = useState(false);
  const [toRemove, setToRemove] = useState<Quest>();
  const [swapSlot, setSwapSlot] = useState<number>(0); // index of slot being swapped
  const [search, setSearch] = useState("");
  //   const [newQuest, setNewQuest] = useState({ title: "", xp: "", category: QUEST_CATEGORIES[0] });
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState<string>(QUEST_CATEGORIES[0]);
  const [formError, setFormError] = useState("");
  //   const dateKey = todayKey();

  async function load() {
    try {
      //   const [b, t] = await Promise.all([listQuestBank(), getDailyQuests(dateKey)]);
      //   setBank(b);
      //   setToday(t);
      const quests = await getAllQuests();
      console.log(quests)
      const todayQuests = await getDailyQuests();
      setBank(quests);
      setToday(todayQuests.quests);
    } catch (err) {
      //   toast.error(err.message || "Could not load the quest bank.");
      setBank([]);
      setToday([]);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e) {
    e.preventDefault();
    setFormError("");
    try {
      await addQuest({
        title: title,
        // description: description,
        xp: points,
        category: category,
      });
      //   setNewQuest({ title: "", xp: "", category: QUEST_CATEGORIES[0] });
      //   toast.success("Quest added to the bank.");
      load();
    } catch (err) {
      setFormError(err.message || "The quest could not be added.");
    }
  }

  // async function confirmRemove() {
  //   try {
  //     await clearDailyOverride()
  //   } catch (err) {
  //       console.error("Error",err);
  //     //   toast.error(err.message || "That quest could not be removed.");
  //   }
  // }

  async function swapInto(slotIndex: number, quest: Quest) {
    try {
        console.log("inside swap into")
      const ids = today?.map((q) => q.questId);
    //   if (ids.includes(quest.questId)) {
    //     // toast.error("That quest is already in today's rotation.");
    //     return;
    //   }
      ids[slotIndex] = quest.questId;
      //   const updat     ed = await setDailyQuests(dateKey, ids);
      // const deactivate = await deActivateQuest(today[slotIndex].questId);
      const currentQuests = [...today];
      currentQuests[slotIndex] = quest
      console.log("currentQuests",currentQuests)
      setToday(currentQuests);
      // const activate = await activateQuest(quest.questId)
    } catch (err) {
    //   toast.error(err.message || "The swap could not be saved.");
    }
  }

//   async function resetToday() {
//     try {
//       const t = await clearDailyOverride(dateKey);
//       setToday(t);
//       setOverridden(false);
//     //   toast.success("Today's quests are back on automatic rotation.");
//     } catch (err) {
//     //   toast.error(err.message || "Could not reset today's rotation.");
//     }
//   }

  const filteredBank = (bank || []).filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="page-head">
        <div className="titles">
          {/* <span className="eyebrow">Rotation of {dateKey}</span> */}
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Daily Quests</h1>
          </div>
        </div>
        {/* {overridden && (
          <button className="btn btn-ghost" onClick={resetToday}>
            <Icon name="refresh" size={15} /> Reset to automatic
          </button>
        )} */}
      </div>

      <div className="card card-pad" style={{ marginBottom: 26 }}>
        <span className="eyebrow">Live today for students</span>
        <p
          style={{ fontSize: 13, color: "var(--slate)", margin: "6px 0 16px" }}
        >
          Three quests are drawn from the bank automatically each day. Use Swap
          on any slot to hand-pick a replacement for today only. Tomorrow goes
          back to automatic unless changed again.
        </p>
        <div className="grid grid-3">
          {today === null
            ? [0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 90 }} />
              ))
            : today?.map((q, i) => (
                <div className="today-quest" key={q.questId}>
                  <div className="slot">SLOT {i + 1}</div>
                  <h4>{q.title}</h4>
                  <div
                    className="q-xp mono"
                    style={{
                      color: "var(--gold-deep)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    +{q.xp} XP · {q.category}
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={() => setSwapSlot(i)}
                  >
                    {swapSlot === i ? "Cancel swap" : "Swap"}
                  </button>
                </div>
              ))}
        </div>
        {swapSlot !== null && (
          <div
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "var(--navy-700)",
              background: "var(--gold-soft)",
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            Pick a quest from the bank below to place it in slot {swapSlot||0 + 1}{" "}
            for today.
          </div>
        )}
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
          alignItems: "start",
        }}
      >
        <div className="card">
          <div className="card-head">
            <h3>Quest bank</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="search" size={15} style={{ color: "var(--slate)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quests"
                style={{
                  border: "1px solid var(--line-strong)",
                  borderRadius: 8,
                  padding: "7px 10px",
                  fontSize: 13,
                }}
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
              <div className="quest-row" key={q.questId}>
                <div className="q-title">
                  {q.title}
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                    {q.category}
                  </div>
                </div>
                <span className="q-xp">+{q.xp} XP</span>
                {swapSlot !== null ? (
                  <button
                    className="btn btn-navy btn-sm"
                    onClick={() => swapInto(swapSlot, q)}
                  >
                    Use in slot {swapSlot + 1}
                  </button>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setToRemove(q)}
                    aria-label={`Remove ${q.title}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="card card-pad">
          <span className="eyebrow">Add to the bank</span>
          <form
            onSubmit={handleAdd}
            className="form-grid"
            style={{ marginTop: 14 }}
            noValidate
          >
            {formError && (
              <div className="field-error" role="alert">
                {formError}
              </div>
            )}
            <div className="field">
              <span>Quest title</span>
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Do 20 minutes on the stair climber"
              />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <span>XP reward</span>
                <input
                  type="number"
                  min="1"
                  value={points}
                  onChange={(e) =>
                    setPoints(+e.target.value)
                  }
                  placeholder="40"
                />
              </div>
              <div className="field">
                <span>Category</span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  {QUEST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-navy">
              <Icon name="plus" size={15} /> Add quest
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={!!toRemove}
        danger
        title="Remove quest"
        message={
          toRemove
            ? `"${toRemove.title}" will stop appearing in daily rotations. Days it was already shown are unaffected.`
            : ""
        }
        confirmLabel="Remove quest"
        onConfirm={()=>console.log("onconfirm")}
        onCancel={() => console.log("oncancel")}
      />
    </>
  );
}
