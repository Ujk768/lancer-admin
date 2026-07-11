export type ChallengeStatus = "active" | "completed";
export type ParticipantStatus = "pending" | "approved" | "rejected";

export interface Challenge {
  challengeId: string;
  challengeName: string;
  challengeImage?: string;
  challengeDescription?: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  venue?: string;
  instructorName?: string;
  challengeUnit?: string;
  pointsPerUnit?: number;
  category?: string;
}

export interface ChallengeParticipant {
  id: string;
  userId: number;
  challengeId: string;
  points: number;
  pointsSubmitted?: number;
  pointsAwarded?: number;
  status: ParticipantStatus;
  submitted_at?: string;
  createdAt: string;
}

export interface ParticipantWithUser extends ChallengeParticipant {
  user: {
    userId: number;
    name?: string;
    email?: string;
    profileImage?: string;
    points?: number;
  };
}

export interface UserChallengeParticipation extends ChallengeParticipant {
  challenge: Pick<
    Challenge,
    "challengeId" | "challengeName" | "startDate" | "endDate" | "status"
  >;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  points: number;
}

export interface CreateChallengePayload {
  challengeName: string;
  challengeImage?: string;
  challengeDescription?: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  venue?: string;
  instructorName?: string;
  challengeUnit?: string;
  pointsPerUnit?: number;
  category?: string;
}

export const CHALLENGE_TYPES = [
  "Running",
  "Cycling",
  "Swimming",
  "Gym",
  "Yoga",
];