'use client';

import { Plus, X } from 'lucide-react';
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
const availableCategories = [
  'vibe',
  'artist',
  'writing',
  'frontend',
  'backend',
  'design',
  'ai',
  'productivity',
];
const availableTags = [
  'chatgpt',
  'claude',
  'super',
  'prompt',
  'work',
  'creative',
  'code',
  'technical',
  'automation',
];

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

  // Map rating value to stat label
  const getStatLabel = (ratingValue: number) => {
    switch (ratingValue) {
      case 1: return 'Temp';
      case 2: return 'Good';
      case 3: return 'Excellent';
      default: return 'N';
    }
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      onCategoriesChange(categories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...categories, category]);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter((t) => t !== tag));
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
    onCategoriesChange(categories.filter((c) => c !== category));
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Stats, Categories, and Tags Dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Stats Dropdown */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Stats
              </Label>
              <select
                value={rating}
                onChange={(e) => onRatingChange(Number(e.target.value))}
                className="h-7 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
              >
                <option value={0}>N</option>
                <option value={1}>Temp</option>
                <option value={2}>Good</option>
                <option value={3}>Excellent</option>
              </select>
            </div>

            {/* Categories Dropdown */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Categories
              </Label>
              <select
                multiple
                value={categories}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  onCategoriesChange(selected);
                }}
                className="h-20 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
              >
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Dropdown */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Tags
              </Label>
              <select
                multiple
                value={tags}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  onTagsChange(selected);
                }}
                className="h-20 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
