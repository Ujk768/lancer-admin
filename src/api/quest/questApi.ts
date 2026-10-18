// src/api/quest.ts
import api from "../client";
import type { Quest, CreateQuestPayload, DailyQuests } from "./questTypes";

// Every function below reads the SAME envelope key the backend actually sends.
// The backend wraps lists as { success, quests } / { success, quests, date } etc.

// ---- Student/user routes ----

// GET /quest/list — the full quest bank
export async function getAllQuests(): Promise<Quest[]> {
  const res = await api.get<{ success: boolean; quests: Quest[] }>("/quest/list");
  return res.data.quests;
}

// GET /quest/daily — today's rotation (or a specific date via ?date=YYYY-MM-DD)
export async function getDailyQuests(date?: string): Promise<DailyQuests> {
  const res = await api.get<{ success: boolean; date: string; quests: Quest[] }>(
    "/quest/daily",
    { params: date ? { date } : undefined },
  );
  return { date: res.data.date, quests: res.data.quests };
}

// ---- Admin-only routes ----

// PUT /quest/set-daily — body: { date, questIds }
export async function setDailyQuests(
  date: string,
  questIds: number[],
): Promise<void> {
  await api.put("/quest/set-daily", { date, questIds });
}

// DELETE /quest/daily/:date
export async function clearDailyOverride(date: string): Promise<void> {
  await api.delete(`/quest/daily/${date}`);
}

// POST /quest/add
export async function addQuest(payload: CreateQuestPayload): Promise<Quest> {
  const res = await api.post<{ success: boolean; quest: Quest }>("/quest/add", payload);
  return res.data.quest;
}

// DELETE /quest/:id
export async function removeQuest(id: string | number): Promise<void> {
  await api.delete(`/quest/${id}`);
}