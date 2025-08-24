"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { PromptCard } from "@/components/PromptCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CreatePromptDialog } from "@/components/CreatePromptDialog";
import { Button } from "@/components/ui/button";
import { PromptBoxData, PromptCard as PromptCardType, CategoryType, TagType } from "@/types/promptbox";
import { toast } from "sonner";

// Initial data based on the provided JSON structure
const initialPromptBoxData: PromptBoxData = {
  app: "PromptBox",
  header: {
    title: "PROMPTBOX",
    search: {
      placeholder: "Search",
      icon: "search-icon",
      profileIcon: true
    }
  },
  filters: {
    categories: [
      "ALL",
      "vibe",
      "artist",
      "writing",
      "frontend",
      "backend"
    ],
    tags: [
      "ALL",
      "chatgpt",
      "super",
      "prompt",
      "work",
      "vit"
    ]
  },
  promptCards: [
    {
      title: "Creative Writing Assistant",
      description: "A powerful prompt for generating creative stories, poems, and artistic content with vivid imagery and compelling narratives.",
      rating: 4,
      tags: ["chatgpt", "prompt", "work"],
      categories: ["writing", "vibe"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    },
    {
      title: "Frontend Code Generator",
      description: "Generate modern React components with TypeScript, Tailwind CSS, and best practices for responsive design.",
      rating: 5,
      tags: ["super", "work", "vit"],
      categories: ["frontend"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    },
    {
      title: "Backend API Designer",
      description: "Create robust REST APIs with proper authentication, validation, and documentation following industry standards.",
      rating: 4,
      tags: ["work", "super"],
      categories: ["backend"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    },
    {
      title: "Digital Art Concept",
      description: "Generate detailed prompts for AI art generation with specific styles, lighting, and composition instructions.",
      rating: 3,
      tags: ["prompt", "vit"],
      categories: ["artist", "vibe"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    },
    {
      title: "Productivity Workflow",
      description: "Optimize your daily workflow with smart automation suggestions and time management strategies.",
      rating: 5,
      tags: ["work", "super"],
      categories: ["vibe"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    },
    {
      title: "Code Review Assistant",
      description: "Comprehensive code review prompts that check for security, performance, and maintainability issues.",
      rating: 4,
      tags: ["chatgpt", "work"],
      categories: ["frontend", "backend"],
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    }
  ]
};

export default function PromptBox() {
  const [promptBoxData, setPromptBoxData] = useState<PromptBoxData>(initialPromptBoxData);
  const [searchValue, setSearchValue] = useState("");
  const [activeCategories, setActiveCategories] = useState<CategoryType[]>(["ALL"]);
  const [activeTags, setActiveTags] = useState<TagType[]>(["ALL"]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<PromptCardType | null>(null);
  const [deletingCard, setDeletingCard] = useState<PromptCardType | null>(null);

  const handleCategoryToggle = (category: CategoryType) => {
    if (category === "ALL") {
      setActiveCategories(["ALL"]);
    } else {
      setActiveCategories(prev => {
        const filtered = prev.filter(c => c !== "ALL");
        if (prev.includes(category)) {
          const newCategories = filtered.filter(c => c !== category);
          return newCategories.length === 0 ? ["ALL"] : newCategories;
        } else {
          return [...filtered, category];
        }
      });
    }
  };

  const handleTagToggle = (tag: TagType) => {
    if (tag === "ALL") {
      setActiveTags(["ALL"]);
    } else {
      setActiveTags(prev => {
        const filtered = prev.filter(t => t !== "ALL");
        if (prev.includes(tag)) {
          const newTags = filtered.filter(t => t !== tag);
          return newTags.length === 0 ? ["ALL"] : newTags;
        } else {
          return [...filtered, tag];
        }
      });
    }
  };

  const filteredCards = useMemo(() => {
    return promptBoxData.promptCards.filter(card => {
      // Search filter
      const matchesSearch = searchValue === "" || 
        card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        card.description.toLowerCase().includes(searchValue.toLowerCase());

      // Category filter
      const matchesCategory = activeCategories.includes("ALL") ||
        card.categories.some(category => activeCategories.includes(category));

      // Tag filter
      const matchesTag = activeTags.includes("ALL") ||
        card.tags.some(tag => activeTags.includes(tag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchValue, activeCategories, activeTags, promptBoxData.promptCards]);

  // Copy prompt content to clipboard
  const handleCopyPrompt = async (card: PromptCardType) => {
    try {
      const promptText = `Title: ${card.title}\n\nDescription: ${card.description}\n\nRating: ${card.rating}/5\n\nCategories: ${card.categories.join(", ")}\n\nTags: ${card.tags.join(", ")}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText);
        toast.success(`Prompt "${card.title}" copied to clipboard!`);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success(`Prompt "${card.title}" copied to clipboard!`);
        } catch (copyErr) {
          console.error('Fallback copy failed:', copyErr);
          toast.error("Failed to copy prompt to clipboard");
        }
        document.body.removeChild(textArea);
      }
    } catch (clipboardErr) {
      console.error('Clipboard operation failed:', clipboardErr);
      toast.error("Failed to copy prompt to clipboard");
    }
  };

  // Edit prompt
  const handleEditPrompt = (card: PromptCardType) => {
    setEditingCard(card);
    setIsCreateDialogOpen(true);
  };

  // Share prompt
  const handleSharePrompt = async (card: PromptCardType) => {
    const shareData = {
      title: `PromptBox: ${card.title}`,
      text: card.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(`Prompt "${card.title}" shared successfully!`);
      } else {
        // Fallback: copy share text to clipboard
        const shareText = `Check out this prompt: "${card.title}"\n\n${card.description}\n\nView more at: ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        toast.success(`Share link copied to clipboard!`);
      }
    } catch (shareErr) {
      console.error('Share operation failed:', shareErr);
      toast.error("Failed to share prompt");
    }
  };

  // Delete prompt
  const handleDeletePrompt = (card: PromptCardType) => {
    setDeletingCard(card);
  };

  const confirmDelete = () => {
    if (deletingCard) {
      setPromptBoxData(prev => {
        const newCards = prev.promptCards.filter(p => 
          !(p.title === deletingCard.title && p.description === deletingCard.description)
        );
        return {
          ...prev,
          promptCards: newCards
        };
      });
      toast.success(`Prompt "${deletingCard.title}" deleted successfully!`);
      setDeletingCard(null);
    }
  };

  const cancelDelete = () => {
    setDeletingCard(null);
  };

  const handleCreatePrompt = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveNewPrompt = (newPrompt: Omit<PromptCardType, "actions">) => {
    const promptWithActions: PromptCardType = {
      ...newPrompt,
      actions: {
        edit: true,
        delete: true,
        share: true,
        copy: true
      }
    };

    if (editingCard) {
      // Update existing prompt
      setPromptBoxData(prev => ({
        ...prev,
        promptCards: prev.promptCards.map(p => 
          p.title === editingCard.title && p.description === editingCard.description
            ? promptWithActions
            : p
        )
      }));
      toast.success(`Prompt "${newPrompt.title}" updated successfully!`);
      setEditingCard(null);
    } else {
      // Create new prompt
      setPromptBoxData(prev => ({
        ...prev,
        promptCards: [...prev.promptCards, promptWithActions]
      }));
      toast.success(`New prompt "${newPrompt.title}" created successfully!`);
    }
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Enhanced background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
          {/* Enhanced Header */}
          <div className="animate-fade-in">
            <Header
              config={promptBoxData.header}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          
          {/* Enhanced Filters */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Filters
              categories={promptBoxData.filters.categories}
              tags={promptBoxData.filters.tags}
              activeCategories={activeCategories}
              activeTags={activeTags}
              onCategoryToggle={handleCategoryToggle}
              onTagToggle={handleTagToggle}
            />
          </div>

          {/* Enhanced Results section */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-lg p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      <span className="text-primary">{filteredCards.length}</span> {filteredCards.length === 1 ? 'Prompt' : 'Prompts'} Found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Showing results from {promptBoxData.promptCards.length} total prompts
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Collection
                  </div>
                  <div className="text-2xl font-bold text-gradient-primary">
                    {promptBoxData.promptCards.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Prompt Cards Grid */}
          {filteredCards.length > 0 ? (
            <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 pb-16">
                {filteredCards.map((card, index) => (
                  <div 
                    key={`${card.title}-${card.description.slice(0, 50)}-${index}`}
                    className="animate-fade-in hover-lift"
                    style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
                  >
                    <PromptCard
                      card={card}
                      onEdit={handleEditPrompt}
                      onDelete={handleDeletePrompt}
                      onShare={handleSharePrompt}
                      onCopy={handleCopyPrompt}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col items-center justify-center py-14 text-center relative">
                {/* Enhanced empty state */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-2xl" />
                  <div className="relative glass rounded-xl p-6 backdrop-blur-md">
                    <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-4 mb-4 inline-block">
                      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      No prompts found
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-4">
                      Try adjusting your search criteria or create a new prompt to get started on your AI journey.
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
      
      {/* Enhanced Floating Action Button */}
      <FloatingActionButton onClick={handleCreatePrompt} />
      
      <CreatePromptDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveNewPrompt}
        availableCategories={promptBoxData.filters.categories}
        availableTags={promptBoxData.filters.tags}
        editingPrompt={editingCard}
      />
      
      {/* Enhanced Delete Confirmation Dialog */}
      {deletingCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-md animate-fade-in">
          <div className="glass-card border-border/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
                <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Delete Prompt
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-foreground">&ldquo;{deletingCard.title}&rdquo;</span>? This action cannot be undone.
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
