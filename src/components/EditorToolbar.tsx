'use client';

import { Plus, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

// Available categories and tags (in a real app, these would come from an API)
const availableCategories = ['vibe', 'artist', 'writing', 'frontend', 'backend', 'design', 'ai', 'productivity'];
const availableTags = ['chatgpt', 'claude', 'super', 'prompt', 'work', 'creative', 'code', 'technical', 'automation'];

export function EditorToolbar({
  rating,
  onRatingChange,
  categories,
  onCategoriesChange,
  tags,
  onTagsChange,
}: EditorToolbarProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);

  const handleRatingClick = (newRating: number) => {
    onRatingChange(newRating === rating ? 0 : newRating);
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      onCategoriesChange(categories.filter(c => c !== category));
    } else {
      onCategoriesChange([...categories, category]);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter(t => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onCategoriesChange([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeCategory = (category: string) => {
    onCategoriesChange(categories.filter(c => c !== category));
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 space-y-6">
      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4" />
          Quality Rating
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <button
                key={`rating-star-${index + 1}`}
                type="button"
                onClick={() => handleRatingClick(index + 1)}
                className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-1"
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition-colors',
                    index < rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/40 hover:text-amber-300',
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {rating > 0 ? `${rating}/5 stars` : 'No rating'}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Categories</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCategoryInput(!showCategoryInput)}
            className="h-7 px-2 gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Custom
          </Button>
        </div>

        {/* Selected Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((category) => (
              <Badge
                key={`selected-${category}`}
                variant="default"
                className="gap-1 pl-2 pr-1 py-1"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Available Categories */}
        <div className="flex flex-wrap gap-1.5">
          {availableCategories
            .filter(cat => !categories.includes(cat))
            .map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:border-primary/50"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
        </div>

        {/* Add Custom Category */}
        {showCategoryInput && (
          <div className="flex gap-2 items-center">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewCategory();
                } else if (e.key === 'Escape') {
                  setShowCategoryInput(false);
                  setNewCategory('');
                }
              }}
              className="h-8 flex-1"
              autoFocus
            />
            <Button
              type="button"
              onClick={addNewCategory}
              size="sm"
              disabled={!newCategory.trim()}
              className="h-8 px-3"
            >
              Add
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowCategoryInput(false);
                setNewCategory('');
              }}
              variant="outline"
              size="sm"
              className="h-8 px-3"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Tags</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTagInput(!showTagInput)}
            className="h-7 px-2 gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Custom
          </Button>
        </div>

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <Badge
                key={`selected-${tag}`}
                variant="secondary"
                className="gap-1 pl-2 pr-1 py-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Available Tags */}
        <div className="flex flex-wrap gap-1.5">
          {availableTags
            .filter(tag => !tags.includes(tag))
            .map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:border-primary/50"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
        </div>

        {/* Add Custom Tag */}
        {showTagInput && (
          <div className="flex gap-2 items-center">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewTag();
                } else if (e.key === 'Escape') {
                  setShowTagInput(false);
                  setNewTag('');
                }
              }}
              className="h-8 flex-1"
              autoFocus
            />
            <Button
              type="button"
              onClick={addNewTag}
              size="sm"
              disabled={!newTag.trim()}
              className="h-8 px-3"
            >
              Add
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowTagInput(false);
                setNewTag('');
              }}
              variant="outline"
              size="sm"
              className="h-8 px-3"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}