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
import { Competition } from '@/lib/types/competition';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompetitionTableProps {
  onEdit: (competition: Competition) => void;
}

export function CompetitionTable({ onEdit }: CompetitionTableProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      const response = await fetch('/api/admin/competitions');
      const data = await response.json();
      setCompetitions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch competitions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return;

    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Success',
        description: 'Competition deleted successfully',
      });
      fetchCompetitions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete competition',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading competitions...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {competitions.map((competition) => (
          <TableRow key={competition.id}>
            <TableCell className="font-medium">{competition.title}</TableCell>
            <TableCell>
              {new Date(competition.startTime).toLocaleString()}
            </TableCell>
            <TableCell>
              {new Date(competition.endTime).toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(competition.status)}>
                {competition.status}
              </Badge>
            </TableCell>
            <TableCell>
              {competition.participants.length}
              {competition.maxParticipants && 
                `/${competition.maxParticipants}`}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(competition)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(competition.id)}
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