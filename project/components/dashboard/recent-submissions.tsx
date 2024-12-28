'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Submission } from '@/lib/types/submission';
import Link from 'next/link';

export function RecentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch('/api/submissions/recent');
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            href={`/challenge/${submission.challengeId}`}
            className="block"
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{submission.challenge?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusVariant(submission.status)}>
                    {formatStatus(submission.status)}
                  </Badge>
                  <span className="text-sm font-medium">
                    {submission.score}/100
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'accepted':
      return 'success';
    case 'wrong_answer':
      return 'destructive';
    case 'time_limit_exceeded':
    case 'memory_limit_exceeded':
      return 'warning';
    default:
      return 'secondary';
  }
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}