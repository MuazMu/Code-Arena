'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/lib/types/challenge';
import { Clock, HardDrive } from 'lucide-react';

interface ChallengeDetailsProps {
  challenge: Challenge;
}

export function ChallengeDetails({ challenge }: ChallengeDetailsProps) {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
      
      <div className="flex gap-2 mb-4">
        <Badge>{challenge.category}</Badge>
        <Badge variant={getDifficultyVariant(challenge.difficulty)}>
          {challenge.difficulty}
        </Badge>
        <Badge variant="outline">{challenge.points} points</Badge>
      </div>
      
      <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {challenge.timeLimit}ms
        </div>
        <div className="flex items-center gap-1">
        <HardDrive className="w-4 h-4" />
          {challenge.memoryLimit}MB
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: challenge.description }} />
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Sample Input</h3>
        <pre className="bg-muted p-4 rounded-lg">{challenge.sampleInput}</pre>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Sample Output</h3>
        <pre className="bg-muted p-4 rounded-lg">{challenge.sampleOutput}</pre>
      </div>
    </Card>
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