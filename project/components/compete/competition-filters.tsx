'use client';

import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CompetitionFiltersProps {
  currentFilter: 'all' | 'upcoming' | 'active' | 'past';
  onFilterChange: (filter: 'all' | 'upcoming' | 'active' | 'past') => void;
}

export function CompetitionFilters({ currentFilter, onFilterChange }: CompetitionFiltersProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Filter Competitions</h3>
      <RadioGroup value={currentFilter} onValueChange={onFilterChange}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Competitions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upcoming" id="upcoming" />
            <Label htmlFor="upcoming">Upcoming</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="past" id="past" />
            <Label htmlFor="past">Past</Label>
          </div>
        </div>
      </RadioGroup>
    </Card>
  );
}