export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  passed?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  points: number;
  category: string;
  testCases: TestCase[];
  sampleInput: string;
  sampleOutput: string;
  timeLimit: number;
  memoryLimit: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  solved?: boolean;
  locked?: boolean;
}