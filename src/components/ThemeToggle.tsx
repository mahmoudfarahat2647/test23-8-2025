"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export function ThemeToggle({ className, size = "icon" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:bg-accent hover:text-accent-foreground",
          "border-border/50 bg-background/50 backdrop-blur-sm",
          className
        )}
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "hover:bg-accent hover:text-accent-foreground",
        "border-border/50 bg-background/50 backdrop-blur-sm",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "group",
        className
      )}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative">
        <Sun 
          className={cn(
            "h-4 w-4 transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Subtle glow effect on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
        "from-primary/10 to-transparent opacity-0 group-hover:opacity-100"
      )} />
    </Button>
  );
}