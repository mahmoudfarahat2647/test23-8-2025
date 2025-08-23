"use client";

import { Star, Edit, Trash2, Share2, Copy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptCard as PromptCardType } from "@/types/promptbox";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  card: PromptCardType;
  onEdit?: (card: PromptCardType) => void;
  onDelete?: (card: PromptCardType) => void;
  onShare?: (card: PromptCardType) => void;
  onCopy?: (card: PromptCardType) => void;
}

function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "h-3 w-3 transition-colors",
              index < rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium">
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-foreground line-clamp-2 mb-2">
              {card.title || "Untitled Prompt"}
            </CardTitle>
            {card.rating > 0 && (
              <StarRating rating={card.rating} />
            )}
          </div>
          <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {card.actions.edit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
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
                className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50"
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
                className="h-7 w-7 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50"
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
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
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
          <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
            {card.description || "No description available"}
          </p>
        </CardContent>
      )}

      {(card.categories.length > 0 || card.tags.length > 0) && (
        <CardFooter className="pt-0 pb-4 flex-col items-start gap-3">
          {card.categories.length > 0 && (
            <div className="w-full">
              <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Categories
              </div>
              <div className="flex flex-wrap gap-1">
                {card.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5 font-medium">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {card.tags.length > 0 && (
            <div className="w-full">
              <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Tags
              </div>
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      )}
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}