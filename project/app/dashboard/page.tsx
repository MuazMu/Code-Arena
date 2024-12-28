'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentSubmissions } from '@/components/dashboard/recent-submissions';
import { UpcomingCompetitions } from '@/components/dashboard/upcoming-competitions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats />
        
        <Card className="col-span-2">
          <RecentSubmissions />
        </Card>
      </div>

      <div className="mt-8">
        <UpcomingCompetitions />
      </div>
    </div>
  );
}