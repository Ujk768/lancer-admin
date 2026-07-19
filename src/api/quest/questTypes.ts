// src/api/questTypes.ts

export interface Quest {
  questId: number;
  title: string;
  xp: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestPayload {
  title: string;
  xp: number;
  category?: string;
}

export interface DailyQuests {
  date: string;
  quests: Quest[];
}