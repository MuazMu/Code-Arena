export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
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
    _count?: {
      submissions: number;
    };
  }