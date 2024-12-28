'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DifficultyLevel } from '@/lib/types/challenge';

interface ChallengeFiltersProps {
  selectedCategory: string;
  selectedDifficulty: DifficultyLevel | 'all';
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'algorithms', label: 'Algorithms' },
  { value: 'data-structures', label: 'Data Structures' },
  { value: 'dynamic-programming', label: 'Dynamic Programming' },
  { value: 'strings', label: 'Strings' },
  { value: 'arrays', label: 'Arrays' },
  { value: 'math', label: 'Mathematics' },
];

const difficulties = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function ChallengeFilters({
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
}: ChallengeFiltersProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <RadioGroup
            value={selectedCategory}
            onValueChange={onCategoryChange}
            className="space-y-2"
          >
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <RadioGroupItem value={category.value} id={`category-${category.value}`} />
                <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Difficulty</h3>
          <RadioGroup
            value={selectedDifficulty}
            onValueChange={onDifficultyChange}
            className="space-y-2"
          >
            {difficulties.map((difficulty) => (
              <div key={difficulty.value} className="flex items-center space-x-2">
                <RadioGroupItem value={difficulty.value} id={`difficulty-${difficulty.value}`} />
                <Label htmlFor={`difficulty-${difficulty.value}`}>{difficulty.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
}