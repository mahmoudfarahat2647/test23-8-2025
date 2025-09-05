'use client';

import { X } from 'lucide-react';
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
import type { CategoryType, TagType } from '@/types/promptbox';
import { useState } from 'react';

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
            Are you sure you want to delete the {itemType} &ldquo;{itemName}&rdquo;?
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

interface FilterSectionProps {
  title: string;
  items: string[];
  activeItems: string[];
  onToggle: (item: string) => void;
  onDelete?: (item: string) => void;
  variant?: 'category' | 'tag';
}

function FilterSection({
  title,
  items,
  activeItems,
  onToggle,
  onDelete,
  variant = 'category',
}: FilterSectionProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemName: string;
  }>({ isOpen: false, itemName: '' });

  const handleDeleteClick = (item: string) => {
    setDeleteDialog({ isOpen: true, itemName: item });
  };

  const handleDeleteConfirm = () => {
    if (onDelete && deleteDialog.itemName) {
      onDelete(deleteDialog.itemName);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, itemName: '' });
  };
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
        <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = activeItems.includes(item);
          const isAll = item === 'ALL';
          const canDelete = !isAll && onDelete;

          if (variant === 'category') {
            return (
              <div key={item} className="relative group">
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onToggle(item)}
                  className={cn(
                    'h-8 px-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover-lift',
                    canDelete && 'pr-8',
                    isAll && 'font-bold',
                    isActive
                      ? 'shadow-lg ring-2 ring-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-primary/50'
                      : 'hover:border-primary/50 hover:bg-primary/5 hover:text-primary glass',
                  )}
                >
                  {item}
                  {isActive && (
                    <div className="ml-2 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </Button>
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(item);
                    }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive/10 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    title={`Delete ${item}`}
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            );
          }

          return (
            <div key={item} className="relative group">
              <Badge
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:scale-105 px-2.5 py-1 text-sm font-medium hover-lift',
                  canDelete && 'pr-6',
                  isAll && 'font-bold',
                  isActive
                    ? 'shadow-md ring-2 ring-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
                    : 'hover:border-primary/50 hover:bg-primary/5 hover:text-primary glass border-border/30',
                )}
                onClick={() => onToggle(item)}
              >
                {item}
                {isActive && (
                  <div className="ml-2 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </Badge>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(item);
                  }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive/10 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  title={`Delete ${item}`}
                >
                  <X className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.itemName}
        itemType={variant}
      />
    </div>
  );
}

interface FiltersProps {
  categories: CategoryType[];
  tags: TagType[];
  activeCategories: CategoryType[];
  activeTags: TagType[];
  onCategoryToggle: (category: CategoryType) => void;
  onTagToggle: (tag: TagType) => void;
  onCategoryDelete?: (category: CategoryType) => void;
  onTagDelete?: (tag: TagType) => void;
}

export function Filters({
  categories,
  tags,
  activeCategories,
  activeTags,
  onCategoryToggle,
  onTagToggle,
  onCategoryDelete,
  onTagDelete,
}: FiltersProps) {
  return (
    <div className="glass-card border-border/20 rounded-xl p-4 lg:p-6 space-y-6 mb-6 lg:mb-8 shadow-lg hover:shadow-xl transition-all duration-500 animate-slide-up relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-3 -left-3 w-16 h-16 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-primary/10 rounded-full blur-xl" />

      <div className="relative z-10">
        <FilterSection
          title="Categories"
          items={categories}
          activeItems={activeCategories}
          onToggle={onCategoryToggle}
          onDelete={onCategoryDelete}
          variant="category"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-4">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/50" />
            </div>
          </div>
        </div>

        <FilterSection
          title="Tags"
          items={tags}
          activeItems={activeTags}
          onToggle={onTagToggle}
          onDelete={onTagDelete}
          variant="tag"
        />
      </div>
    </div>
  );
}
