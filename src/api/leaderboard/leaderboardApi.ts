// src/api/leaderboard/leaderboardApi.ts
//
// Faculty + campus leaderboards for the admin app. These hit the same backend
// endpoints the mobile app uses (/leaderboard/faculty, /leaderboard/campus), so
// the admin sees the exact same real-time standings students do.

import api from "../client";

export interface FacultyStanding {
  rank: number;
  facultyKey: string | null;
  faculty: string;
  members: number;
  totalXp: number;
  avgXp: number;
}

export interface CampusStanding {
  rank: number;
  userId: number;
  name: string;
  faculty: string;
  facultyKey: string | null;
  nationality: string | null;
  xp: number;
  level?: number;
}

// GET /leaderboard/faculty — faculties ranked by average XP per member.
export async function getFacultyLeaderboard(): Promise<FacultyStanding[]> {
  const res = await api.get<{ success: boolean; leaderboard: FacultyStanding[] }>(
    "/leaderboard/faculty",
  );
  return res.data.leaderboard;
}

// GET /leaderboard/campus — every student ranked by total XP.
export async function getCampusLeaderboard(): Promise<CampusStanding[]> {
  const res = await api.get<{ success: boolean; leaderboard: CampusStanding[] }>(
    "/leaderboard/campus",
  );
  return res.data.leaderboard;
}