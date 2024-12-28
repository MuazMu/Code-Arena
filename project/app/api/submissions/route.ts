import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { executeCode } from '@/lib/code-execution';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { challengeId, code, language } = await req.json();

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

    // Create initial submission
    const submission = await prisma.submission.create({
      data: {
        challengeId,
        userId: session.user.id,
        code,
        language,
        status: 'pending',
        score: 0,
        testCaseResults: [], // Initialize with empty array
      }
    });

    // Execute code against test cases
    const results = await executeCode({
      code,
      language,
      testCases: challenge.testCases,
      timeLimit: challenge.timeLimit,
      memoryLimit: challenge.memoryLimit,
    });

    // Update submission with results
    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: results.status,
        score: results.score,
        runtime: results.runtime,
        memory: results.memory,
        testCaseResults: results.testCaseResults,
      }
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}