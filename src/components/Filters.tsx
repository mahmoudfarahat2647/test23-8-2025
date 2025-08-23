"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryType, TagType } from "@/types/promptbox";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  title: string;
  items: string[];
  activeItems: string[];
  onToggle: (item: string) => void;
  variant?: "category" | "tag";
}

function FilterSection({ 
  title, 
  items, 
  activeItems, 
  onToggle, 
  variant = "category" 
}: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = activeItems.includes(item);
          const isAll = item === "ALL";
          
          if (variant === "category") {
            return (
              <Button
                key={item}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onToggle(item)}
                className={cn(
                  "h-7 px-3 text-xs font-medium transition-all duration-200 hover:scale-105",
                  isAll && "font-semibold",
                  isActive ? "shadow-md ring-1 ring-primary/20" : "hover:border-primary/50"
                )}
              >
                {item}
              </Button>
            );
          }
          
          return (
            <Badge
              key={item}
              variant={isActive ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105 px-2 py-0.5 text-xs",
                isAll && "font-semibold",
                isActive ? "shadow-sm ring-1 ring-primary/20" : "hover:border-primary/50"
              )}
              onClick={() => onToggle(item)}
            >
              {item}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

interface FiltersProps {
  categories: CategoryType[];
  tags: TagType[];
  activeCategories: CategoryType[];
  activeTags: TagType[];
  onCategoryToggle: (category: CategoryType) => void;
  onTagToggle: (tag: TagType) => void;
}

export function Filters({
  categories,
  tags,
  activeCategories,
  activeTags,
  onCategoryToggle,
  onTagToggle,
}: FiltersProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 lg:p-6 space-y-6 mb-6 lg:mb-8 shadow-sm">
      <FilterSection
        title="Categories"
        items={categories}
        activeItems={activeCategories}
        onToggle={onCategoryToggle}
        variant="category"
      />
      
      <div className="h-px bg-border" />
      
      <FilterSection
        title="Tags"
        items={tags}
        activeItems={activeTags}
        onToggle={onTagToggle}
        variant="tag"
      />
    </div>
  );
}