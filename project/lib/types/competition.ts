export interface Competition {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  challenges: string[]; // Challenge IDs
  participants: string[]; // User IDs
  createdBy: string;
  status: 'upcoming' | 'active' | 'ended';
  maxParticipants?: number;
  prizes?: {
    first: string;
    second?: string;
    third?: string;
  };
}