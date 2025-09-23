'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { HeaderConfig } from '@/types/promptbox';

interface HeaderProps {
  config: HeaderConfig;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function Header({
  config,
  searchValue,
  onSearchChange,
  filteredCount,
  totalCount,
}: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title and Stats */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-[#d97757]/30 bg-clip-text text-transparent">
          {config.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showing {filteredCount} of {totalCount} prompts
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={config.search.placeholder}
            className="pl-10 pr-4 py-2 bg-background/50 border-border/50 focus:border-primary/50 backdrop-blur-sm"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Clear Data Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/clear-data')}
          className="hidden sm:flex items-center gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear Data
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}