export type ChallengeStatus = "active" | "completed";
export type ParticipantStatus = "pending" | "approved" | "rejected";

// This mirrors EXACTLY what the backend's serializeChallenge() returns
// (see backend/src/utils/serializers.ts). The old shape used raw column names
// (challengeName, challengeImage, challengeUnit...) which never matched the API
// and left every field undefined in the UI.
export interface Challenge {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  type: string | null;
  category: string | null;
  goal: number;
  unit: string;
  pointsPerUnit: number;
  xpReward: number;
  podium: { first: number; second: number; third: number };
  requiresValidation: boolean;
  venue: string | null;
  instructorName: string | null;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  season?: string;
  participants: number;
  createdBy: string | null;
}

export interface ParticipantWithUser {
  participantId: number;
  status: ParticipantStatus;
  pointsSubmitted: number;
  pointsAwarded: number;
  submittedAt?: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    email?: string;
    faculty?: string;
    nationality?: string;
    totalXp?: number;
  };
}

export interface UserChallengeParticipation extends Challenge {
  myStatus: ParticipantStatus;
  myPointsSubmitted: number;
  myPointsAwarded: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    faculty?: string;
    nationality?: string;
    totalXp?: number;
  };
  points: number;
}

// The admin "Validations" queue item, from GET /participants/pending.
export interface PendingApproval {
  participantId: number;
  claimed: number;
  submittedAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    email?: string;
    faculty?: string;
    nationality?: string;
    totalXp?: number;
  };
  challenge: Challenge;
}

// The payload the CreateChallenge form sends. Field names match what the
// backend's createChallenge() reads first (title/description/imageUrl/unit...).
export interface CreateChallengePayload {
  title: string;
  description?: string;
  imageUrl?: string;
  unit: string;
  pointsPerUnit: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  venue?: string;
  instructorName?: string;
  category?: string;
  type?: string;
  goal?: number;
  requiresValidation?: boolean;
  podium?: { first: number; second: number; third: number };
}

export const CHALLENGE_TYPES = [
  "Running",
  "Cycling",
  "Swimming",
  "Gym",
  "Yoga",
];