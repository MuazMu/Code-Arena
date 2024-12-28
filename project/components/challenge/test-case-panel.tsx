'use client';

import { Card } from '@/components/ui/card';
import { TestCase } from '@/lib/types/challenge';
import { Check, X } from 'lucide-react';

interface TestCasePanelProps {
  testCases: TestCase[];
}

export function TestCasePanel({ testCases }: TestCasePanelProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="border-b last:border-b-0 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Test Case {index + 1}</h4>
              {testCase.passed !== undefined && (
                <div className="flex items-center gap-2">
                  {testCase.passed ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {!testCase.isHidden && (
              <>
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground mb-1">Input:</div>
                  <pre className="bg-muted p-2 rounded text-sm">{testCase.input}</pre>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Expected Output:</div>
                  <pre className="bg-muted p-2 rounded text-sm">{testCase.expectedOutput}</pre>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}