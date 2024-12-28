'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CompetitionHeader } from '@/components/compete/competition-header';
import { CompetitionChallenges } from '@/components/compete/competition-challenges';
import { CompetitionLeaderboard } from '@/components/compete/competition-leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Competition } from '@/lib/types/competition';
import { useToast } from '@/hooks/use-toast';

export default function CompetitionPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const response = await fetch(`/api/competitions/${id}`);
        const data = await response.json();
        setCompetition(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch competition details',
          variant: 'destructive',
        });
      }
    }

    if (id) {
      fetchCompetition();
    }
  }, [id, toast]);

  if (!competition) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CompetitionHeader competition={competition} />

      <Tabs defaultValue="challenges" className="mt-8">
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <CompetitionChallenges competitionId={competition.id} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <CompetitionLeaderboard competitionId={competition.id} />
        </TabsContent>

        <TabsContent value="submissions">
          <CompetitionSubmissions competitionId={competition.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}