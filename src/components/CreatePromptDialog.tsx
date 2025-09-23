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
  // Use rating state but map to stats values (1=temp, 2=good, 3=excellent)
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
      // Map rating to stats values
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

    // Map rating value back to stats for the prompt
    const newPrompt: Omit<PromptCard, 'actions'> = {
      title: title.trim(),
      description: description.trim(),
      rating, // Use rating value (1=temp, 2=good, 3=excellent)
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

  // Map rating value to stat label
  const getStatLabel = (ratingValue: number) => {
    switch (ratingValue) {
      case 1: return 'Temp';
      case 2: return 'Good';
      case 3: return 'Excellent';
      default: return 'N';
    }
  };

  // Handle stat selection
  const handleStatSelect = (stat: 'temp' | 'good' | 'excellent' | null) => {
    switch (stat) {
      case 'temp': setRating(1); break;
      case 'good': setRating(2); break;
      case 'excellent': setRating(3); break;
      default: setRating(0);
    }
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

          {/* Stats, Categories, and Tags Dropdowns */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Stats
                </Label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-8 px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
                >
                  <option value={0}>N</option>
                  <option value={1}>Temp</option>
                  <option value={2}>Good</option>
                  <option value={3}>Excellent</option>
                </select>
              </div>

              {/* Categories Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Categories
                </Label>
                <div className="relative">
                  <select
                    multiple
                    value={selectedCategories}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedCategories(selected);
                    }}
                    className="w-full h-24 px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
                  >
                    {availableCategories
                      .filter((cat) => cat !== 'ALL')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Tags Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Tags
                </Label>
                <div className="relative">
                  <select
                    multiple
                    value={selectedTags}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedTags(selected);
                    }}
                    className="w-full h-24 px-2 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent"
                  >
                    {availableTags
                      .filter((tag) => tag !== 'ALL')
                      .map((tag) => (
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
