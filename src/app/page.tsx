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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
        <Header
          config={promptBoxData.header}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        
        <Filters
          categories={promptBoxData.filters.categories}
          tags={promptBoxData.filters.tags}
          activeCategories={activeCategories}
          activeTags={activeTags}
          onCategoryToggle={handleCategoryToggle}
          onTagToggle={handleTagToggle}
        />

        {/* Results count */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredCards.length}</span> {filteredCards.length === 1 ? 'prompt' : 'prompts'} found
            </p>
            <div className="text-xs text-muted-foreground">
              Total: {promptBoxData.promptCards.length} prompts
            </div>
          </div>
        </div>

        {/* Prompt Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 pb-20">
            {filteredCards.map((card, index) => (
              <PromptCard
                key={`${card.title}-${card.description.slice(0, 50)}-${index}`}
                card={card}
                onEdit={handleEditPrompt}
                onDelete={handleDeletePrompt}
                onShare={handleSharePrompt}
                onCopy={handleCopyPrompt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/50 p-4 mb-3">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-foreground mb-2">
              No prompts found
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Try adjusting your search criteria or create a new prompt to get started.
            </p>
          </div>
        )}
      </div>
      
      <FloatingActionButton onClick={handleCreatePrompt} />
      
      <CreatePromptDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveNewPrompt}
        availableCategories={promptBoxData.filters.categories}
        availableTags={promptBoxData.filters.tags}
        editingPrompt={editingCard}
      />
      
      {/* Delete Confirmation Dialog */}
      {deletingCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md mx-4 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Prompt
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete &quot;<span className="font-medium text-foreground">{deletingCard.title}</span>&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
