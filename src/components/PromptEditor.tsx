'use client';

import { ChevronDown, Eye, EyeOff, Plus, Save, Star, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { PromptCard } from '@/types/promptbox';

interface PromptEditorProps {
  prompt: PromptCard;
  mode: 'create' | 'edit';
  onSave: (prompt: PromptCard) => void;
  onCancel: () => void;
}

export function PromptEditor({ prompt, mode, onSave, onCancel }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt.title || '');
  const [description, setDescription] = useState(prompt.description || '');
  const [content, setContent] = useState(prompt.content || '');
  const [rating, setRating] = useState(prompt.rating || 0);
  const [categories, setCategories] = useState<string[]>(prompt.categories || []);
  const [tags, setTags] = useState<string[]>(prompt.tags || []);
  const [showPreview, setShowPreview] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [availableCategories, setAvailableCategories] = useState(['vibe', 'artist', 'writing', 'frontend', 'backend']);
  const [availableTags, setAvailableTags] = useState(['chatgpt', 'super', 'prompt', 'work', 'vit']);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Load available categories and tags from localStorage
  useEffect(() => {
    const filtersData = localStorage.getItem('promptbox_filters');
    if (filtersData) {
      try {
        const { categories, tags } = JSON.parse(filtersData);
        setAvailableCategories(categories.filter((cat: string) => cat !== 'ALL'));
        setAvailableTags(tags.filter((tag: string) => tag !== 'ALL'));
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    }
  }, []);

  const handleRatingClick = (newRating: number) => {
    setRating(newRating === rating ? 0 : newRating);
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addNewCategory = (newCategory: string) => {
    if (newCategory.trim() && !categories.includes(newCategory.trim()) && !availableCategories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setAvailableCategories([...availableCategories, newCategory.trim()]);
      setNewCategoryInput('');
      setShowCategoryInput(false);
    }
  };

  const addNewTag = (newTag: string) => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && !availableTags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setAvailableTags([...availableTags, newTag.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const deleteFromAvailableCategories = (categoryToDelete: string) => {
    // In a real app, this would make an API call to delete the category globally
    console.log('Delete category:', categoryToDelete);
    // Remove from available categories
    setAvailableCategories(availableCategories.filter(c => c !== categoryToDelete));
    // Remove from current selection if selected
    if (categories.includes(categoryToDelete)) {
      setCategories(categories.filter(c => c !== categoryToDelete));
    }
  };

  const deleteFromAvailableTags = (tagToDelete: string) => {
    // In a real app, this would make an API call to delete the tag globally
    console.log('Delete tag:', tagToDelete);
    // Remove from available tags
    setAvailableTags(availableTags.filter(t => t !== tagToDelete));
    // Remove from current selection if selected
    if (tags.includes(tagToDelete)) {
      setTags(tags.filter(t => t !== tagToDelete));
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
        setShowCategoryInput(false);
        setNewCategoryInput('');
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
        setShowTagInput(false);
        setNewTagInput('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const updatedPrompt: PromptCard = {
      ...prompt,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      rating,
      categories,
      tags,
    };

    onSave(updatedPrompt);
  };

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/```([\\s\\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\\d+\\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <h1 className="text-base font-semibold">
              {mode === 'create' ? 'Create Prompt' : 'Edit Prompt'}
            </h1>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-1 h-8 px-2"
              >
                {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Preview'}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1 h-8 px-2">
                <X className="h-3 w-3" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={!title.trim()}
                className="gap-1 h-8 px-3"
              >
                <Save className="h-3 w-3" />
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          {/* Compact Metadata Section */}
          <div className="bg-card/30 border rounded-lg p-4 space-y-3">
            {/* Title and Description - Single Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter prompt title..."
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Compact Rating, Categories, and Tags in One Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Rating */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Rating
                </Label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <button
                      key={`rating-star-${index + 1}`}
                      type="button"
                      onClick={() => handleRatingClick(index + 1)}
                      className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 rounded p-0.5"
                    >
                      <Star
                        className={cn(
                          'h-4 w-4 transition-colors',
                          index < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/40 hover:text-amber-300',
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    {rating > 0 ? `${rating}/5` : 'None'}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-1 relative">
                <Label className="text-xs font-medium text-muted-foreground">
                  Categories
                </Label>
                <div className="space-y-2">
                  {/* Selected Categories */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {categories.map((category) => (
                        <Badge
                          key={`selected-${category}`}
                          variant="default"
                          className="text-xs px-2 py-0.5 gap-1"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Dropdown Trigger */}
                  <div className="relative" ref={categoryDropdownRef}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="h-6 px-2 text-xs gap-1 w-full justify-between"
                    >
                      <span>Select Categories</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        showCategoryDropdown && "rotate-180"
                      )} />
                    </Button>
                    
                    {/* Modern Dropdown */}
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-48 overflow-hidden">
                        <div className="p-2 space-y-1">
                          {/* Add Custom Category Input */}
                          {showCategoryInput ? (
                            <div className="flex gap-1 items-center p-1 bg-muted/50 rounded border">
                              <Input
                                value={newCategoryInput}
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                placeholder="New category"
                                className="h-6 text-xs flex-1 border-0 bg-transparent focus-visible:ring-0"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewCategory(newCategoryInput);
                                  } else if (e.key === 'Escape') {
                                    setShowCategoryInput(false);
                                    setNewCategoryInput('');
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => addNewCategory(newCategoryInput)}
                                className="h-5 px-2 text-xs"
                                disabled={!newCategoryInput.trim()}
                              >
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowCategoryInput(false);
                                  setNewCategoryInput('');
                                }}
                                className="h-5 px-1"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCategoryInput(true)}
                              className="h-6 px-2 text-xs gap-1 w-full justify-start"
                            >
                              <Plus className="h-3 w-3" />
                              Add Custom Category
                            </Button>
                          )}
                          
                          {/* Scrollable Categories List */}
                          <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-thin">
                            {availableCategories.map((category) => (
                              <div
                                key={category}
                                className="flex items-center justify-between p-1 rounded hover:bg-muted/50 transition-colors group"
                              >
                                <Badge
                                  variant={categories.includes(category) ? "default" : "outline"}
                                  className="cursor-pointer text-xs px-2 py-0.5 flex-1 justify-start"
                                  onClick={() => toggleCategory(category)}
                                >
                                  {category}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFromAvailableCategories(category)}
                                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1 relative">
                <Label className="text-xs font-medium text-muted-foreground">
                  Tags
                </Label>
                <div className="space-y-2">
                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge
                          key={`selected-${tag}`}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 gap-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-background/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Dropdown Trigger */}
                  <div className="relative" ref={tagDropdownRef}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="h-6 px-2 text-xs gap-1 w-full justify-between"
                    >
                      <span>Select Tags</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        showTagDropdown && "rotate-180"
                      )} />
                    </Button>
                    
                    {/* Modern Dropdown */}
                    {showTagDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-48 overflow-hidden">
                        <div className="p-2 space-y-1">
                          {/* Add Custom Tag Input */}
                          {showTagInput ? (
                            <div className="flex gap-1 items-center p-1 bg-muted/50 rounded border">
                              <Input
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                placeholder="New tag"
                                className="h-6 text-xs flex-1 border-0 bg-transparent focus-visible:ring-0"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewTag(newTagInput);
                                  } else if (e.key === 'Escape') {
                                    setShowTagInput(false);
                                    setNewTagInput('');
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => addNewTag(newTagInput)}
                                className="h-5 px-2 text-xs"
                                disabled={!newTagInput.trim()}
                              >
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowTagInput(false);
                                  setNewTagInput('');
                                }}
                                className="h-5 px-1"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowTagInput(true)}
                              className="h-6 px-2 text-xs gap-1 w-full justify-start"
                            >
                              <Plus className="h-3 w-3" />
                              Add Custom Tag
                            </Button>
                          )}
                          
                          {/* Scrollable Tags List */}
                          <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-thin">
                            {availableTags.map((tag) => (
                              <div
                                key={tag}
                                className="flex items-center justify-between p-1 rounded hover:bg-muted/50 transition-colors group"
                              >
                                <Badge
                                  variant={tags.includes(tag) ? "secondary" : "outline"}
                                  className={cn(
                                    "cursor-pointer text-xs px-2 py-0.5 flex-1 justify-start",
                                    tags.includes(tag) && "bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20"
                                  )}
                                  onClick={() => toggleTag(tag)}
                                >
                                  {tag}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFromAvailableTags(tag)}
                                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[calc(100vh-200px)]">
            {/* Editor */}
            <div className={cn(
              "space-y-2",
              showPreview ? "lg:block" : "lg:col-span-2"
            )}>
              <Label htmlFor="content" className="text-xs font-medium text-muted-foreground">
                Content (Markdown)
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Your Prompt Title

Write your prompt content here using Markdown...

## Instructions
1. Add step-by-step instructions
2. Provide examples
3. Include tips and best practices

## Example
```
Your example code or content here
```

## Tips
- Use clear, concise language
- Provide context and examples
- Include expected outcomes"
                className="w-full h-[calc(100vh-200px)] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-xs leading-relaxed bg-background"
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Preview</Label>
                <div className="h-[calc(100vh-200px)] p-3 border border-input rounded-md overflow-y-auto bg-card">
                  <div 
                    className="prose prose-xs max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(content || 'No content to preview...') 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}