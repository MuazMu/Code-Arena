'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Global Leaderboard</h1>
        <Tabs value={period} onValueChange={(value: 'all' | 'monthly' | 'weekly') => setPeriod(value)}>
          <TabsList>
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div>Loading leaderboard...</div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry, index) => (
            <Card key={entry.userId} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {index < 3 ? (
                      getRankIcon(index + 1)
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{entry.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.solvedChallenges} challenges solved
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant="secondary">{entry.competitions} competitions</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
}