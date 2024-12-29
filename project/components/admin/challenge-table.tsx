'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/lib/types/challenge';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface ChallengeWithCount extends Challenge {
  _count?: {
    submissions: number;
  };
}


interface ChallengeTableProps {
  onEdit: (challenge: Challenge) => void;
}

export function ChallengeTable({ onEdit }: ChallengeTableProps) {
  const [challenges, setChallenges] = useState<ChallengeWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const response = await fetch('/api/admin/challenges');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch challenges',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Success',
        description: 'Challenge deleted successfully',
      });
      fetchChallenges();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete challenge',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading challenges...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Submissions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.map((challenge) => (
          <TableRow key={challenge.id}>
            <TableCell className="font-medium">{challenge.title}</TableCell>
            <TableCell>{challenge.category}</TableCell>
            <TableCell>
              <Badge variant={getDifficultyVariant(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </TableCell>
            <TableCell>{challenge.points}</TableCell>
            <TableCell>{challenge._count?.submissions || 0}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(challenge)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(challenge.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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