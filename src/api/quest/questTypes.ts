export interface Quest {
  questId: number;
  title: string;
  description?: string;
  points: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddQuestPayload {
  title: string;
  description?: string;
  points: number;
  category: string;
}

export interface EditQuestPayload {
  title?: string;
  description?: string;
  points?: number;
  category?: string;
}