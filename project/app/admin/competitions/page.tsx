'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CompetitionTable } from '@/components/admin/competition-table';
import { CompetitionDialog } from '@/components/admin/competition-dialog';
import { Plus } from 'lucide-react';
import { Competition } from '@/lib/types/competition';

export default function AdminCompetitions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Competitions</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Competition
        </Button>
      </div>

      <CompetitionTable
        onEdit={(competition) => {
          setEditingCompetition(competition);
          setDialogOpen(true);
        }}
      />

      <CompetitionDialog
        open={dialogOpen}
        competition={editingCompetition}
        onClose={() => {
          setDialogOpen(false);
          setEditingCompetition(null);
        }}
      />
    </div>
  );
}