
"use client";
import ProtectedRoute from "@/components/layout/protected-route";
import { SubmissionDetailsView } from "@/components/submissions/submission-details-view";
import type { Submission } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const getMockSubmissionById = (id: string): Submission | undefined => {
  if (typeof window === "undefined") return undefined;
  const submissions: Submission[] = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
  const found = submissions.find(s => s.id === id);
  if (found) return found;

  // Fallback mock if not found in local storage (e.g., direct navigation)
  return { 
    id, 
    userId: "mock-user-id", 
    userName: "Mock User",
    fileName: "default_submission.zip", 
    submittedAt: new Date().toISOString(), 
    status: Math.random() > 0.7 ? 'Completed' : Math.random() > 0.4 ? 'Processing' : 'Failed', 
    bleu4Score: Math.random() * 0.3 + 0.6, 
    customBleuScore: Math.random() * 0.3 + 0.55, 
    entityCoverageScore: Math.random() * 0.3 + 0.65,
    evaluationSummary: "This is a sample AI-generated summary of the evaluation. The model performed adequately on most metrics but could improve on custom entities.",
    logs: "Sample log output...\nProcessing line 1...\nProcessing line 2...\nDone."
  };
};


export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Simulate fetching data
      const fetchedSubmission = getMockSubmissionById(id);
      if (fetchedSubmission) {
        // Simulate random processing time for "Processing" state
        if (fetchedSubmission.status === 'Processing') {
          setTimeout(() => {
            const updatedSubmission = {
              ...fetchedSubmission, 
              status: Math.random() > 0.3 ? 'Completed' : 'Failed' as Submission['status'],
              bleu4Score: Math.random() * 0.4 + 0.5,
              customBleuScore: Math.random() * 0.4 + 0.45,
              entityCoverageScore: Math.random() * 0.4 + 0.55,
              evaluationSummary: "Evaluation finished. Check scores and logs.",
            };
             // Update localStorage if it exists
            if(typeof window !== "undefined") {
              let submissions: Submission[] = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
              submissions = submissions.map(s => s.id === id ? updatedSubmission : s);
              localStorage.setItem('mockSubmissions', JSON.stringify(submissions));
            }
            setSubmission(updatedSubmission);
          }, 3000 + Math.random() * 3000); // 3-6 seconds delay
        }
        setSubmission(fetchedSubmission);
      } else {
        setError("Submission not found.");
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-1 items-center justify-center p-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }
  
  if (error) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-xl text-destructive">{error}</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/submissions">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Submissions
            </Link>
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  if (!submission) {
     // Should be caught by error state, but as a fallback
    return (
       <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Submission data could not be loaded.</p>
        </div>
      </ProtectedRoute>
    );
  }


  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/submissions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Submissions
          </Link>
        </Button>
        <SubmissionDetailsView submission={submission} />
      </div>
    </ProtectedRoute>
  );
}

