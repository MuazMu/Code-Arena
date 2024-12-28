'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeList } from '@/components/prepare/challenge-list';
import { ChallengeFilters } from '@/components/prepare/challenge-filters';
import { DifficultyLevel } from '@/lib/types/challenge';

export default function PreparePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Practice Coding Challenges</h1>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <ChallengeFilters
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            onCategoryChange={setSelectedCategory}
            onDifficultyChange={setSelectedDifficulty}
          />
        </div>

        <div className="md:col-span-9">
          <Tabs defaultValue="challenges">
            <TabsList className="mb-8">
              <TabsTrigger value="challenges">All Challenges</TabsTrigger>
              <TabsTrigger value="solved">Solved</TabsTrigger>
              <TabsTrigger value="attempted">Attempted</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges">
              <ChallengeList
                category={selectedCategory}
                difficulty={selectedDifficulty}
              />
            </TabsContent>

            <TabsContent value="solved">
              <ChallengeList
                category={selectedCategory}
                difficulty={selectedDifficulty}
                status="solved"
              />
            </TabsContent>

            <TabsContent value="attempted">
              <ChallengeList
                category={selectedCategory}
                difficulty={selectedDifficulty}
                status="attempted"
              />
            </TabsContent>

            <TabsContent value="bookmarked">
              <ChallengeList
                category={selectedCategory}
                difficulty={selectedDifficulty}
                status="bookmarked"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}