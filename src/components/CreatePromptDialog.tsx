'use client';

import { Star } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { PromptCard } from '@/types/promptbox';

interface CreatePromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<PromptCard, 'actions'>) => void;
  availableCategories: string[];
  availableTags: string[];
  editingPrompt?: PromptCard | null;
}

export function CreatePromptDialog({
  isOpen,
  onClose,
  onSave,
  availableCategories,
  availableTags,
  editingPrompt,
}: CreatePromptDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // Load editing data when editingPrompt changes
  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title);
      setDescription(editingPrompt.description);
      setRating(editingPrompt.rating);
      setSelectedCategories(editingPrompt.categories);
      setSelectedTags(editingPrompt.tags);
    } else {
      // Reset form for new prompt
      setTitle('');
      setDescription('');
      setRating(0);
      setSelectedCategories([]);
      setSelectedTags([]);
    }
  }, [editingPrompt]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const newPrompt: Omit<PromptCard, 'actions'> = {
      title: title.trim(),
      description: description.trim(),
      rating,
      categories: selectedCategories,
      tags: selectedTags,
    };

    onSave(newPrompt);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setRating(0);
    setSelectedCategories([]);
    setSelectedTags([]);
    setNewCategory('');
    setNewTag('');
    onClose();
  };

  const toggleCategory = (category: string) => {
    if (category === 'ALL') return;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleTag = (tag: string) => {
    if (tag === 'ALL') return;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addNewCategory = () => {
    if (
      newCategory.trim() &&
      !availableCategories.includes(newCategory.trim())
    ) {
      setSelectedCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      setSelectedTags((prev) => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const setStarRating = (newRating: number) => {
    setRating(newRating === rating ? 0 : newRating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {editingPrompt
              ? 'Update the details of your existing prompt.'
              : 'Fill in the details below to create a new prompt for your collection.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor={titleId}
              className="text-sm font-semibold text-foreground"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id={titleId}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your prompt"
              className="h-9"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor={descriptionId}
              className="text-sm font-semibold text-foreground"
            >
              Description
            </Label>
            <textarea
              id={descriptionId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this prompt does and how to use it effectively..."
              rows={3}
              className="w-full px-2.5 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm leading-relaxed bg-background"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Quality Rating
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <button
                    key={`rating-star-${index + 1}`}
                    type="button"
                    onClick={() => setStarRating(index + 1)}
                    className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
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
            <Label className="text-sm font-semibold text-foreground">
              Categories
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {availableCategories
                .filter((cat) => cat !== 'ALL')
                .map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategories.includes(category)
                        ? 'default'
                        : 'outline'
                    }
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:scale-105 px-2.5 py-1 text-sm',
                      selectedCategories.includes(category)
                        ? 'shadow-sm ring-1 ring-primary/20'
                        : 'hover:border-primary/50',
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add custom category"
                onKeyDown={(e) => e.key === 'Enter' && addNewCategory()}
                className="flex-1 h-8"
              />
              <Button
                type="button"
                onClick={addNewCategory}
                variant="outline"
                size="sm"
                disabled={!newCategory.trim()}
                className="h-8 px-3"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground">
              Tags
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags
                .filter((tag) => tag !== 'ALL')
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:scale-105 px-2.5 py-1 text-sm',
                      selectedTags.includes(tag)
                        ? 'shadow-sm ring-1 ring-primary/20'
                        : 'hover:border-primary/50',
                    )}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag"
                onKeyDown={(e) => e.key === 'Enter' && addNewTag()}
                className="flex-1 h-8"
              />
              <Button
                type="button"
                onClick={addNewTag}
                variant="outline"
                size="sm"
                disabled={!newTag.trim()}
                className="h-8 px-3"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose} className="h-8 px-5">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="h-8 px-5 bg-primary hover:bg-primary/90"
          >
            {editingPrompt ? 'Update Prompt' : 'Create Prompt'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
