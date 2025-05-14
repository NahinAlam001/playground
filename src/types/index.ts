
export type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
};

export type Submission = {
  id: string;
  userId: string;
  userName: string; 
  fileName: string;
  submittedAt: string; // ISO date string
  status: 'Processing' | 'Completed' | 'Failed';
  bleu4Score?: number;
  customBleuScore?: number;
  entityCoverageScore?: number;
  evaluationSummary?: string;
  logs?: string; // Could be a link to logs or the log content itself
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  userName: string;
  bleu4Score: number;
  customBleuScore: number;
  entityCoverageScore: number;
  lastSubmissionDate: string; // ISO date string
  totalSubmissions: number;
};
