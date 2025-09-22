'use client';

import { Copy, Edit, Pin, Star, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PromptCard as PromptCardType } from '@/types/promptbox';

interface PromptCardProps {
  card: PromptCardType;
  onEdit?: (card: PromptCardType) => void;
  onDelete?: (card: PromptCardType) => void;
  onCopy?: (card: PromptCardType) => void;
  onPin?: (card: PromptCardType) => void;
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

const PromptCardComponent = memo(function PromptCard({
  card,
  onEdit,
  onDelete,
  onCopy,
  onPin,
}: PromptCardProps) {
  const hasContent = card.title || card.description;

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-border/20 glass-card hover-lift animate-fade-in bg-card/90 backdrop-blur-md hover:border-primary/30 hover:shadow-primary/10 dark:border-gradient-gray"
      )}
    >
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
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 hover:scale-110 transition-all duration-200 hover-glow",
                  card.pinned 
                    ? "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 fill-purple-600" 
                    : "text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                )}
                onClick={() => onPin?.(card)}
                title={card.pinned ? "Unpin prompt" : "Pin prompt"}
              >
                <Pin className={cn("h-3 w-3", card.pinned && "fill-current")} />
              </Button>
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
          <CardContent className="pb-3">
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
              {card.description || 'No description available'}
            </p>
          </CardContent>
        )}
      </div>
    </Card>
  );
});

export { PromptCardComponent as PromptCard };