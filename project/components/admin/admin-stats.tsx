'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Code2, Trophy, Activity } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalChallenges: number;
  totalCompetitions: number;
  activeUsers: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div>Loading stats...</div>;
  }

  const statItems = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12% from last month',
    },
    {
      icon: Code2,
      label: 'Total Challenges',
      value: stats.totalChallenges,
      change: '+5 this week',
    },
    {
      icon: Trophy,
      label: 'Active Competitions',
      value: stats.totalCompetitions,
      change: '2 ending soon',
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: stats.activeUsers,
      change: 'Last 24 hours',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.change}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}