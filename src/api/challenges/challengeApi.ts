import api from "../client";
import type {
  Challenge,
  ParticipantWithUser,
  UserChallengeParticipation,
  LeaderboardEntry,
  CreateChallengePayload,
  PendingApproval,
} from "./challengeTypes";

// Every function below reads the SAME envelope key the backend actually sends.
// The backend wraps lists as { success, challenges } / { leaderboard } etc.
// (not activeChallenges/allChallenges/participations — those never existed).

// ---- Student/user routes ----

// GET /challenge/me — challenges the logged-in user is registered for
export async function getUserChallenges(): Promise<UserChallengeParticipation[]> {
  const res = await api.get<{ success: boolean; challenges: UserChallengeParticipation[] }>(
    "/challenge/me",
  );
  return res.data.challenges;
}

// POST /challenge/:challengeId/register
export async function registerForChallenge(challengeId: string | number) {
  const res = await api.post(`/challenge/${challengeId}/register`);
  return res.data.participant;
}

// GET /challenge/:challengeId/leaderboard
export async function getChallengeLeaderboard(
  challengeId: string | number,
): Promise<LeaderboardEntry[]> {
  const res = await api.get<{ success: boolean; challengeId: number; leaderboard: LeaderboardEntry[] }>(
    `/challenge/${challengeId}/leaderboard`,
  );
  return res.data.leaderboard;
}

// POST /challenge/category — body: { category }
export async function getChallengesByCategory(category: string): Promise<Challenge[]> {
  const res = await api.post<{ success: boolean; challenges: Challenge[] }>(
    "/challenge/category",
    { category },
  );
  return res.data.challenges;
}

// POST /challenge/:challengeId/submit-points — body: { pointsSubmitted }
export async function submitChallengePoints(
  challengeId: string | number,
  pointsSubmitted: number,
) {
  const res = await api.post(`/challenge/${challengeId}/submit-points`, { pointsSubmitted });
  return res.data.participant;
}

// ---- Public / no-auth-required ----

// GET /challenge/active
export async function getActiveChallenges(): Promise<Challenge[]> {
  const res = await api.get<{ success: boolean; challenges: Challenge[] }>("/challenge/active");
  return res.data.challenges;
}

// GET /challenge/all
export async function getAllChallenges(): Promise<Challenge[]> {
  const res = await api.get<{ success: boolean; challenges: Challenge[] }>("/challenge/all");
  return res.data.challenges;
}

// GET /challenge/:challengeId
export async function getChallengeById(challengeId: string | number): Promise<Challenge> {
  const res = await api.get<{ success: boolean; challenge: Challenge }>(
    `/challenge/${challengeId}`,
  );
  return res.data.challenge;
}

// ---- Admin-only routes ----

// GET /challenge/:challengeId/participants
export async function getChallengeParticipants(
  challengeId: string | number,
): Promise<ParticipantWithUser[]> {
  const res = await api.get<{ success: boolean; participants: ParticipantWithUser[] }>(
    `/challenge/${challengeId}/participants`,
  );
  return res.data.participants;
}

// POST /challenge/add
export async function createChallenge(payload: CreateChallengePayload): Promise<Challenge> {
  const res = await api.post<{ success: boolean; challenge: Challenge }>("/challenge/add", payload);
  return res.data.challenge;
}

// DELETE /challenge/:challengeId
export async function deleteChallenge(challengeId: string | number): Promise<void> {
  await api.delete(`/challenge/${challengeId}`);
}

// GET /challenge/pending — challenges that have at least one result awaiting review
export async function getPendingChallenges(): Promise<Challenge[]> {
  const res = await api.get<{ success: boolean; pending: Challenge[] }>("/challenge/pending");
  return res.data.pending;
}

// ---- Validations (the approval queue) — mounted under /participants ----

// GET /participants/pending
export async function getPendingApprovals(): Promise<PendingApproval[]> {
  const res = await api.get<{ success: boolean; pending: PendingApproval[] }>(
    "/participants/pending",
  );
  return res.data.pending;
}

// PATCH /participants/:participantId/approve
export async function approveParticipant(participantId: string | number) {
  const res = await api.patch(`/participants/${participantId}/approve`);
  return res.data.participant;
}

// PATCH /participants/:participantId/reject — body: { reason? }
export async function rejectParticipant(participantId: string | number, reason?: string) {
  const res = await api.patch(`/participants/${participantId}/reject`, { reason });
  return res.data.participant;
}