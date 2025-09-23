'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Filters } from '@/components/Filters';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Header } from '@/components/Header';
import { PromptCard } from '@/components/PromptCard';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { cn } from '@/lib/utils';
import type {
  CategoryType,
  PromptBoxData,
  PromptCard as PromptCardType,
  TagType,
} from '@/types/promptbox';

// Load data from localStorage or use initial data
const loadInitialData = (): PromptBoxData => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('promptBoxData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure the parsed data has the correct structure
        if (parsedData?.promptCards && parsedData.filters) {
          // Clean up unused categories and tags
          const allCategories = new Set<string>(['ALL']);
          const allTags = new Set<string>(['ALL']);
          
          // Collect all categories and tags from all prompts
          parsedData.promptCards.forEach((card: any) => {
            card.categories.forEach((cat: string) => allCategories.add(cat));
            card.tags.forEach((tag: string) => allTags.add(tag));
          });
          
          // Update filters to only include categories and tags that are actually used
          const cleanedData: PromptBoxData = {
            ...parsedData,
            filters: {
              categories: Array.from(allCategories),
              tags: Array.from(allTags),
            },
          };
          
          return cleanedData;
        }
      } catch (_error) {}
    }
  }

  // Start with empty data structure for a clean slate
  return {
    app: 'PromptBox',
    header: {
      title: 'PROMPTBOX',
      search: {
        placeholder: 'Search',
        icon: 'search-icon',
        profileIcon: true,
      },
    },
    filters: {
      categories: ['ALL'],
      tags: ['ALL'],
    },
    promptCards: [],
  };
};

