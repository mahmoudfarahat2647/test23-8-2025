export interface PromptCard {
  title: string;
  description: string;
  rating: number;
  tags: string[];
  categories: string[];
  actions: {
    edit: boolean;
    delete: boolean;
    share: boolean;
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