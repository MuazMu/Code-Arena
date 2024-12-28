'use client';

import { Competition } from '@/lib/types/competition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CompetitionHeaderProps {
  competition: Competition;
}

export function CompetitionHeader({ competition }: CompetitionHeaderProps) {
  const { data: session } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to register for competitions',
        variant: 'destructive',
      });
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/competitions/${competition.id}/register`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Success',
        description: 'Successfully registered for the competition',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register for the competition',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{competition.title}</h1>
            <Badge variant={getStatusVariant(competition.status)}>
              {formatStatus(competition.status)}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">{competition.description}</p>
        </div>

        {competition.status === 'upcoming' && (
          <Button onClick={handleRegister} disabled={isRegistering}>
            {isRegistering ? 'Registering...' : 'Register Now'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Start Time</p>
            <p className="font-medium">
              {new Date(competition.startTime).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{competition.duration} hours</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-medium">
              {competition.participants.length}
              {competition.maxParticipants && 
                `/${competition.maxParticipants}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prize Pool</p>
            <p className="font-medium">{formatPrizes(competition.prizes)}</p>
          </div>
        </div>
      </div>
    </Card>
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

function formatPrizes(prizes: any) {
  if (!prizes) return 'No prizes';
  return `${prizes.first} (1st) ${prizes.second ? `/ ${prizes.second} (2nd)` : ''} ${prizes.third ? `/ ${prizes.third} (3rd)` : ''}`;
}