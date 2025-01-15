'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CompetitionHeader } from '@/components/compete/competition-header';
import { CompetitionChallenges } from '@/components/compete/competition-challenges';
import { CompetitionLeaderboard } from '@/components/compete/competition-leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CompetitionPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const docRef = doc(db, 'competitions', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCompetition({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Failed to fetch competition:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCompetition();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!competition) return <div>Competition not found</div>;

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
          {/* Add CompetitionSubmissions component */}
        </TabsContent>
      </Tabs>
    </div>
  );
}