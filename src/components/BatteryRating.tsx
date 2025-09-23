'use client';

import { cn } from '@/lib/utils';

interface BatteryRatingProps {
  rating: number;
  maxRating?: number;
  isVertical?: boolean;
  onClick?: (newRating: number) => void;
}

export function BatteryRating({
  rating,
  maxRating = 5,
  isVertical = false,
  onClick,
}: BatteryRatingProps) {
  // For vertical battery, we always show 6 segments regardless of maxRating
  const verticalSegments = 6;

  // Determine color based on fixed positions for vertical battery (bottom to top)
  // 2 green bars (positions 1,2), 1 yellow bar (position 3), 3 red bars (positions 4,5,6)
  const getVerticalSegmentColor = (segmentIndex: number) => {
    if (segmentIndex <= 2) return 'bg-green-500'; // Bottom 2 segments green
    if (segmentIndex === 3) return 'bg-yellow-500'; // Middle segment yellow
    return 'bg-red-500'; // Top 3 segments red
  };

  // Determine opacity based on rating for vertical battery
  const getVerticalSegmentOpacity = (segmentIndex: number) => {
    // For a 5-point rating system mapped to 6 segments:
    // Rating 0: all segments at 30% opacity
    // Rating 1: 1 segment at 100%, rest at 30%
    // Rating 2: 2 segments at 100%, rest at 30%
    // etc.
    if (rating === 0) return 'opacity-30';

    // Map 5-point rating to 6 segments
    const activeSegments = Math.round((rating / maxRating) * verticalSegments);
    return segmentIndex <= activeSegments ? 'opacity-100' : 'opacity-30';
  };

  // Determine color based on rating for horizontal battery
  const getHorizontalSegmentColor = (segmentIndex: number) => {
    if (segmentIndex > rating) return 'bg-muted-foreground/20';
    if (rating <= 1) return 'bg-red-500'; // Red for low rating
    if (rating <= 2) return 'bg-orange-500'; // Orange for medium-low
    if (rating <= 3) return 'bg-yellow-500'; // Yellow for medium
    if (rating <= 4) return 'bg-lime-500'; // Lime for medium-high
    return 'bg-green-500'; // Green for high rating
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        // For simplicity, we'll set a default rating when activated via keyboard
        onClick(rating === 0 ? maxRating : 0);
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        onClick(Math.min(maxRating, rating + 1));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        onClick(Math.max(0, rating - 1));
        break;
      default:
        break;
    }
  };

  if (isVertical) {
    return (
      <div
        className="flex flex-col items-center justify-end w-3 h-16 rounded-sm border border-border cursor-pointer group pl-2" // Added pl-2 for left padding
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            // Calculate rating based on click position
            const rect = e.currentTarget.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const segmentHeight = rect.height / maxRating;
            const clickedSegment =
              maxRating - Math.floor(clickY / segmentHeight);
            onClick(clickedSegment === rating ? 0 : clickedSegment);
          }
        }}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={rating}
        aria-valuemin={0}
        aria-valuemax={maxRating}
        aria-label="Rating control"
        tabIndex={0}
      >
        <div className="relative w-full h-full flex flex-col-reverse">
          {Array.from({ length: verticalSegments }, (_, index) => {
            const segmentNumber = index + 1;
            return (
              <div
                key={`battery-segment-${segmentNumber}`}
                className={cn(
                  'flex-1 transition-all duration-300',
                  getVerticalSegmentColor(segmentNumber),
                  getVerticalSegmentOpacity(segmentNumber),
                )}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 h-4 cursor-pointer group pl-2" // Added pl-2 for left padding
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          // Calculate rating based on click position
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const segmentWidth = rect.width / maxRating;
          const clickedSegment = Math.floor(clickX / segmentWidth) + 1;
          onClick(clickedSegment === rating ? 0 : clickedSegment);
        }
      }}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuenow={rating}
      aria-valuemin={0}
      aria-valuemax={maxRating}
      aria-label="Rating control"
      tabIndex={0}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const segmentNumber = index + 1;
        return (
          <div
            key={`battery-segment-${segmentNumber}`}
            className={cn(
              'h-3 flex-1 rounded-sm transition-all duration-300',
              getHorizontalSegmentColor(segmentNumber),
              segmentNumber <= rating ? 'opacity-100' : 'opacity-30',
            )}
          />
        );
      })}
      <span className="text-xs text-muted-foreground font-semibold tracking-wide ml-2">
        {rating}/{maxRating}
      </span>
    </div>
  );
}
