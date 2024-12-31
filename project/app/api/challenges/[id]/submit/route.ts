import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { executeCode } from '@/lib/code-execution';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { code, language } = await req.json();
    const challengeId = params.id;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { testCases: true }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Execute code against test cases
    const results = await executeCode({
      code,
      language,
      testCases: challenge.testCases,
      timeLimit: challenge.timeLimit,
      memoryLimit: challenge.memoryLimit,
    });

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        challengeId,
        code,
        language,
        status: results.status,
        runtime: results.runtime,
        memory: results.memory,
        score: results.score,
        testCaseResults: results.testCaseResults,
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}