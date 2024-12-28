'use client';

import { Card } from '@/components/ui/card';
import { Trophy, Star, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserStats {
  totalSolved: number;
  ranking: number;
  points: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/user/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    }

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  const statItems = [
    {
      icon: Trophy,
      label: 'Problems Solved',
      value: stats.totalSolved,
    },
    {
      icon: Target,
      label: 'Global Ranking',
      value: `#${stats.ranking}`,
    },
    {
      icon: Star,
      label: 'Total Points',
      value: stats.points,
    },
  ];

  return (
    <div className="grid gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}