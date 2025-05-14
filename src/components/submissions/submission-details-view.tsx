
"use client";
import type { Submission } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileArchive, CalendarDays, CheckCircle2, XCircle, Loader2, BarChart3, Download, FileText, BrainCircuit } from "lucide-react";

interface SubmissionDetailsViewProps {
  submission: Submission;
}

export function SubmissionDetailsView({ submission }: SubmissionDetailsViewProps) {
  const getStatusBadgeVariant = (status: Submission['status']) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Processing': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'Processing': return <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />;
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  const mockLogs = submission.status === 'Failed' 
    ? `Error: Execution failed due to timeout after 120 seconds.
Please optimize your code for better performance.
Last few lines of stdout:
Processing item 1...
Processing item 2...`
    : submission.status === 'Completed' 
    ? `Execution successful.
Generated ${Math.floor(Math.random() * 100 + 50)} profiles.
Total processing time: ${(Math.random() * 60 + 30).toFixed(2)} seconds.
All metrics calculated.`
    : `Processing job ${submission.id}... Awaiting results.`;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-grow">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileArchive className="h-7 w-7 text-primary" />
                {submission.fileName}
              </CardTitle>
              <CardDescription className="text-sm mt-1">Submission ID: {submission.id}</CardDescription>
            </div>
            <div className="flex flex-col sm:items-end gap-2 sm:gap-1 w-full sm:w-auto">
                 <Badge variant={getStatusBadgeVariant(submission.status)} className="capitalize text-sm flex items-center gap-1.5 py-1.5 px-3">
                {getStatusIcon(submission.status)}
                {submission.status}
              </Badge>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CalendarDays className="h-3 w-3" />
                {formatDate(submission.submittedAt)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => alert('Download functionality not implemented.')}>
            <Download className="mr-2 h-4 w-4" /> Download Submitted Archive
          </Button>
        </CardContent>
      </Card>

      {submission.status === 'Completed' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Evaluation Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <ScoreCard title="BLEU-4 Score" value={submission.bleu4Score} />
            <ScoreCard title="Custom BLEU Score" value={submission.customBleuScore} />
            <ScoreCard title="Entity Coverage Score (ECS)" value={submission.entityCoverageScore} />
          </CardContent>
           {submission.evaluationSummary && (
            <CardContent className="pt-0">
               <Alert className="mt-4">
                <BrainCircuit className="h-5 w-5" />
                <AlertTitle>AI Evaluation Summary</AlertTitle>
                <AlertDescription>
                  {submission.evaluationSummary}
                </AlertDescription>
              </Alert>
            </CardContent>
           )}
        </Card>
      )}

      {(submission.status === 'Failed' || submission.status === 'Completed' || submission.status === 'Processing') && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Execution Logs
            </CardTitle>
            <CardDescription>
              Standard output and error streams from the execution environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm max-h-96 overflow-y-auto whitespace-pre-wrap text-foreground/80">
              {submission.logs || mockLogs}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ScoreCard({ title, value }: { title: string; value?: number }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg text-center shadow">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold text-primary mt-1">
        {value !== undefined ? value.toFixed(3) : 'N/A'}
      </p>
    </div>
  );
}

