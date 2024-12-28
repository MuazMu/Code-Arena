'use client';

import { useState } from 'react';
import { CompetitionList } from '@/components/compete/competition-list';
import { CompetitionFilters } from '@/components/compete/competition-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CompetePage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Competitions</h1>
        {session?.user && (
          <Button asChild>
            <Link href="/compete/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Competition
            </Link>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <CompetitionFilters
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <div className="md:col-span-9">
          <CompetitionList filter={filter} />
        </div>
      </div>
    </div>
  );
}