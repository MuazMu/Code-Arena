import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const [
      totalUsers,
      totalChallenges,
      totalCompetitions,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.challenge.count(),
      prisma.competition.count({
        where: {
          status: 'active',
        },
      }),
      prisma.user.count({
        where: {
          submissions: {
            some: {
              submittedAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalChallenges,
      totalCompetitions,
      activeUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}