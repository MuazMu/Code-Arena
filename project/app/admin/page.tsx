'use client';

import { useEffect, useState } from 'react';
import { getAdminAnalytics } from '@/lib/firebase/db';
import { AdminStats } from '@/components/admin/admin-stats';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminStats stats={analytics} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity component */}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          {/* Add system status component */}
        </Card>
      </div>
    </div>
  );
}