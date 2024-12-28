'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChallengeTable } from '@/components/admin/challenge-table';
import { ChallengeDialog } from '@/components/admin/challenge-dialog';
import { Plus } from 'lucide-react';
import { Challenge } from '@/lib/types/challenge';

export default function AdminChallenges() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Challenges</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Challenge
        </Button>
      </div>

      <ChallengeTable
        onEdit={(challenge) => {
          setEditingChallenge(challenge);
          setDialogOpen(true);
        }}
      />

      <ChallengeDialog
        open={dialogOpen}
        challenge={editingChallenge}
        onClose={() => {
          setDialogOpen(false);
          setEditingChallenge(null);
        }}
      />
    </div>
  );
}