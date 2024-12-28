'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeDetails } from '@/components/challenge/challenge-details';
import { TestCasePanel } from '@/components/challenge/test-case-panel';
import { OutputPanel } from '@/components/challenge/output-panel';
import { Challenge } from '@/lib/types/challenge';
import { useToast } from '@/hooks/use-toast';

export default function ChallengePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const response = await fetch(`/api/challenges/${id}`);
        const data = await response.json();
        setChallenge(data);
        setCode(data.starterCode || '');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch challenge details',
          variant: 'destructive',
        });
      }
    }
    
    if (id) {
      fetchChallenge();
    }
  }, [id, toast]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: id,
          code,
          language,
        }),
      });
      
      const result = await response.json();
      setOutput(JSON.stringify(result, null, 2));
      
      if (result.status === 'accepted') {
        toast({
          title: 'Success!',
          description: 'All test cases passed',
        });
      } else {
        toast({
          title: 'Almost there!',
          description: 'Some test cases failed',
          variant: 'warning',
        });
      }
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

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <ChallengeDetails challenge={challenge} />
        </div>
        
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded p-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Running...' : 'Submit Solution'}
              </Button>
            </div>
            
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </Card>

          <Tabs defaultValue="output">
            <TabsList>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output">
              <OutputPanel output={output} />
            </TabsContent>
            
            <TabsContent value="testcases">
              <TestCasePanel testCases={challenge.testCases} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}