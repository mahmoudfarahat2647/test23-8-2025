'use client';

import { Copy, Edit, Share2, Star, Trash2 } from 'lucide-react';
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
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-border/30 glass-card hover-lift animate-fade-in">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-card opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Floating decoration */}
      <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-float" />

      <div className="relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <CardTitle className="text-base font-bold text-foreground line-clamp-2 mb-0 leading-tight group-hover:text-primary transition-colors duration-300">
                {card.title || 'Untitled Prompt'}
              </CardTitle>
              {card.rating > 0 && (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <StarRating rating={card.rating} />
                </div>
              )}
            </div>

            {/* Enhanced action buttons */}
            <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
              {card.actions.edit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-200 hover-glow"
                  onClick={() => onEdit?.(card)}
                  title="Edit prompt"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {card.actions.share && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 hover:scale-110 transition-all duration-200 hover-glow"
                  onClick={() => onShare?.(card)}
                  title="Share prompt"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              )}
              {card.actions.copy && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50 hover:scale-110 transition-all duration-200 hover-glow"
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
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all duration-200 hover-glow"
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
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
              {card.description || 'No description available'}
            </p>
          </CardContent>
        )}

        {(card.categories.length > 0 || card.tags.length > 0) && (
          <CardFooter className="pt-0 pb-4 flex-col items-start gap-3">
            {card.categories.length > 0 && (
              <div className="w-full space-y-2">
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
                        className="text-xs px-2 py-1 font-semibold hover:scale-105 transition-transform duration-200 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      >
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {card.tags.length > 0 && (
              <div className="w-full space-y-2">
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
                        className="text-xs px-2 py-1 hover:scale-105 transition-all duration-200 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
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
