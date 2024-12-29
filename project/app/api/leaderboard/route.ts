import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfWeek, startOfMonth } from 'date-fns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'all';

  try {
    const dateFilter = getDateFilter(period);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        points: true,
        _count: {
          select: {
            submissions: {
              where: {
                status: 'accepted',
                ...dateFilter,
              },
            },
            participatingCompetitions: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
      take: 100,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      points: user.points,
      solvedChallenges: user._count.submissions,
      competitions: user._count.participatingCompetitions,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

function getDateFilter(period: string) {
  switch (period) {
    case 'weekly':
      return {
        submittedAt: {
          gte: startOfWeek(new Date()),
        },
      };
    case 'monthly':
      return {
        submittedAt: {
          gte: startOfMonth(new Date()),
        },
      };
    default:
      return {};
  }
}