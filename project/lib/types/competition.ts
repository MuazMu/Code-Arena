export interface Competition {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  challenges: string[];
  participants: string[];
  createdBy: string;
  status: 'upcoming' | 'active' | 'ended';
  maxParticipants?: number;
  prizes?: {
    first: string;
    second?: string;
    third?: string;
  };
}