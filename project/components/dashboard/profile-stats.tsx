'use client';

import { Card } from '@/components/ui/card';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileStats {
  totalSolved: number;
  ranking: number;
  points: number;
  streak: number;
}

export function ProfileStats() {
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/user/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch profile stats:', error);
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
    {
      icon: Award,
      label: 'Current Streak',
      value: `${stats.streak} days`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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