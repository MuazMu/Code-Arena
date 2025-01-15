'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge, DifficultyLevel } from '@/lib/types/challenge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface ChallengeListProps {
  challenges: Challenge[];
  loading: boolean;
  category: string;
  difficulty: DifficultyLevel | 'all';
  status?: 'solved' | 'attempted' | 'bookmarked';
}


export function ChallengeList({ category, difficulty, status }: ChallengeListProps) {
   const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        if (difficulty !== 'all') params.append('difficulty', difficulty);
        if (status) params.append('status', status);

        const response = await fetch(`/api/challenges?${params}`);
        const data = await response.json();
        setChallenges(data.challenges);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [category, difficulty, status]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                <div className="flex gap-2">
                  <Badge>{challenge.category}</Badge>
                  <Badge variant={getDifficultyVariant(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline">{challenge.points} points</Badge>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function getDifficultyVariant(difficulty: DifficultyLevel) {
  switch (difficulty) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'destructive';
    default:
      return 'default';
  }
}