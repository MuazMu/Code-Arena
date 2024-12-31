'use client';

import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/lib/types/challenge';

interface CodeEditorProps {
  challenge: Challenge;
  onSubmit: (results: any) => void;
}

export function CodeEditor({ challenge, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(challenge.starterCode || '');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/challenges/${challenge.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) throw new Error('Submission failed');

      const results = await response.json();
      onSubmit(results);

      toast({
        title: results.status === 'accepted' ? 'Success!' : 'Almost there!',
        description: results.status === 'accepted' 
          ? 'All test cases passed' 
          : 'Some test cases failed',
        variant: results.status === 'accepted' ? 'default' : 'warning',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit solution',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={language}
          onValueChange={setLanguage}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Running...' : 'Submit Solution'}
        </Button>
      </div>

      <Editor
        height="600px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          rulers: [80],
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}