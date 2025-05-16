
// Define BatchItem types for translation batches
export type BatchItemTable = 
  | "unit_data" 
  | "factions" 
  | "unit_keywords" 
  | "special_rules" 
  | "unit_characteristics" 
  | "rules_chapters" 
  | "rules_sections"
  | "faqs"
  | "faq_sections"
  | "news_items";

export interface BatchItem {
  id: string;
  text: string;
  targetField: string;
  table: BatchItemTable;
}
