'use client';

import { useEffect, useState } from 'react';
import { getPracticeQuestions } from '@/lib/firebase/db';
import { ChallengeList } from '@/components/prepare/challenge-list';
import { ChallengeFilters } from '@/components/prepare/challenge-filters';
import { DifficultyLevel } from '@/lib/types/challenge';

// Define the Challenge type
interface Challenge {
  id: string;
  category: string;
  difficulty: DifficultyLevel;
  // Add other properties as needed
}

export default function PreparePage() {
  // Explicitly type the challenges state
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const data = await getPracticeQuestions();
        setChallenges(data as Challenge[]); // Cast data to Challenge[]
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  // Filter challenges based on selected category and difficulty
  const filteredChallenges = challenges.filter(challenge => {
    if (selectedCategory !== 'all' && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && challenge.difficulty !== selectedDifficulty) return false;
    return true;
  });

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
          <ChallengeList 
            challenges={filteredChallenges} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
}