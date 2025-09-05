'use client';

import { Copy, Edit, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PromptCard as PromptCardType } from '@/types/promptbox';

interface PromptCardProps {
  card: PromptCardType;
  onEdit?: (card: PromptCardType) => void;
  onDelete?: (card: PromptCardType) => void;
  onShare?: (card: PromptCardType) => void;
  onCopy?: (card: PromptCardType) => void;
}

function StarRating({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => (
          <Star
            key={`rating-star-${index + 1}`}
            className={cn(
              'h-3 w-3 transition-all duration-300',
              index < rating
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm scale-110'
                : 'text-muted-foreground/20 hover:text-muted-foreground/40',
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-semibold tracking-wide">
        {rating}/{maxRating}
      </span>
    </div>
  );
}

export function PromptCard({
  card,
  onEdit,
  onDelete,
  onShare,
  onCopy,
}: PromptCardProps) {
  const hasContent = card.title || card.description;

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-border/20 glass-card hover-lift animate-fade-in bg-card/90 backdrop-blur-md hover:border-primary/30 hover:shadow-primary/10 dark:border-gradient-gray">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-card opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-50 transition-all duration-500 blur-sm" />
      
      {/* Dark theme gradient border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-600/30 via-gray-500/20 to-gray-700/30 dark:opacity-100 opacity-0 pointer-events-none" />
      <div className="absolute inset-[1px] rounded-lg bg-card/95 backdrop-blur-md" />

      {/* Floating decoration */}
      <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-float" />

      <div className="relative z-20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 space-y-1">
              <CardTitle className="text-sm font-bold text-foreground line-clamp-2 mb-0 leading-tight group-hover:text-primary transition-colors duration-300">
                {card.title || 'Untitled Prompt'}
              </CardTitle>
              {card.rating > 0 && (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <StarRating rating={card.rating} />
                </div>
              )}
            </div>

            {/* Enhanced action buttons */}
            <div className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
              {card.actions.edit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-200 hover-glow"
                  onClick={() => onEdit?.(card)}
                  title="Edit prompt"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {card.actions.copy && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50 hover:scale-110 transition-all duration-200 hover-glow"
                  onClick={() => onCopy?.(card)}
                  title="Copy prompt"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
              {card.actions.delete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all duration-200 hover-glow"
                  onClick={() => onDelete?.(card)}
                  title="Delete prompt"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {(card.description || !hasContent) && (
          <CardContent className="pb-2">
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
              {card.description || 'No description available'}
            </p>
          </CardContent>
        )}

        {(card.categories.length > 0 || card.tags.length > 0) && (
          <CardFooter className="pt-0 pb-3 flex-col items-start gap-2">
            {card.categories.length > 0 && (
              <div className="w-full space-y-1">
                <div className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">
                  Categories
                </div>
                <div className="flex flex-wrap gap-1">
                  {card.categories.map((category) => {
                    // Create unique key by combining category with card title hash
                    const uniqueKey = `category-${category}-${card.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}`;
                    return (
                      <Badge
                        key={uniqueKey}
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 font-semibold hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border-blue-300/40 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/60 shadow-sm"
                      >
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {card.tags.length > 0 && (
              <div className="w-full space-y-1">
                <div className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => {
                    // Create unique key by combining tag with card title hash
                    const uniqueKey = `tag-${tag}-${card.title?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}`;
                    return (
                      <Badge
                        key={uniqueKey}
                        variant="outline"
                        className="text-xs px-1.5 py-0.5 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-cyan-400/10 to-teal-500/10 border-cyan-400/40 text-cyan-600 dark:text-cyan-400 hover:from-cyan-400/20 hover:to-teal-500/20 hover:border-cyan-500/60 hover:text-cyan-700 dark:hover:text-cyan-300 shadow-sm"
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
