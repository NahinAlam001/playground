
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import type { LeaderboardEntry } from "@/types";
import { Trophy } from "lucide-react";

// Mock data for the leaderboard
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: "user123", userName: "AliceCoder", bleu4Score: 0.875, customBleuScore: 0.852, entityCoverageScore: 0.910, lastSubmissionDate: "2024-07-20T10:00:00Z", totalSubmissions: 15 },
  { rank: 2, userId: "user456", userName: "BobNLP", bleu4Score: 0.860, customBleuScore: 0.840, entityCoverageScore: 0.895, lastSubmissionDate: "2024-07-19T14:30:00Z", totalSubmissions: 12 },
  { rank: 3, userId: "user789", userName: "CharlieForge", bleu4Score: 0.845, customBleuScore: 0.833, entityCoverageScore: 0.880, lastSubmissionDate: "2024-07-20T09:15:00Z", totalSubmissions: 20 },
  { rank: 4, userId: "user101", userName: "DataDave", bleu4Score: 0.830, customBleuScore: 0.810, entityCoverageScore: 0.865, lastSubmissionDate: "2024-07-18T11:00:00Z", totalSubmissions: 8 },
  { rank: 5, userId: "user112", userName: "EvaModel", bleu4Score: 0.820, customBleuScore: 0.800, entityCoverageScore: 0.850, lastSubmissionDate: "2024-07-20T12:45:00Z", totalSubmissions: 18 },
  { rank: 6, userId: "user131", userName: "FrankAI", bleu4Score: 0.815, customBleuScore: 0.795, entityCoverageScore: 0.840, lastSubmissionDate: "2024-07-17T16:00:00Z", totalSubmissions: 5 },
  { rank: 7, userId: "user415", userName: "GraceLing", bleu4Score: 0.800, customBleuScore: 0.780, entityCoverageScore: 0.830, lastSubmissionDate: "2024-07-19T08:20:00Z", totalSubmissions: 10 },
];


export default function LeaderboardPage() {
  // In a real app, this data would be fetched from an API
  const leaderboardEntries: LeaderboardEntry[] = mockLeaderboardData;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Trophy className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Leaderboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See who's leading the pack in the Profile Forge NLP competition.
        </p>
      </header>
      
      <LeaderboardTable entries={leaderboardEntries} />

      <p className="text-center text-sm text-muted-foreground pt-4">
        Scores are updated periodically. Keep submitting to improve your rank!
      </p>
    </div>
  );
}
