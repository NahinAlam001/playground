
"use client";
import type { Submission } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileArchive, CalendarDays, CheckCircle2, XCircle, Loader2, BarChart3, Eye } from "lucide-react";

interface SubmissionListItemProps {
  submission: Submission;
}

export function SubmissionListItem({ submission }: SubmissionListItemProps) {
  const getStatusBadgeVariant = (status: Submission['status']) => {
    switch (status) {
      case 'Completed': return 'default'; // Will use primary color
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
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileArchive className="h-5 w-5 text-primary" />
              {submission.fileName}
            </CardTitle>
            <CardDescription className="text-xs">ID: {submission.id}</CardDescription>
          </div>
           <Badge variant={getStatusBadgeVariant(submission.status)} className="capitalize flex items-center gap-1.5 py-1 px-2.5">
            {getStatusIcon(submission.status)}
            {submission.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Submitted: {formatDate(submission.submittedAt)}</span>
        </div>
        
        {submission.status === 'Completed' && (
          <div className="grid grid-cols-3 gap-2 text-sm pt-2 border-t mt-2">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-foreground">{submission.bleu4Score?.toFixed(3) ?? 'N/A'}</span>
              <span className="text-xs text-muted-foreground">BLEU-4</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-foreground">{submission.customBleuScore?.toFixed(3) ?? 'N/A'}</span>
              <span className="text-xs text-muted-foreground">Custom BLEU</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-foreground">{submission.entityCoverageScore?.toFixed(3) ?? 'N/A'}</span>
              <span className="text-xs text-muted-foreground">ECS</span>
            </div>
          </div>
        )}
         {submission.status === 'Failed' && (
           <p className="text-sm text-destructive">Evaluation failed. Check logs for details.</p>
         )}
        <Button asChild variant="outline" size="sm" className="w-full mt-3">
          <Link href={`/submissions/${submission.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
