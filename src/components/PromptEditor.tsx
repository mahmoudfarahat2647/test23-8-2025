'use client';

import { ChevronDown, Copy, Download, Eye, EyeOff, FileText, Plus, Save, Star, Trash2, X, RotateCcw } from 'lucide-react';
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
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

export function PromptEditor({ prompt, mode, onSave, onCancel, showSidebar: externalShowSidebar, onToggleSidebar }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt.title || '');
  const [description, setDescription] = useState(prompt.description || '');
  const [content, setContent] = useState(prompt.content || '');
  const [exampleContent, setExampleContent] = useState(prompt.exampleContent || '');
  const [rating, setRating] = useState(prompt.rating || 0);
  const [categories, setCategories] = useState<string[]>(prompt.categories || []);
  const [tags, setTags] = useState<string[]>(prompt.tags || []);
  const [showPreview, setShowPreview] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(externalShowSidebar ?? true); // Default to show sidebar
  // Store original content for reset functionality
  const [originalContent, setOriginalContent] = useState(prompt.content || '');
  const [originalExampleContent, setOriginalExampleContent] = useState(prompt.exampleContent || '');
  
  // Update original content when prompt changes (e.g., when switching between prompts)
  useEffect(() => {
    setOriginalContent(prompt.content || '');
    setOriginalExampleContent(prompt.exampleContent || '');
  }, [prompt]);
  
  // Handle external sidebar control
  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setShowSidebar(!showSidebar);
    }
  };
  
  const sidebarVisible = externalShowSidebar ?? showSidebar;
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

  // Close download dropdown when clicking outside
  const downloadDropdownRef = useRef<HTMLDivElement>(null);
  
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
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setShowDownloadDropdown(false);
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
      exampleContent: exampleContent.trim(),
      rating,
      categories,
      tags,
    };

    onSave(updatedPrompt);
  };

  // Download functionality
  const handleDownload = (format: 'md' | 'docx' | 'pdf') => {
    const downloadContent = `# ${title || 'Untitled Prompt'}

## Description
${description}

## Content
${content}

## Example Usage
${exampleContent}

## Metadata
- Rating: ${rating}/5
- Categories: ${categories.join(', ') || 'None'}
- Tags: ${tags.join(', ') || 'None'}`;
    
    const filename = `${(title || 'prompt').replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    
    if (format === 'md') {
      const blob = new Blob([downloadContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'docx') {
      // For Word format, we'll create a simple HTML structure that can be opened by Word
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title || 'Untitled Prompt'}</title>
          </head>
          <body>
            <h1>${title || 'Untitled Prompt'}</h1>
            <h2>Description</h2>
            <p>${description}</p>
            <h2>Content</h2>
            <pre>${content}</pre>
            <h2>Example Usage</h2>
            <pre>${exampleContent}</pre>
            <h2>Metadata</h2>
            <ul>
              <li>Rating: ${rating}/5</li>
              <li>Categories: ${categories.join(', ') || 'None'}</li>
              <li>Tags: ${tags.join(', ') || 'None'}</li>
            </ul>
          </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF, we'll create HTML and let the browser handle it
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title || 'Untitled Prompt'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1, h2 { color: #333; }
              pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>${title || 'Untitled Prompt'}</h1>
            <h2>Description</h2>
            <p>${description}</p>
            <h2>Content</h2>
            <pre>${content}</pre>
            <h2>Example Usage</h2>
            <pre>${exampleContent}</pre>
            <h2>Metadata</h2>
            <ul>
              <li>Rating: ${rating}/5</li>
              <li>Categories: ${categories.join(', ') || 'None'}</li>
              <li>Tags: ${tags.join(', ') || 'None'}</li>
            </ul>
          </body>
        </html>
      `;
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.print();
      }
    }
    
    setShowDownloadDropdown(false);
  };

  // Simple formatting functions
  const formatAsMarkdown = (text: string) => {
    if (!text.trim()) return text;
    
    // Basic markdown formatting - organize content with headers, lists, and code blocks
    const lines = text.split('\n');
    let formatted = '';
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        formatted += line + '\n';
        continue;
      }
      
      // If we're in a code block, just add the line
      if (inCodeBlock) {
        formatted += line + '\n';
        continue;
      }
      
      // Skip empty lines at the beginning
      if (!line.trim() && formatted === '') continue;
      
      // Add headers for common patterns (lines ending with :)
      if (line.trim().endsWith(':') && line.trim().length < 50) {
        formatted += `## ${line.trim()}\n`;
      } 
      // Format bullet points
      else if (line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•')) {
        formatted += line + '\n';
      }
      // Format numbered lists
      else if (/^\s*\d+[\.\)]/.test(line)) {
        formatted += line + '\n';
      }
      // Format as paragraph if it's a longer line
      else if (line.trim().length > 0) {
        // If we already have content, add a newline before the paragraph
        if (formatted && !formatted.endsWith('\n\n') && !formatted.endsWith('## ')) {
          formatted += '\n';
        }
        formatted += line + '\n';
      }
      
      // Add spacing between sections
      if (line.trim() === '' && i < lines.length - 1 && lines[i+1].trim() !== '') {
        if (!formatted.endsWith('\n\n')) {
          formatted += '\n';
        }
      }
    }
    
    return formatted.trim();
  };

  const formatAsJSON = (text: string) => {
    if (!text.trim()) return '{}';
    
    // Convert text to a structured JSON format
    const lines = text.split('\n');
    const result: any = {
      content: []
    };
    
    let currentBlock: any = null;
    let inCodeBlock = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed && !currentBlock) continue;
      
      // Handle code blocks
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          // Start a new code block
          if (!currentBlock) {
            currentBlock = { type: 'code', content: '' };
          } else {
            currentBlock.content += line + '\n';
          }
        } else {
          // End code block
          if (currentBlock) {
            currentBlock.content += line + '\n';
            result.content.push(currentBlock);
            currentBlock = null;
          }
        }
        continue;
      }
      
      // If in code block, add to current block
      if (inCodeBlock) {
        if (currentBlock) {
          currentBlock.content += line + '\n';
        }
        continue;
      }
      
      // Detect section headers (lines ending with :)
      if (trimmed.endsWith(':')) {
        // Save previous block if exists
        if (currentBlock) {
          result.content.push(currentBlock);
        }
        // Start new section
        currentBlock = { 
          type: 'section', 
          title: trimmed.slice(0, -1),
          content: '' 
        };
        continue;
      }
      
      // Detect list items
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•') || /^\d+[\.\)]/.test(trimmed)) {
        // Save previous block if it's not a list
        if (currentBlock && currentBlock.type !== 'list') {
          result.content.push(currentBlock);
          currentBlock = null;
        }
        
        // Start or continue list
        if (!currentBlock) {
          currentBlock = { type: 'list', items: [] };
        }
        
        if (currentBlock.type === 'list') {
          currentBlock.items.push(trimmed.replace(/^[\d\-\*\•\.\)]+\s*/, ''));
        }
        continue;
      }
      
      // Regular paragraph
      if (trimmed.length > 0) {
        // Save previous block if it's not a paragraph
        if (currentBlock && currentBlock.type !== 'paragraph') {
          result.content.push(currentBlock);
          currentBlock = null;
        }
        
        // Start or continue paragraph
        if (!currentBlock) {
          currentBlock = { type: 'paragraph', content: trimmed };
        } else {
          currentBlock.content += ' ' + trimmed;
        }
        continue;
      }
      
      // Empty line - save current block
      if (currentBlock) {
        result.content.push(currentBlock);
        currentBlock = null;
      }
    }
    
    // Save final block
    if (currentBlock) {
      result.content.push(currentBlock);
    }
    
    return JSON.stringify(result, null, 2);
  };

  // Normal/paragraph formatting - cleans up text and ensures proper paragraph spacing
  const formatAsNormal = (text: string) => {
    if (!text.trim()) return text;
    
    // Split into lines and rejoin with proper paragraph spacing
    const lines = text.split('\n');
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // If line is empty, finalize current paragraph
      if (!trimmed) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = '';
        }
        continue;
      }
      
      // Add to current paragraph
      if (currentParagraph) {
        currentParagraph += ' ' + trimmed;
      } else {
        currentParagraph = trimmed;
      }
    }
    
    // Add final paragraph
    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }
    
    // Join with double newlines for paragraph separation
    return paragraphs.join('\n\n');
  };

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
  
  // Add reset functions
  const resetToOriginalContent = () => {
    setContent(originalContent);
  };
  
  const resetToOriginalExampleContent = () => {
    setExampleContent(originalExampleContent);
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
                onClick={handleToggleSidebar}
                className="gap-1 h-8 px-2"
                title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span className="hidden sm:inline">Preview</span>
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
            {/* Main Content or Example Editor */}
            <div className={cn(
              "space-y-2 relative",
              showPreview ? "lg:block" : "lg:col-span-2"
            )}>
              {!showExample ? (
                // Main Content Editor
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content" className="text-xs font-medium text-muted-foreground">
                      Content (Markdown)
                    </Label>
                    
                    {/* Top-right buttons in text editor area */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExample(true)}
                        className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Switch to example editor"
                      >
                        <Eye className="h-3 w-3" />
                        Example
                      </Button>
                      
                      <div className="relative" ref={downloadDropdownRef}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                          className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                          title="Download options"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        
                        {/* Download Options Dropdown */}
                        {showDownloadDropdown && (
                          <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[120px]">
                            <div className="p-1 space-y-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('md')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                Markdown
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('docx')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                Word Doc
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('pdf')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                PDF Print
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (content) {
                            navigator.clipboard.writeText(content);
                          }
                        }}
                        className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Copy content"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      
                      {/* Format buttons positioned under Copy button but inside text area */}
                      <div className="relative">
                        <div className="absolute top-7 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setContent(formatAsNormal(content))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as Normal Text"
                          >
                            P
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setContent(formatAsMarkdown(content))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as Markdown"
                          >
                            MD
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setContent(formatAsJSON(content))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as JSON"
                          >
                            JSON
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetToOriginalContent}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Reset to original content"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
                    className="w-full h-[calc(100vh-200px)] p-3 pt-8 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-xs leading-relaxed bg-background"
                  />
                </>
              ) : (
                // Example Editor
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="example-content" className="text-xs font-medium text-muted-foreground">
                      Example Usage (Markdown)
                    </Label>
                    
                    {/* Top-right buttons in example editor area */}
                    <div className="flex items-center gap-1">
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExample(false)}
                        className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Switch back to main content"
                      >
                        <X className="h-3 w-3" />
                        Content
                      </Button>
                      
                      <div className="relative" ref={downloadDropdownRef}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                          className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                          title="Download options"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        
                        {/* Download Options Dropdown */}
                        {showDownloadDropdown && (
                          <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[120px]">
                            <div className="p-1 space-y-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('md')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                Markdown
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('docx')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                Word Doc
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload('pdf')}
                                className="h-6 px-2 text-xs gap-2 w-full justify-start text-muted-foreground hover:text-foreground"
                              >
                                <FileText className="h-3 w-3" />
                                PDF Print
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (exampleContent) {
                            navigator.clipboard.writeText(exampleContent);
                          }
                        }}
                        className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Copy example content"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      
                      {/* Format buttons positioned under Copy button but inside text area */}
                      <div className="relative">
                        <div className="absolute top-7 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded border border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExampleContent(formatAsNormal(exampleContent))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as Normal Text"
                          >
                            P
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExampleContent(formatAsMarkdown(exampleContent))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as Markdown"
                          >
                            MD
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExampleContent(formatAsJSON(exampleContent))}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Format as JSON"
                          >
                            JSON
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetToOriginalExampleContent}
                            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            title="Reset to original content"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <textarea
                    id="example-content"
                    value={exampleContent}
                    onChange={(e) => setExampleContent(e.target.value)}
                    placeholder="# Example Usage

Show users how to use this prompt effectively...

## Input Example
```
User input: Write a story about a robot
```

## Expected Output
```
Once upon a time, in a world where technology...
```

## Tips for Best Results
- Be specific in your request
- Provide context when needed
- Experiment with different approaches"
                    className="w-full h-[calc(100vh-200px)] p-3 pt-8 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-xs leading-relaxed bg-background"
                  />
                </>
              )}
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Live Preview</Label>
                <div className="h-[calc(100vh-200px)] p-3 border border-input rounded-md overflow-y-auto bg-card">
                  <div className="space-y-6">
                    {!showExample ? (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-coral-600 dark:text-coral-400">Main Content</h3>
                        <div 
                          className="prose prose-xs max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: markdownToHtml(content || 'No content to preview...') 
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-amber-600 dark:text-amber-400">Example Usage</h3>
                        <div 
                          className="prose prose-xs max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: markdownToHtml(exampleContent || 'No example content to preview...') 
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}