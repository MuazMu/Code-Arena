'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Competition } from '@/lib/types/competition';
import Link from 'next/link';
import { Calendar, Clock, Users } from 'lucide-react';

export function UpcomingCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await fetch('/api/competitions/upcoming');
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('Failed to fetch competitions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  if (loading) {
    return <div>Loading competitions...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upcoming Competitions</h2>
        <Button asChild>
          <Link href="/compete">View All</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <Card key={competition.id} className="p-6">
            <h3 className="text-lg font-semibold mb-4">{competition.title}</h3>
            <p className="text-muted-foreground mb-6 line-clamp-2">
              {competition.description}
            </p>

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(competition.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(competition.startTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {competition.participants.length}
                  {competition.maxParticipants && 
                    `/${competition.maxParticipants}`} participants
                </span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/compete/${competition.id}`}>
                Register Now
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}