'use client';

import { Card } from '@/components/ui/card';

interface OutputPanelProps {
  output: string;
}

export function OutputPanel({ output }: OutputPanelProps) {
  return (
    <Card className="p-4">
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {output || 'No output yet. Run your code to see the results.'}
      </pre>
    </Card>
  );
}