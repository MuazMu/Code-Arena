'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  BookMarked,
  Settings,
  History,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/challenges', label: 'My Challenges', icon: Code2 },
  { href: '/dashboard/competitions', label: 'My Competitions', icon: Trophy },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { href: '/dashboard/history', label: 'Submission History', icon: History },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-card border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}