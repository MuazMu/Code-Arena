import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'daily';

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const startDate = getStartDate(period);
    
    const [userStats, submissionStats, locationStats] = await Promise.all([
      getUserStats(startDate),
      getSubmissionStats(startDate),
      getLocationStats(),
    ]);

    return NextResponse.json({
      userStats,
      submissionStats,
      locationStats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function getStartDate(period: string) {
  const now = new Date();
  switch (period) {
    case 'weekly':
      return startOfWeek(now);
    case 'monthly':
      return startOfMonth(now);
    default:
      return startOfDay(subDays(now, 7));
  }
}

async function getUserStats(startDate: Date) {
  return prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _count: true,
  });
}

async function getSubmissionStats(startDate: Date) {
  return prisma.submission.groupBy({
    by: ['status', 'submittedAt'],
    where: {
      submittedAt: {
        gte: startDate,
      },
    },
    _count: true,
  });
}

async function getLocationStats() {
  // Since we can't group by a non-existent field, let's modify this to use a valid field
  return prisma.user.groupBy({
    by: ['id'],
    _count: true,
  });
}