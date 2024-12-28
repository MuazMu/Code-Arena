export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  competitionId?: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error';
  runtime?: number;
  memory?: number;
  score: number;
  testCaseResults: {
    testCaseId: string;
    passed: boolean;
    runtime?: number;
    memory?: number;
    output?: string;
    error?: string;
  }[];
  submittedAt: Date;
}