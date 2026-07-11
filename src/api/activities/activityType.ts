export interface Activity {
  activityId: number;
  activityName: string;
  activityImage?: string;
  activityDescription: string;
  units: string;
  pointsPerUnit: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityPayload {
  activityName: string;
  activityDescription: string;
  units: string;
  pointsPerUnit: number;
  category?: string;
  activityImage?: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  activityId: number;
  date: string;
  unitsLogged: number;
  pointsPerUnit: number;
  pointsEarned: number;
}