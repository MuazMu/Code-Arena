'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  solvedChallenges: number;
  totalTime: number;
}

interface CompetitionLeaderboardProps {
  competitionId: string;
}

export function CompetitionLeaderboard({ competitionId }: CompetitionLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`/api/competitions/${competitionId}/leaderboard`);
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [competitionId]);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Solved</TableHead>
            <TableHead className="text-right">Total Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.userId}>
              <TableCell>
                {entry.rank <= 3 ? (
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${getRankColor(entry.rank)}`} />
                    {entry.rank}
                  </div>
                ) : (
                  entry.rank
                )}
              </TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">{entry.score}</Badge>
              </TableCell>
              <TableCell className="text-right">{entry.solvedChallenges}</TableCell>
              <TableCell className="text-right">{formatTime(entry.totalTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function getRankColor(rank: number) {
  switch (rank) {
    case 1:
      return 'text-yellow-500';
    case 2:
      return 'text-gray-400';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-muted-foreground';
  }
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}