export default function PromptBox() {
  const router = useRouter();
  const { optimizedFilter } = usePerformanceOptimization();
  const [promptBoxData, setPromptBoxData] = useState<PromptBoxData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeCategories, setActiveCategories] = useState<CategoryType[]>([
    'ALL',
  ]);
  const [activeTags, setActiveTags] = useState<TagType[]>(['ALL']);
  const [deletingCard, setDeletingCard] = useState<PromptCardType | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load data on component mount
  useEffect(() => {
    // Load data immediately without timeout to prevent flash of old data
    const data = loadInitialData();
    setPromptBoxData(data);
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && promptBoxData) {
      try {
        localStorage.setItem('promptBoxData', JSON.stringify(promptBoxData));
      } catch (_error) {}
    }
  }, [promptBoxData]);

  // Listen for new categories and tags from the editor
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Handle cross-tab storage changes
      if (event.key === 'promptEditor_data') {
        processEditorData();
      }
    };

    const processEditorData = () => {
      const editorData = localStorage.getItem('promptEditor_data');
      if (editorData) {
        try {
          const { newCategories, newTags, prompt } = JSON.parse(editorData);

          // Update the prompt box data with new categories and tags
          setPromptBoxData((prev) => {
            if (!prev) return prev;

            // Merge new categories and tags with existing ones
            const updatedCategories = [
              ...new Set([...prev.filters.categories, ...newCategories]),
            ];
            const updatedTags = [
              ...new Set([...prev.filters.tags, ...newTags]),
            ];

            // Handle prompt creation/update
            let updatedPrompts = [...prev.promptCards];
            const existingPromptIndex = prev.promptCards.findIndex(
              (p) => p.id === prompt.id,
            );

            if (existingPromptIndex !== -1) {
              // Update existing prompt
              updatedPrompts[existingPromptIndex] = {
                ...prompt,
                pinned: prev.promptCards[existingPromptIndex].pinned, // Preserve pinned state
                actions: { edit: true, delete: true, copy: true },
              };
            } else {
              // Add new prompt
              const newPrompt = {
                ...prompt,
                id: prompt.id || `new-prompt-${Date.now()}`,
                pinned: false, // New prompts are not pinned by default
                actions: { edit: true, delete: true, copy: true },
              };
              updatedPrompts = [...prev.promptCards, newPrompt];
            }

            // Clean up unused categories and tags
            const allCategories = new Set<string>();
            const allTags = new Set<string>();
            
            // Collect all categories and tags from all prompts
            updatedPrompts.forEach((card) => {
              card.categories.forEach((cat) => allCategories.add(cat));
              card.tags.forEach((tag) => allTags.add(tag));
            });
            
            // Ensure 'ALL' is always present
            allCategories.add('ALL');
            allTags.add('ALL');

            const updatedData: PromptBoxData = {
              ...prev,
              filters: {
                categories: Array.from(allCategories),
                tags: Array.from(allTags),
              },
              promptCards: updatedPrompts,
            };
            return updatedData;
          });

          // Clear the localStorage after processing
          localStorage.removeItem('promptEditor_data');

          // Show success message
          toast.success('Prompt saved successfully!');
        } catch (_error) {
          toast.error('Failed to process prompt data. Please try again.');
        }
      }
    };

    // Check for data on component mount
    processEditorData();

    // Listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleCategoryToggle = useCallback((category: CategoryType) => {
    if (category === 'ALL') {
      setActiveCategories(['ALL']);
      setActiveTags(['ALL']); // Reset tags when ALL category is selected
    } else {
      setActiveCategories((prev) => {
        const filtered = prev.filter((c) => c !== 'ALL');
        if (prev.includes(category)) {
          const newCategories = filtered.filter((c) => c !== category);
          return newCategories.length === 0 ? ['ALL'] : newCategories;
        } else {
          return [...filtered, category];
        }
      });
    }
  }, []);

  const handleTagToggle = useCallback((tag: TagType) => {
    if (tag === 'ALL') {
      setActiveTags(['ALL']);
    } else {
      setActiveTags((prev) => {
        const filtered = prev.filter((t) => t !== 'ALL');
        if (prev.includes(tag)) {
          const newTags = filtered.filter((t) => t !== tag);
          return newTags.length === 0 ? ['ALL'] : newTags;
        } else {
          return [...filtered, tag];
        }
      });
    }
  }, []);

  const filteredCards = useMemo(() => {
    if (!promptBoxData) return [];

    const filtered = optimizedFilter(promptBoxData.promptCards, (card) => {
      // Search filter
      const matchesSearch =
        searchValue === '' ||
        card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        card.description.toLowerCase().includes(searchValue.toLowerCase());

      // Category filter - if no categories, show in ALL filter
      const matchesCategory =
        activeCategories.includes('ALL') ||
        card.categories.some((category) =>
          activeCategories.includes(category),
        ) ||
        (card.categories.length === 0 && activeCategories.includes('ALL'));

      // Tag filter - if no tags, show in ALL filter
      const matchesTag =
        activeTags.includes('ALL') ||
        card.tags.some((tag) => activeTags.includes(tag)) ||
        (card.tags.length === 0 && activeTags.includes('ALL'));

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort to show pinned items first
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [
    searchValue,
    activeCategories,
    activeTags,
    promptBoxData?.promptCards,
    optimizedFilter,
    promptBoxData,
  ]);

  // Copy prompt content to clipboard
  const handleCopyPrompt = useCallback(async (card: PromptCardType) => {
    try {
      const promptText = card.description;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText);
        toast.success(`Description copied to clipboard!`);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success(`Description copied to clipboard!`);
        } catch {
          // Fallback copy failed - show error to user
          toast.error('Failed to copy description to clipboard');
        }
        document.body.removeChild(textArea);
      }
    } catch {
      // Clipboard operation failed - show error to user
      toast.error('Failed to copy description to clipboard');
    }
  }, []);

  // Edit prompt - navigate to editor
  const handleEditPrompt = useCallback(
    (card: PromptCardType) => {
      if (!promptBoxData) return;

      // Generate a simple ID if the card doesn't have one
      const cardId =
        card.id ||
        card.title.toLowerCase().replace(/\s+/g, '-') ||
        `prompt-${Date.now()}`;

      // Store current filters in localStorage for the editor to access
      localStorage.setItem(
        'promptbox_filters',
        JSON.stringify({
          categories: promptBoxData.filters.categories,
          tags: promptBoxData.filters.tags,
        }),
      );

      router.push(`/editor?id=${encodeURIComponent(cardId)}`);
    },
    [router, promptBoxData],
  );

  // Delete prompt
  const handleDeletePrompt = useCallback((card: PromptCardType) => {
    setDeletingCard(card);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingCard && promptBoxData) {
      setPromptBoxData((prev) => {
        if (!prev) return prev;
        
        // Remove the prompt
        const newCards = prev.promptCards.filter(
          (p) => p.id !== deletingCard.id,
        );
        
        // Find categories and tags that are no longer used
        const allCategories = new Set<string>();
        const allTags = new Set<string>();
        
        // Collect all categories and tags from remaining prompts
        newCards.forEach((card) => {
          card.categories.forEach((cat) => allCategories.add(cat));
          card.tags.forEach((tag) => allTags.add(tag));
        });
        
        // Ensure 'ALL' is always present
        allCategories.add('ALL');
        allTags.add('ALL');
        
        // Update filters to only include categories and tags that are still used
        const updatedData: PromptBoxData = {
          ...prev,
          filters: {
            categories: Array.from(allCategories),
            tags: Array.from(allTags),
          },
          promptCards: newCards,
        };
        return updatedData;
      });
      toast.success(`Prompt "${deletingCard.title}" deleted successfully!`);
      setDeletingCard(null);
    }
  }, [deletingCard, promptBoxData]);

  const cancelDelete = useCallback(() => {
    setDeletingCard(null);
  }, []);

  const handleCreatePrompt = useCallback(() => {
    if (!promptBoxData) return;

    // Store current filters in localStorage for the editor to access
    localStorage.setItem(
      'promptbox_filters',
      JSON.stringify({
        categories: promptBoxData.filters.categories,
        tags: promptBoxData.filters.tags,
      }),
    );

    router.push('/editor');
  }, [router, promptBoxData]);

  // Delete category from filters and remove from all prompts
  const handleCategoryDelete = useCallback(
    (categoryToDelete: CategoryType) => {
      if (categoryToDelete === 'ALL') return; // Prevent deleting 'ALL'
      if (!promptBoxData) return;

      setPromptBoxData((prev) => {
        if (!prev) return prev;
        
        // Remove category from all prompts
        const updatedPrompts = prev.promptCards.map((card) => ({
          ...card,
          categories: card.categories.filter(
            (cat) => cat !== categoryToDelete,
          ),
        }));
        
        // Update filters to remove the category
        const updatedData: PromptBoxData = {
          ...prev,
          filters: {
            ...prev.filters,
            categories: prev.filters.categories.filter(
              (cat) => cat !== categoryToDelete,
            ),
          },
          promptCards: updatedPrompts,
        };
        return updatedData;
      });

      // Remove from active categories if selected
      setActiveCategories((prev) =>
        prev.filter((cat) => cat !== categoryToDelete),
      );

      toast.success(`Category "${categoryToDelete}" deleted successfully!`);
    },
    [promptBoxData],
  );

  // Delete tag from filters and remove from all prompts
  const handleTagDelete = useCallback(
    (tagToDelete: TagType) => {
      if (tagToDelete === 'ALL') return; // Prevent deleting 'ALL'
      if (!promptBoxData) return;

      setPromptBoxData((prev) => {
        if (!prev) return prev;
        
        // Remove tag from all prompts
        const updatedPrompts = prev.promptCards.map((card) => ({
          ...card,
          tags: card.tags.filter((tag) => tag !== tagToDelete),
        }));
        
        // Update filters to remove the tag
        const updatedData: PromptBoxData = {
          ...prev,
          filters: {
            ...prev.filters,
            tags: prev.filters.tags.filter((tag) => tag !== tagToDelete),
          },
          promptCards: updatedPrompts,
        };
        return updatedData;
      });

      // Remove from active tags if selected
      setActiveTags((prev) => prev.filter((tag) => tag !== tagToDelete));

      toast.success(`Tag "${tagToDelete}" deleted successfully!`);
    },
    [promptBoxData],
  );

  // Pin/unpin prompt
  const handlePinPrompt = useCallback(
    (card: PromptCardType) => {
      if (!promptBoxData) return;

      setPromptBoxData((prev) => {
        if (!prev) return prev;
        const updatedData: PromptBoxData = {
          ...prev,
          promptCards: prev.promptCards.map((p) =>
            p.id === card.id ? { ...p, pinned: !p.pinned } : p,
          ),
        };
        return updatedData;
      });

      toast.success(
        card.pinned
          ? `Prompt "${card.title}" unpinned successfully!`
          : `Prompt "${card.title}" pinned successfully!`,
      );
    },
    [promptBoxData],
  );

  // Handle stat change for a prompt (using rating values 1=temp, 2=good, 3=excellent)
  const handleStatChange = useCallback(
    (card: PromptCardType, stat: 'temp' | 'good' | 'excellent' | null) => {
      if (!promptBoxData) return;

      // Convert stat to rating value
      let ratingValue = 0;
      switch (stat) {
        case 'temp':
          ratingValue = 1;
          break;
        case 'good':
          ratingValue = 2;
          break;
        case 'excellent':
          ratingValue = 3;
          break;
        default:
          ratingValue = 0;
      }

      setPromptBoxData((prev) => {
        if (!prev) return prev;
        const updatedData: PromptBoxData = {
          ...prev,
          promptCards: prev.promptCards.map((p) =>
            p.id === card.id ? { ...p, rating: ratingValue } : p,
          ),
        };
        return updatedData;
      });

      const statText = stat
        ? stat.charAt(0).toUpperCase() + stat.slice(1)
        : 'None';
      toast.success(`Prompt "${card.title}" stat updated to ${statText}!`);
    },
    [promptBoxData],
  );

  // Show loading state while data is being loaded
  if (isLoading || !promptBoxData) {
    return (
      <div className="min-h-screen bg-gradient-subtle relative overflow-hidden flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden flex h-screen">
      {/* Enhanced background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div
        className="absolute top-1/3 right-1/4 w-56 h-56 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"
        style={{ animationDelay: '4s' }}
      />

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar
          categories={promptBoxData.filters.categories}
          prompts={promptBoxData.promptCards}
          activeCategories={activeCategories}
          activeTags={activeTags}
          onCategoryToggle={handleCategoryToggle}
          onTagToggle={handleTagToggle}
          onCategoryDelete={handleCategoryDelete}
          onTagDelete={handleTagDelete}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-none">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
            {/* Enhanced Header */}
            <div className="animate-fade-in">
              <Header
                config={promptBoxData.header}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filteredCount={filteredCards.length}
                totalCount={promptBoxData.promptCards.length}
              />
            </div>

            {/* Enhanced Filters - Only show on mobile or when sidebar is collapsed */}
            <div
              className={cn(
                'animate-slide-up lg:hidden',
                isSidebarCollapsed && 'lg:block',
              )}
              style={{ animationDelay: '0.2s' }}
            >
              <Filters
                categories={promptBoxData.filters.categories}
                tags={promptBoxData.filters.tags}
                activeCategories={activeCategories}
                activeTags={activeTags}
                onCategoryToggle={handleCategoryToggle}
                onTagToggle={handleTagToggle}
                onCategoryDelete={handleCategoryDelete}
                onTagDelete={handleTagDelete}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 pb-16 max-w-6xl">
            {/* Enhanced Prompt Cards Grid */}
            {filteredCards.length > 0 ? (
              <div
                className="animate-scale-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 pt-4 pb-16">
                  {filteredCards.map((card, index) => (
                    <div
                      key={`${card.title}-${card.description.slice(0, 50)}-${index}`}
                      className="animate-fade-in hover-lift"
                      style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    >
                      <PromptCard
                        card={card}
                        onEdit={handleEditPrompt}
                        onDelete={handleDeletePrompt}
                        onCopy={handleCopyPrompt}
                        onPin={handlePinPrompt}
                        onStatChange={handleStatChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="flex flex-col items-center justify-center py-14 text-center relative">
                  {/* Enhanced empty state */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-2xl" />
                    <div className="relative glass rounded-xl p-6 backdrop-blur-md">
                      <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-4 mb-4 inline-block">
                        <svg
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-label="No prompts found icon"
                          role="img"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        No prompts found
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-4">
                        Try adjusting your search criteria or create a new
                        prompt to get started on your AI journey.
                      </p>
                      <Button
                        onClick={handleCreatePrompt}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        size="lg"
                      >
                        Create Your First Prompt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton onClick={handleCreatePrompt} />

      {/* Enhanced Delete Confirmation Dialog */}
      {deletingCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-md animate-fade-in">
          <div className="glass-card border-border/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Warning icon"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Delete Prompt
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  &ldquo;{deletingCard.title}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="px-6 hover:scale-105 transition-transform duration-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="px-6 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
