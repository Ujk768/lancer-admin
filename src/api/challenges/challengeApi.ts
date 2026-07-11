import api from "../client";
import type {
  Challenge,
  ChallengeParticipant,
  ParticipantWithUser,
  UserChallengeParticipation,
  LeaderboardEntry,
  CreateChallengePayload,
} from "./challengeTypes";

// ---- Student/user routes ----

// GET /challenge/me — challenges the logged-in user is registered for
export async function getUserChallenges(): Promise<
  UserChallengeParticipation[]
> {
  const res = await api.get<{ participations: UserChallengeParticipation[] }>(
    "/challenge/me",
  );
  return res.data.participations;
}

// POST /challenge/:challengeId/register
export async function registerForChallenge(
  challengeId: string,
): Promise<ChallengeParticipant> {
  const res = await api.post<{
    success: boolean;
    message: string;
    participant: ChallengeParticipant;
  }>(`/challenge/${challengeId}/register`);
  return res.data.participant;
}

// GET /challenge/:challengeId/leaderboard
export async function getChallengeLeaderboard(
  challengeId: string,
): Promise<LeaderboardEntry[]> {
  const res = await api.get<{
    challengeId: string;
    leaderboard: LeaderboardEntry[];
  }>(`/challenge/${challengeId}/leaderboard`);
  return res.data.leaderboard;
}

// POST /challenge/category — body: { category }
export async function getChallengesByCategory(
  category: string,
): Promise<Challenge[]> {
  const res = await api.post<{ success: boolean; challenges: Challenge[] }>(
    "/challenge/category",
    { category },
  );
  return res.data.challenges;
}

// POST /challenge/:challengeId/submit-points — body: { pointsSubmitted }
export async function submitChallengePoints(
  challengeId: string,
  pointsSubmitted: number,
): Promise<ChallengeParticipant> {
  const res = await api.post<{
    success: boolean;
    message: string;
    participant: ChallengeParticipant;
  }>(`/challenge/${challengeId}/submit-points`, { pointsSubmitted });
  return res.data.participant;
}

// ---- Public / no-auth-required ----

// GET /challenge/active
export async function getActiveChallenges(): Promise<Challenge[]> {
  const res = await api.get<{
    success: boolean;
    activeChallenges: Challenge[];
  }>("/challenge/active");
  return res.data.activeChallenges;
}

// GET /challenge/all
export async function getAllChallenges(): Promise<Challenge[]> {
  const res = await api.get<{ success: boolean; allChallenges: Challenge[] }>(
    "/challenge/all",
  );
  return res.data.allChallenges;
}

// ---- Admin-only routes ----

// GET /challenge/:challengeId/participants (requires admin role)
export async function getChallengeParticipants(
  challengeId: string,
): Promise<ParticipantWithUser[]> {
  const res = await api.get<{ participants: ParticipantWithUser[] }>(
    `/challenge/${challengeId}/participants`,
  );
  return res.data.participants;
}

// POST /challenge/add (requires admin role)
export async function createChallenge(
  payload: CreateChallengePayload,
): Promise<Challenge> {
  const res = await api.post<{ success: boolean; challenge: Challenge }>(
    "/challenge/add",
    payload,
  );
  return res.data.challenge;
}

export async function getPendingChallenges(): Promise<Challenge[]> {
  const res = await api.get<{ success: boolean; pending: Challenge[] }>(
    "/challenge/pending",
  );
  return res.data.pending;
}

export const getChallengeById = async (
  challengeId: string,
): Promise<Challenge> => {
    console.log("caleld with ",challengeId)
  const res = await api.get<{ success: boolean; challenge: Challenge }>(
    `/challenge/${challengeId}`,
  );
  return res.data.challenge;
};
