"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function FloatingActionButton({ 
  onClick, 
  className, 
  disabled = false 
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-scale-in">
      {/* Pulse ring effect */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
      
      <Button
        onClick={onClick}
        disabled={disabled}
        size="default"
        className={cn(
          "relative h-12 w-12 rounded-full transition-all duration-500 hover-lift",
          "shadow-2xl hover:shadow-3xl active:shadow-lg",
          "hover:scale-110 active:scale-95",
          "bg-gradient-to-br from-primary via-primary to-primary/90",
          "hover:from-primary/90 hover:via-primary hover:to-primary",
          "text-primary-foreground border-2 border-background/30",
          "glass hover-glow",
          "focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
          "group overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          className
        )}
        title="Create new prompt"
        aria-label="Create new prompt"
      >
        <Plus className="h-5 w-5 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110 drop-shadow-sm" />
        
        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-150" />
        
        {/* Sparkle effect */}
        <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.7s' }} />
      </Button>
    </div>
  );
}