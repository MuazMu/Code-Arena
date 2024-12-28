import { Card } from '@/components/ui/card';
import { AdminStats } from '@/components/admin/admin-stats';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminStats />
    </div>
  );
}