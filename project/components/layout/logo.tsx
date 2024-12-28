import { Code2 } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative">
        <Code2 className="w-8 h-8 text-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      </div>
      <span className="text-xl font-bold">Code Arena</span>
    </Link>
  );
}