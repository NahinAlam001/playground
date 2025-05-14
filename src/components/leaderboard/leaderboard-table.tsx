
"use client";
import { useState, useMemo } from "react";
import type { LeaderboardEntry } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

type SortKey = keyof Pick<LeaderboardEntry, 'rank' | 'bleu4Score' | 'customBleuScore' | 'entityCoverageScore' | 'lastSubmissionDate' | 'totalSubmissions'> | 'userName';
type SortDirection = 'asc' | 'desc';

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      let valA = a[sortKey as keyof LeaderboardEntry];
      let valB = b[sortKey as keyof LeaderboardEntry];

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [entries, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc'); // Default to desc for scores, asc for rank/name
      if (key === 'rank' || key === 'userName') setSortDirection('asc');
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m18 15-6-6-6 6"/></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (entries.length === 0) {
    return <p className="text-center text-muted-foreground py-8">The leaderboard is currently empty. Be the first to submit!</p>;
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {([
              { key: 'rank', label: 'Rank' },
              { key: 'userName', label: 'User' },
              { key: 'bleu4Score', label: 'BLEU-4' },
              { key: 'customBleuScore', label: 'Custom BLEU' },
              { key: 'entityCoverageScore', label: 'ECS' },
              { key: 'totalSubmissions', label: 'Submissions' },
              { key: 'lastSubmissionDate', label: 'Last Active' },
            ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
              <TableHead key={key} className={key === 'userName' ? 'w-[200px]' : ''}>
                <Button variant="ghost" onClick={() => handleSort(key)} className="px-1 hover:bg-accent/50">
                  {label}
                  {renderSortIcon(key)}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.userId} className="hover:bg-muted/30">
              <TableCell className="font-medium text-center">{entry.rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                   <Avatar className="h-8 w-8 border">
                     <AvatarImage src={`https://placehold.co/40x40.png?text=${entry.userName[0].toUpperCase()}`} alt={entry.userName} data-ai-hint="avatar placeholder" />
                     <AvatarFallback>{entry.userName[0].toUpperCase()}</AvatarFallback>
                   </Avatar>
                  <span className="font-medium truncate">{entry.userName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{entry.bleu4Score.toFixed(3)}</TableCell>
              <TableCell className="text-right">{entry.customBleuScore.toFixed(3)}</TableCell>
              <TableCell className="text-right">{entry.entityCoverageScore.toFixed(3)}</TableCell>
              <TableCell className="text-center">{entry.totalSubmissions}</TableCell>
              <TableCell className="text-right">{formatDate(entry.lastSubmissionDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
