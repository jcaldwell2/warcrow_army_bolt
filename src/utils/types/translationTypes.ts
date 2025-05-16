
export interface TranslationItem {
  text: string;
  targetLang: string;
}

export interface TranslatedText extends TranslationItem {
  translation: string;
}

// Additional interfaces for admin components
export interface AdminTranslationItem {
  id: string;
  key: string;
  source: string;
  text?: string;
  targetLang?: string;
}

export interface AdminTranslatedText extends AdminTranslationItem {
  translation: string;
}
