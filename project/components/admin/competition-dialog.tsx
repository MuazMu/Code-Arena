'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Competition } from '@/lib/types/competition';
import { useToast } from '@/hooks/use-toast';
import { CompetitionFormData } from '@/types/competition';

interface CompetitionDialogProps {
  open: boolean;
  competition?: Competition | null;
  onClose: () => void;
}

const defaultFormData: CompetitionFormData = {
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  maxParticipants: 0,
  prizes: {
    first: '',
    second: '',
    third: '',
  },
};

export function CompetitionDialog({ open, competition, onClose }: CompetitionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<CompetitionFormData>(() => {
    if (!competition) return defaultFormData;
    
    return {
      title: competition.title,
      description: competition.description,
      startTime: new Date(competition.startTime).toISOString().slice(0, 16),
      endTime: new Date(competition.endTime).toISOString().slice(0, 16),
      maxParticipants: competition.maxParticipants || 0,
      prizes: {
        first: competition.prizes?.first || '',
        second: competition.prizes?.second || '',
        third: competition.prizes?.third || '',
      },
    };
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = competition 
        ? `/api/competitions/${competition.id}`
        : '/api/competitions';
      
      const response = await fetch(url, {
        method: competition ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Success',
        description: `Competition ${competition ? 'updated' : 'created'} successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${competition ? 'update' : 'create'} competition`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {competition ? 'Edit Competition' : 'Create New Competition'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Prizes</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstPrize">First Prize</Label>
                <Input
                  id="firstPrize"
                  value={formData.prizes.first}
                  onChange={(e) => setFormData({
                    ...formData,
                    prizes: { ...formData.prizes, first: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondPrize">Second Prize</Label>
                <Input
                  id="secondPrize"
                  value={formData.prizes.second}
                  onChange={(e) => setFormData({
                    ...formData,
                    prizes: { ...formData.prizes, second: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thirdPrize">Third Prize</Label>
                <Input
                  id="thirdPrize"
                  value={formData.prizes.third}
                  onChange={(e) => setFormData({
                    ...formData,
                    prizes: { ...formData.prizes, third: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : competition ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}