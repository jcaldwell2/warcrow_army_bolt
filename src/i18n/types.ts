
export type Translation = {
  en: string;
  es: string;
  fr: string;  // Ensuring French is required in the type
};

export type TranslationsType = {
  [key: string]: Translation;
};
