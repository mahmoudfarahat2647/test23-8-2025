export interface PromptCard {
  id?: string;
  title: string;
  description: string;
  content?: string; // Markdown content for full editor
  exampleContent?: string; // Markdown content for example usage
  rating: number;
  tags: string[];
  categories: string[];
  pinned?: boolean; // Add pinned property
  actions: {
    edit: boolean;
    delete: boolean;
    copy: boolean;
  };
}

export interface HeaderConfig {
  title: string;
  search: {
    placeholder: string;
    icon: string;
    profileIcon: boolean;
  };
}

export interface FiltersConfig {
  categories: string[];
  tags: string[];
}

export interface PromptBoxData {
  app: string;
  header: HeaderConfig;
  filters: FiltersConfig;
  promptCards: PromptCard[];
}

export type CategoryType = string;
export type TagType = string;