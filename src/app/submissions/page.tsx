
"use client";
import ProtectedRoute from "@/components/layout/protected-route";
import { SubmissionListItem } from "@/components/submissions/submission-list-item";
import type { Submission } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const getMockSubmissions = (): Submission[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem('mockSubmissions');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return [
    { id: "sub_1678886400000", userId: "mock-user-id", userName: "Mock User", fileName: "my_solution_v1.zip", submittedAt: "2024-07-20T10:00:00Z", status: 'Completed', bleu4Score: 0.78, customBleuScore: 0.75, entityCoverageScore: 0.85, evaluationSummary: "Good overall performance." },
    { id: "sub_1678890000000", userId: "mock-user-id", userName: "Mock User", fileName: "another_try.tar.gz", submittedAt: "2024-07-19T14:30:00Z", status: 'Processing' },
    { id: "sub_1678893600000", userId: "mock-user-id", userName: "Mock User", fileName: "final_attempt.zip", submittedAt: "2024-07-18T09:15:00Z", status: 'Failed', evaluationSummary: "Execution timed out." },
    { id: "sub_1678897200000", userId: "mock-user-id", userName: "Mock User", fileName: "test_submission.zip", submittedAt: "2024-07-17T18:00:00Z", status: 'Completed', bleu4Score: 0.65, customBleuScore: 0.62, entityCoverageScore: 0.70 },
  ].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
};


export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setSubmissions(getMockSubmissions());
    setIsLoading(false);
  }, []);


  if (isLoading) {
     // This will be handled by ProtectedRoute if auth is loading,
     // but we can add a specific loader for submissions data if needed.
    return null; 
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <History className="h-10 w-10 text-primary" />
              My Submissions
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Track your progress and review your past attempts.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/submit">
              <PlusCircle className="mr-2 h-5 w-5" /> New Submission
            </Link>
          </Button>
        </header>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <History className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-xl text-muted-foreground">You haven't made any submissions yet.</p>
            <Button asChild className="mt-6">
              <Link href="/submit">Make Your First Submission</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <SubmissionListItem key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
