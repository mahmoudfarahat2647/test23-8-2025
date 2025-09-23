'use client';

import { ChevronDown, ChevronRight, Folder, Tag, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { CategoryType, PromptCard, TagType } from '@/types/promptbox';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'category' | 'tag';
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Delete {itemType === 'category' ? 'Category' : 'Tag'}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the {itemType} &ldquo;{itemName}
            &rdquo;?
            {itemType === 'category'
              ? ' This will remove the category from all prompts.'
              : ' This will remove the tag from all prompts.'}
            <br />
            <span className="font-medium text-destructive mt-2 block">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete {itemType === 'category' ? 'Category' : 'Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SidebarProps {
  categories: CategoryType[];
  prompts: PromptCard[];
  activeCategories: CategoryType[];
  activeTags: TagType[];
  onCategoryToggle: (category: CategoryType) => void;
  onTagToggle: (tag: TagType) => void;
  onCategoryDelete?: (category: CategoryType) => void;
  onTagDelete?: (tag: TagType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  categories,
  prompts,
  activeCategories,
  activeTags,
  onCategoryToggle,
  onTagToggle,
  onCategoryDelete,
  onTagDelete,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(['ALL']),
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: 'category' | 'tag';
  }>({ isOpen: false, itemName: '', itemType: 'category' });

  // Calculate tags for each category based on actual prompts
  const categoryTagsMap = useMemo(() => {
    const map = new Map<string, Set<string>>();

    // Initialize with empty sets
    for (const category of categories) {
      map.set(category, new Set());
    }

    // Add tags based on prompts
    for (const prompt of prompts) {
      for (const category of prompt.categories) {
        if (map.has(category) && category !== 'ALL') {
          // Don't add tags to ALL category
          for (const tag of prompt.tags) {
            if (tag !== 'ALL') {
              map.get(category)?.add(tag);
            }
          }
        }
      }
    }

    // Keep ALL category empty - it's just a reset button
    if (map.has('ALL')) {
      map.set('ALL', new Set());
    }

    return map;
  }, [categories, prompts]);

  const toggleCategory = (category: string) => {
    // Special handling for ALL - reset all filters
    if (category === 'ALL') {
      return; // ALL doesn't expand/collapse, it's just a reset button
    }

    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDeleteClick = (
    itemName: string,
    itemType: 'category' | 'tag',
  ) => {
    setDeleteDialog({ isOpen: true, itemName, itemType });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.itemType === 'category' && onCategoryDelete) {
      onCategoryDelete(deleteDialog.itemName);
    } else if (deleteDialog.itemType === 'tag' && onTagDelete) {
      onTagDelete(deleteDialog.itemName);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, itemName: '', itemType: 'category' });
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 hover:bg-primary/10"
          title="Expand sidebar"
        >
          <Folder className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-56 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              <h2 className="font-bold tracking-tight bg-gradient-to-r from-primary to-[#d97757]/30 bg-clip-text text-transparent">
                PROMPTBOX
              </h2>
            </div>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-6 w-6 hover:bg-primary/10"
                title="Collapse sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category);
            const isActive = activeCategories.includes(category);
            const categoryTags = Array.from(
              categoryTagsMap.get(category) || [],
            );
            const canDelete = category !== 'ALL' && onCategoryDelete;

            return (
              <div key={category} className="space-y-1">
                {/* Category Item */}
                <div className="group relative">
                  {category === 'ALL' ? (
                    // Special styling for ALL button - compact reset button
                    <button
                      type="button"
                      className={cn(
                        'flex items-center justify-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200',
                        'bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50',
                        isActive && 'bg-primary/20 border-primary/50 shadow-sm',
                      )}
                      onClick={() => onCategoryToggle(category)}
                    >
                      <span className="text-sm font-bold text-primary">
                        {category}
                      </span>
                    </button>
                  ) : (
                    // Regular category styling
                    <div
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/5',
                        isActive && 'bg-primary/10 border border-primary/20',
                      )}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleCategory(category)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <div className="w-3 h-3 flex items-center justify-center">
                          {categoryTags.length > 0 ? (
                            isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )
                          ) : null}
                        </div>
                      </Button>

                      <button
                        type="button"
                        className="flex-1 flex items-center gap-2"
                        onClick={() => onCategoryToggle(category)}
                      >
                        <Folder
                          className={cn(
                            'h-4 w-4',
                            isActive ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isActive ? 'text-primary' : 'text-foreground',
                          )}
                        >
                          {category}
                        </span>
                        <Badge
                          variant="secondary"
                          className="ml-auto text-xs bg-muted text-muted-foreground"
                        >
                          {categoryTags.length}
                        </Badge>
                      </button>

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(category, 'category');
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                          title={`Delete ${category}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags for this category */}
                {isExpanded && categoryTags.length > 0 && (
                  <div className="ml-6 space-y-1 pb-2">
                    {categoryTags.map((tag) => {
                      const isTagActive = activeTags.includes(tag);
                      const canDeleteTag = onTagDelete;

                      return (
                        <div
                          key={`${category}-${tag}`}
                          className="group relative"
                        >
                          <div
                            className={cn(
                              'flex items-center gap-2 p-1.5 rounded-md transition-all duration-200 hover:bg-primary/5',
                              isTagActive && 'bg-primary/10',
                            )}
                          >
                            <button
                              type="button"
                              className="flex items-center gap-2 flex-1 cursor-pointer"
                              onClick={() => onTagToggle(tag)}
                            >
                              <Tag
                                className={cn(
                                  'h-3 w-3',
                                  isTagActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                                )}
                              />
                              <span
                                className={cn(
                                  'text-xs',
                                  isTagActive
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {tag}
                              </span>
                            </button>

                            {canDeleteTag && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(tag, 'tag');
                                }}
                                className="h-4 w-4 p-0 ml-auto opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                                title={`Delete ${tag}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.itemName}
        itemType={deleteDialog.itemType}
      />
    </>
  );
}
