'use client';

import { Copy, Edit, Pin, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PromptCard as PromptCardType } from '@/types/promptbox';

interface PromptCardProps {
  card: PromptCardType;
  onEdit?: (card: PromptCardType) => void;
  onDelete?: (card: PromptCardType) => void;
  onCopy?: (card: PromptCardType) => void;
  onPin?: (card: PromptCardType) => void;
  onStatChange?: (
    card: PromptCardType,
    stat: 'temp' | 'good' | 'excellent' | null,
  ) => void;
}

const PromptCardComponent = memo(function PromptCard({
  card,
  onEdit,
  onDelete,
  onCopy,
  onPin,
  onStatChange,
}: PromptCardProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const hasContent = card.title || card.description;

  // Since we can't modify the type, we'll use the rating property but treat different values as stats:
  // 1 = temp, 2 = good, 3 = excellent
  const getStatFromRating = () => {
    switch (card.rating) {
      case 1:
        return 'temp';
      case 2:
        return 'good';
      case 3:
        return 'excellent';
      default:
        return null;
    }
  };

  const stat = getStatFromRating();

  const handleStatChange = (newStat: 'temp' | 'good' | 'excellent' | null) => {
    // Convert stat back to rating value
    let ratingValue = 0;
    switch (newStat) {
      case 'temp':
        ratingValue = 1;
        break;
      case 'good':
        ratingValue = 2;
        break;
      case 'excellent':
        ratingValue = 3;
        break;
      default:
        ratingValue = 0;
    }

    // Create a new card object with the updated rating
    const updatedCard = { ...card, rating: ratingValue };
    onStatChange?.(updatedCard, newStat);
    setIsStatsOpen(false);
  };

  // Handle keyboard events for accessibility
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setIsStatsOpen(false);
    }
  };

  // Get display properties for the stat
  const getStatProperties = () => {
    switch (stat) {
      case 'temp':
        return {
          text: 'Temp',
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-500',
          borderColor: 'border-red-500/30',
        };
      case 'good':
        return {
          text: 'Good',
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/30',
        };
      case 'excellent':
        return {
          text: 'Excellent',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/30',
        };
      default:
        return {
          text: 'N',
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-500/30',
        };
    }
  };

  const statProps = getStatProperties();

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-border/20 glass-card hover-lift animate-fade-in bg-card/90 backdrop-blur-md hover:border-primary/30 hover:shadow-primary/10 dark:border-gradient-gray',
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

      {/* Stats indicator - positioned at bottom right without taking space */}
      <div className="absolute bottom-2 right-2 z-20">
        <button
          type="button"
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity min-w-[24px] text-center',
            statProps.bgColor,
            statProps.textColor,
            statProps.borderColor,
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsStatsOpen(!isStatsOpen);
          }}
          aria-haspopup="true"
          aria-expanded={isStatsOpen}
          aria-label="Change stat rating"
        >
          {statProps.text}
        </button>
      </div>

      {/* Stats Dropdown - shown when clicking on the stats */}
      {isStatsOpen && (
        <div
          className="absolute bottom-8 right-2 z-30"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleDropdownKeyDown}
          role="dialog"
          aria-label="Stat rating options"
          tabIndex={-1}
        >
          <div className="bg-popover border border-border rounded-md shadow-lg glass-card backdrop-blur-md p-1">
            <button
              type="button"
              className={cn(
                'block w-full px-2 py-1 text-left text-xs transition-colors rounded',
                stat === 'temp'
                  ? 'bg-red-500/20 text-red-500'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => handleStatChange('temp')}
            >
              Temp
            </button>
            <button
              type="button"
              className={cn(
                'block w-full px-2 py-1 text-left text-xs transition-colors rounded',
                stat === 'good'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => handleStatChange('good')}
            >
              Good
            </button>
            <button
              type="button"
              className={cn(
                'block w-full px-2 py-1 text-left text-xs transition-colors rounded',
                stat === 'excellent'
                  ? 'bg-green-500/20 text-green-500'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => handleStatChange('excellent')}
            >
              Excellent
            </button>
            <button
              type="button"
              className={cn(
                'block w-full px-2 py-1 text-left text-xs transition-colors rounded',
                stat === null
                  ? 'bg-gray-800 text-gray-300'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => handleStatChange(null)}
            >
              N
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 space-y-1">
              <CardTitle className="text-sm font-bold text-foreground line-clamp-2 mb-0 leading-tight group-hover:text-primary transition-colors duration-300">
                {card.title || 'Untitled Prompt'}
              </CardTitle>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-6 w-6 hover:scale-110 transition-all duration-200 hover-glow',
                  card.pinned
                    ? 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 fill-purple-600'
                    : 'text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50',
                )}
                onClick={() => onPin?.(card)}
                title={card.pinned ? 'Unpin prompt' : 'Pin prompt'}
              >
                <Pin className={cn('h-3 w-3', card.pinned && 'fill-current')} />
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
          <CardContent className="pb-6">
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
