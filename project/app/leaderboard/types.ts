export type LeaderboardPeriod = 'all' | 'monthly' | 'weekly';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  solvedChallenges: number;
  competitions: number;
}