
export type ChapterData = {
  id: string;
  title: string;
  title_es: string | null;
  title_fr?: string | null;
  order_index: number;
  sectionCount: number;
  translationComplete: boolean;
};

export type SectionData = {
  id: string;
  chapter_id: string;
  title: string;
  title_es: string | null;
  title_fr?: string | null;
  order_index: number;
  content: string;
  content_es: string | null;
  content_fr?: string | null;
  mission_details?: string | null;
  translationComplete: boolean;
};

export type TranslationStatus = {
  content_type: string;
  item_id: string;
  english_title: string;
  spanish_title: string | null;
  has_spanish_title: boolean;
  has_spanish_content: boolean;
};

export type EditingItem = {
  id: string;
  type: 'chapter' | 'section';
  title: string;
  title_es: string;
  title_fr?: string;
  content?: string;
  content_es?: string;
  content_fr?: string;
};

export type TranslationStatusSummary = {
  totalChapters: number;
  chaptersWithTitle: number;
  totalSections: number;
  sectionsWithTitle: number;
  sectionsWithContent: number;
  chapterCompletionRate: number;
  sectionTitleCompletionRate: number;
  sectionContentCompletionRate: number;
};
