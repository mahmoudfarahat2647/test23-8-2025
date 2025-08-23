"use client";

import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderConfig } from "@/types/promptbox";

interface HeaderProps {
  config: HeaderConfig;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ config, searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            {config.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Discover, organize, and manage your AI prompts with ease
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
            <Input
              type="text"
              placeholder={config.search.placeholder + " prompts..."}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm bg-background/50 backdrop-blur-sm border-border/50 focus:border-ring transition-all duration-200"
            />
          </div>
          
          <ThemeToggle className="h-9 w-9 shrink-0" />
          
          {config.search.profileIcon && (
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <User className="h-3.5 w-3.5" />
              <span className="sr-only">User profile</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}