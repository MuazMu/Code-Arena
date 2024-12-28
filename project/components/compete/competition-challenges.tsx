'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/lib/types/challenge';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';

interface CompetitionChallengesProps {
  competitionId: string;
}

export function CompetitionChallenges({ competitionId }: CompetitionChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch(`/api/competitions/${competitionId}/challenges`);
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [competitionId]);

  if (loading) {
    return <div>Loading challenges...</div>;
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <Link
          key={challenge.id}
          href={`/compete/${competitionId}/challenge/${challenge.id}`}
          className="block"
        >
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {challenge.title}
                  </h3>
                  {challenge.solved && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {challenge.locked && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {challenge.description}
                </p>
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

function getDifficultyVariant(difficulty: string) {
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