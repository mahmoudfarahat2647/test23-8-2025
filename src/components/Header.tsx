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
      {/* Background gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-subtle opacity-60 pointer-events-none" />
      
      <div className="relative">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          {/* Title section with enhanced typography */}
          <div className="space-y-2 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gradient-primary bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {config.title}
              </h1>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>
            <p className="text-sm lg:text-base text-muted-foreground max-w-lg leading-relaxed font-medium">
              Discover, organize, and manage your AI prompts with ease
            </p>
          </div>
          
          {/* Enhanced search and actions section */}
          <div className="flex items-center gap-2 w-full lg:w-auto animate-slide-up">
            <div className="relative flex-1 lg:w-64 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                <Input
                  type="text"
                  placeholder={config.search.placeholder + " prompts..."}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 h-10 text-sm glass border-border/30 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
            
            <ThemeToggle className="h-10 w-10 shrink-0 glass border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 hover-lift" />
            
            {config.search.profileIcon && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 shrink-0 glass border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 hover-lift group"
              >
                <User className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                <span className="sr-only">User profile</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-float opacity-30" />
        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-primary/5 rounded-full blur-xl animate-float opacity-40" style={{ animationDelay: '2s' }} />
      </div>
    </header>
  );
}