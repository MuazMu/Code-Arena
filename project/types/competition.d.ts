export interface Competition {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
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
  
  export interface CompetitionFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    maxParticipants: number;
    prizes: {
      first: string;
      second: string;
      third: string;
    };
  }