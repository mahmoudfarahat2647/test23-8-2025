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
    <Button
      onClick={onClick}
      disabled={disabled}
      size="default"
      className={cn(
        "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full transition-all duration-300",
        "shadow-lg hover:shadow-xl active:shadow-md",
        "hover:scale-105 active:scale-95",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "border-2 border-background/20 backdrop-blur-sm",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "group overflow-hidden",
        className
      )}
      title="Create new prompt"
      aria-label="Create new prompt"
    >
      <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
}