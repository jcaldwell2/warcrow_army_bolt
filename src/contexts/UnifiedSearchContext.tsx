
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFAQSections, FAQSection } from '@/services/faqService';
import { useRules } from "@/hooks/useRules";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResultItem {
  id: string;
  title: string;
  content: string;
  source: "rules" | "faq";
  path: string;
}

interface UnifiedSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchInRules: () => void;
  searchInFAQ: () => void;
  performUnifiedSearch: (term: string) => Promise<void>;
}

const UnifiedSearchContext = createContext<UnifiedSearchContextType | undefined>(undefined);

export const UnifiedSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("rules");
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { data: rulesData } = useRules();

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname === "/faq") {
      setActiveTab("faq");
    } else if (location.pathname === "/rules") {
      setActiveTab("rules");
    }
  }, [location.pathname]);

  // Perform search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      performUnifiedSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, language]);

  const searchInRules = () => {
    if (activeTab !== "rules") {
      navigate("/rules", { state: { searchTerm } });
    }
  };

  const searchInFAQ = () => {
    if (activeTab !== "faq") {
      navigate("/faq", { state: { searchTerm } });
    }
  };

  const performUnifiedSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    const results: SearchResultItem[] = [];

    try {
      // Search in FAQ
      const faqData = await fetchFAQSections(language);
      
      // Get the content in the appropriate language
      const faqResults = faqData.filter(item => {
        const sectionText = getLocalizedText(item.section, item.section_es, item.section_fr, language);
        const contentText = getLocalizedText(item.content, item.content_es, item.content_fr, language);
                           
        return sectionText.toLowerCase().includes(term.toLowerCase()) || 
               contentText.toLowerCase().includes(term.toLowerCase());
      }).map(item => {
        // Use translated content if available
        const sectionText = getLocalizedText(item.section, item.section_es, item.section_fr, language);
        const contentText = getLocalizedText(item.content, item.content_es, item.content_fr, language);
                           
        return {
          id: item.id,
          title: sectionText,
          content: contentText,
          source: "faq" as const,
          path: "/faq"
        };
      });
      
      results.push(...faqResults);

      // Search in Rules
      if (rulesData) {
        const rulesResults: SearchResultItem[] = [];
        
        // Helper function to recursively search through rules sections
        const searchInSections = (sections: any[], path: string = "/rules") => {
          sections.forEach(section => {
            // Get the appropriate language content
            const sectionTitle = getLocalizedText(section.title, section.title_es, section.title_fr, language);
            const sectionContent = getLocalizedText(section.content, section.content_es, section.content_fr, language);
            
            if (sectionTitle.toLowerCase().includes(term.toLowerCase()) || 
                sectionContent.toLowerCase().includes(term.toLowerCase())) {
              rulesResults.push({
                id: section.id || `rules-${rulesResults.length}`,
                title: sectionTitle,
                content: sectionContent,
                source: "rules" as const,
                path
              });
            }
            
            // Search in subsections
            if (section.sections && section.sections.length > 0) {
              searchInSections(section.sections, path);
            }
          });
        };
        
        rulesData.forEach(chapter => {
          if (chapter.sections) {
            searchInSections(chapter.sections);
          }
        });
        
        results.push(...rulesResults);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing unified search:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Helper function to get the localized text based on language
  const getLocalizedText = (en: string, es: string | null | undefined, fr: string | null | undefined, lang: string): string => {
    if (lang === 'es' && es) {
      return es;
    } else if (lang === 'fr' && fr) {
      return fr;
    }
    return en || '';
  };

  return (
    <UnifiedSearchContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      searchResults,
      isSearching,
      activeTab,
      setActiveTab,
      searchInRules,
      searchInFAQ,
      performUnifiedSearch
    }}>
      {children}
    </UnifiedSearchContext.Provider>
  );
};

export const useUnifiedSearch = () => {
  const context = useContext(UnifiedSearchContext);
  if (!context) {
    throw new Error("useUnifiedSearch must be used within a UnifiedSearchProvider");
  }
  return context;
};
