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

// Initial data based on the provided JSON structure
const initialPromptBoxData: PromptBoxData = {
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
    categories: ['ALL', 'vibe', 'artist', 'writing', 'frontend', 'backend'],
    tags: ['ALL', 'chatgpt', 'super', 'prompt', 'work', 'vit'],
  },
  promptCards: [
    {
      id: 'creative-writing-assistant',
      title: 'Creative Writing Assistant',
      description:
        'A powerful prompt for generating creative stories, poems, and artistic content with vivid imagery and compelling narratives.',
      rating: 2, // good
      tags: ['chatgpt', 'prompt', 'work'],
      categories: ['writing', 'vibe'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
    {
      id: 'frontend-code-generator',
      title: 'Frontend Code Generator',
      description:
        'Generate modern React components with TypeScript, Tailwind CSS, and best practices for responsive design.',
      rating: 3, // excellent
      tags: ['super', 'work', 'vit'],
      categories: ['frontend'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
    {
      id: 'backend-api-designer',
      title: 'Backend API Designer',
      description:
        'Create robust REST APIs with proper authentication, validation, and documentation following industry standards.',
      rating: 2, // good
      tags: ['work', 'super'],
      categories: ['backend'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
    {
      id: 'digital-art-concept',
      title: 'Digital Art Concept',
      description:
        'Generate detailed prompts for AI art generation with specific styles, lighting, and composition instructions.',
      rating: 1, // temp
      tags: ['prompt', 'vit'],
      categories: ['artist', 'vibe'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
    {
      id: 'productivity-workflow',
      title: 'Productivity Workflow',
      description:
        'Optimize your daily workflow with smart automation suggestions and time management strategies.',
      rating: 3, // excellent
      tags: ['work', 'super'],
      categories: ['vibe'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
    {
      id: 'code-review-assistant',
      title: 'Code Review Assistant',
      description:
        'Comprehensive code review prompts that check for security, performance, and maintainability issues.',
      rating: 2, // good
      tags: ['chatgpt', 'work'],
      categories: ['frontend', 'backend'],
      pinned: false,
      actions: {
        edit: true,
        delete: true,
        copy: true,
      },
    },
  ],
};

export default function PromptBox() {
  const router = useRouter();
  const { optimizedFilter } = usePerformanceOptimization();
  const [promptBoxData, setPromptBoxData] =
    useState<PromptBoxData>(initialPromptBoxData);
  const [searchValue, setSearchValue] = useState('');
  const [activeCategories, setActiveCategories] = useState<CategoryType[]>([
    'ALL',
  ]);
  const [activeTags, setActiveTags] = useState<TagType[]>(['ALL']);
  const [deletingCard, setDeletingCard] = useState<PromptCardType | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for new categories and tags from the editor
  useEffect(() => {
    const handleStorageChange = () => {
      const editorData = localStorage.getItem('promptEditor_data');
      if (editorData) {
        try {
          const { newCategories, newTags, prompt } = JSON.parse(editorData);

          // Update the prompt box data with new categories and tags
          setPromptBoxData((prev) => {
            const updatedCategories = [
              ...new Set([...prev.filters.categories, ...newCategories]),
            ];
            const updatedTags = [
              ...new Set([...prev.filters.tags, ...newTags]),
            ];

            // Handle prompt creation/update
            let updatedPrompts = prev.promptCards;
            if (prompt.id && prev.promptCards.find((p) => p.id === prompt.id)) {
              // Update existing prompt
              updatedPrompts = prev.promptCards.map((p) =>
                p.id === prompt.id
                  ? {
                      ...prompt,
                      pinned: p.pinned, // Preserve pinned state
                      actions: { edit: true, delete: true, copy: true },
                    }
                  : p,
              );
            } else {
              // Add new prompt with generated ID
              const newPrompt = {
                ...prompt,
                id:
                  prompt.id || `new-prompt-${Date.now()}`,
                pinned: false, // New prompts are not pinned by default
                actions: { edit: true, delete: true, copy: true },
              };
              updatedPrompts = [...prev.promptCards, newPrompt];
            }

            return {
              ...prev,
              filters: {
                categories: updatedCategories,
                tags: updatedTags,
              },
              promptCards: updatedPrompts,
            };
          });

          // Clear the localStorage after processing
          localStorage.removeItem('promptEditor_data');

          // Show success message
          if (newCategories.length > 0 || newTags.length > 0) {
            const additions = [];
            if (newCategories.length > 0)
              additions.push(`${newCategories.length} new categories`);
            if (newTags.length > 0)
              additions.push(`${newTags.length} new tags`);
            toast.success(`Added ${additions.join(' and ')} successfully!`);
          }
        } catch (_error) {}
      }
    };

    // Check for data on component mount
    handleStorageChange();

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
    const filtered = optimizedFilter(promptBoxData.promptCards, (card) => {
      // Search filter
      const matchesSearch =
        searchValue === '' ||
        card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        card.description.toLowerCase().includes(searchValue.toLowerCase());

      // Category filter - if no categories, show in ALL filter
      const matchesCategory =
        activeCategories.includes('ALL') ||
        card.categories.some((category) => activeCategories.includes(category)) ||
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
    promptBoxData.promptCards,
    optimizedFilter,
  ]);

  // Map rating value to stat label
  const getStatLabel = (ratingValue: number) => {
    switch (ratingValue) {
      case 1: return 'Temp';
      case 2: return 'Good';
      case 3: return 'Excellent';
      default: return 'N';
    }
  };

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
      // Generate a simple ID if the card doesn't have one
      const cardId = card.id || card.title.toLowerCase().replace(/\s+/g, '-') || `prompt-${Date.now()}`;

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
    [router, promptBoxData.filters],
  );

  // Delete prompt
  const handleDeletePrompt = useCallback((card: PromptCardType) => {
    setDeletingCard(card);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingCard) {
      setPromptBoxData((prev) => {
        const newCards = prev.promptCards.filter(
          (p) => p.id !== deletingCard.id
        );
        return {
          ...prev,
          promptCards: newCards,
        };
      });
      toast.success(`Prompt "${deletingCard.title}" deleted successfully!`);
      setDeletingCard(null);
    }
  }, [deletingCard]);

  const cancelDelete = useCallback(() => {
    setDeletingCard(null);
  }, []);

  const handleCreatePrompt = useCallback(() => {
    // Store current filters in localStorage for the editor to access
    localStorage.setItem(
      'promptbox_filters',
      JSON.stringify({
        categories: promptBoxData.filters.categories,
        tags: promptBoxData.filters.tags,
      }),
    );

    router.push('/editor');
  }, [router, promptBoxData.filters]);

  // Delete category from filters and remove from all prompts
  const handleCategoryDelete = useCallback((categoryToDelete: CategoryType) => {
    if (categoryToDelete === 'ALL') return; // Prevent deleting 'ALL'

    setPromptBoxData((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        categories: prev.filters.categories.filter(
          (cat) => cat !== categoryToDelete,
        ),
      },
      promptCards: prev.promptCards.map((card) => ({
        ...card,
        categories: card.categories.filter((cat) => cat !== categoryToDelete),
      })),
    }));

    // Remove from active categories if selected
    setActiveCategories((prev) =>
      prev.filter((cat) => cat !== categoryToDelete),
    );

    toast.success(`Category "${categoryToDelete}" deleted successfully!`);
  }, []);

  // Delete tag from filters and remove from all prompts
  const handleTagDelete = useCallback((tagToDelete: TagType) => {
    if (tagToDelete === 'ALL') return; // Prevent deleting 'ALL'

    setPromptBoxData((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        tags: prev.filters.tags.filter((tag) => tag !== tagToDelete),
      },
      promptCards: prev.promptCards.map((card) => ({
        ...card,
        tags: card.tags.filter((tag) => tag !== tagToDelete),
      })),
    }));

    // Remove from active tags if selected
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToDelete));

    toast.success(`Tag "${tagToDelete}" deleted successfully!`);
  }, []);

  // Pin/unpin prompt
  const handlePinPrompt = useCallback((card: PromptCardType) => {
    setPromptBoxData((prev) => ({
      ...prev,
      promptCards: prev.promptCards.map((p) =>
        p.id === card.id ? { ...p, pinned: !p.pinned } : p
      ),
    }));

    toast.success(
      card.pinned
        ? `Prompt "${card.title}" unpinned successfully!`
        : `Prompt "${card.title}" pinned successfully!`
    );
  }, []);

  // Handle stat change for a prompt (using rating values 1=temp, 2=good, 3=excellent)
  const handleStatChange = useCallback((card: PromptCardType, stat: 'temp' | 'good' | 'excellent' | null) => {
    // Convert stat to rating value
    let ratingValue = 0;
    switch (stat) {
      case 'temp': ratingValue = 1; break;
      case 'good': ratingValue = 2; break;
      case 'excellent': ratingValue = 3; break;
      default: ratingValue = 0;
    }

    setPromptBoxData((prev) => ({
      ...prev,
      promptCards: prev.promptCards.map((p) =>
        p.id === card.id ? { ...p, rating: ratingValue } : p
      ),
    }));

    const statText = stat ? stat.charAt(0).toUpperCase() + stat.slice(1) : 'None';
    toast.success(`Prompt "${card.title}" stat updated to ${statText}!`);
  }, []);

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
