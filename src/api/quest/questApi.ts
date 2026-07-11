import api from "../client";
import type { Quest, AddQuestPayload, EditQuestPayload } from "./questTypes";

// GET /quest/all — admin only
export async function getAllQuests(): Promise<Quest[]> {
  const res = await api.get<{ success: boolean; quests: Quest[] }>("/quest/all");
  return res.data.quests;
}

// GET /quest/active — any authenticated user
export async function getActiveQuests(): Promise<Quest[]> {
  const res = await api.get<{ success: boolean; quests: Quest[] }>("/quest/active");
  return res.data.quests;
}

// POST /quest/add — admin only
export async function addQuest(payload: AddQuestPayload): Promise<Quest> {
  const res = await api.post<{ success: boolean; quest: Quest }>("/quest/add", payload);
  return res.data.quest;
}

// POST /quest/:questId/edit — admin only
export async function editQuest(
  questId: number,
  payload: EditQuestPayload
): Promise<Quest> {
  const res = await api.post<{ success: boolean; quest: Quest }>(
    `/quest/${questId}/edit`,
    payload
  );
  return res.data.quest;
}

// DELETE /quest/:questId/delete — admin only
export async function deleteQuest(questId: number): Promise<void> {
  await api.delete(`/quest/${questId}/delete`);
}

// POST /quest/:questId/activate — admin only
export async function activateQuest(questId: number): Promise<Quest> {
  const res = await api.post<{ success: boolean; data: Quest; message: string }>(
    `/quest/${questId}/activate`
  );
  return res.data.data;
}