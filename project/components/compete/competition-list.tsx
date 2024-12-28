'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Competition } from '@/lib/types/competition';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface CompetitionListProps {
  filter: 'all' | 'upcoming' | 'active' | 'past';
}

export function CompetitionList({ filter }: CompetitionListProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await fetch(`/api/competitions?status=${filter}`);
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('Failed to fetch competitions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, [filter]);

  if (loading) {
    return <div>Loading competitions...</div>;
  }

  return (
    <div className="grid gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{competition.title}</h3>
                <Badge variant={getStatusVariant(competition.status)}>
                  {formatStatus(competition.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{competition.description}</p>
            </div>
            <Button asChild>
              <Link href={`/compete/${competition.id}`}>
                {competition.status === 'upcoming' ? 'Register' : 'View Details'}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Starts {formatDistanceToNow(new Date(competition.startTime))}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{competition.duration} hours</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{competition.participants.length} participants</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span>{competition.challenges.length} challenges</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'upcoming':
      return 'default';
    case 'active':
      return 'success';
    case 'ended':
      return 'secondary';
    default:
      return 'default';
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}