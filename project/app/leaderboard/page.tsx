'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardPeriod } from './types';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  solvedChallenges: number;
  competitions: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`/api/leaderboard?period=${period}`);
        const data = await response.json();
        setEntries(data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as LeaderboardPeriod);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Global Leaderboard</h1>

      <Tabs value={period} onValueChange={handlePeriodChange}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value={period}>
          {loading ? (
            <div>Loading leaderboard...</div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.userId} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-full ${getRankColor(entry.rank)}`}>
                        {entry.rank <= 3 ? (
                          <Trophy className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{entry.rank}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{entry.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Solved: {entry.solvedChallenges} | Competitions: {entry.competitions}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-lg">
                        {entry.points} points
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 dark:bg-yellow-900';
    case 2:
      return 'bg-gray-100 dark:bg-gray-800';
    case 3:
      return 'bg-amber-100 dark:bg-amber-900';
    default:
      return 'bg-muted';
  }
}