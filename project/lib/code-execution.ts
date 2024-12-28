import axios from 'axios';
import { TestCase } from './types/challenge';

const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL || 'http://localhost:3001';

interface ExecuteCodeParams {
  code: string;
  language: string;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
}

interface ExecutionResult {
  status: string;
  output?: string;
  error?: string;
  runtime?: number;
  memory?: number;
}

export async function executeCode({
  code,
  language,
  testCases,
  timeLimit,
  memoryLimit,
}: ExecuteCodeParams) {
  const results = [];
  let totalScore = 0;
  let maxRuntime = 0;
  let maxMemory = 0;

  for (const testCase of testCases) {
    try {
      const response = await axios.post<ExecutionResult>(`${CODE_RUNNER_URL}/execute`, {
        code,
        language,
        input: testCase.input,
      });

      const result = response.data;
      const passed = result.output?.trim() === testCase.expectedOutput.trim();

      if (passed) {
        totalScore += 1;
      }

      if (result.runtime) {
        maxRuntime = Math.max(maxRuntime, result.runtime);
      }

      if (result.memory) {
        maxMemory = Math.max(maxMemory, result.memory);
      }

      results.push({
        testCaseId: testCase.id,
        passed,
        runtime: result.runtime,
        memory: result.memory,
        output: testCase.isHidden ? undefined : result.output,
        error: result.error,
      });
    } catch (error) {
      results.push({
        testCaseId: testCase.id,
        passed: false,
        error: 'Execution failed',
      });
    }
  }

  const score = Math.round((totalScore / testCases.length) * 100);

  return {
    status: score === 100 ? 'accepted' : 'wrong_answer',
    score,
    runtime: maxRuntime,
    memory: maxMemory,
    testCaseResults: results,
  };
}