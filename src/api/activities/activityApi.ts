import api from "../client";
import type { Activity, CreateActivityPayload, ActivityLog } from "./activityType";

// GET /activity/all — any authenticated user
export async function getAllActivities(): Promise<Activity[]> {
  const res = await api.get<{ success: boolean; activities: Activity[] }>("/activity/all");
  return res.data.activities;
}

// POST /activity/create — any authenticated user
export async function createActivity(payload: CreateActivityPayload): Promise<Activity> {
  const res = await api.post<{ success: boolean; message: string; activity: Activity }>(
    "/activity/create",
    payload
  );
  return res.data.activity;
}

// POST /activity/:activityid/award-points — any authenticated user
export async function awardActivityPoints(
  activityId: number,
  unitsLogged: number
): Promise<ActivityLog> {
  const res = await api.post<{ success: boolean; message: string; log: ActivityLog }>(
    `/activity/${activityId}/award-points`,
    { unitsLogged }
  );
  return res.data.log;
}