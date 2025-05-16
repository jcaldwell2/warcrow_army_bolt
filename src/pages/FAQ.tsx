
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Container } from '@/components/ui/custom';
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FAQList } from '@/components/faq/FAQList';
import { FAQSearch } from '@/components/faq/FAQSearch';
import { fetchFAQSections, FAQSection } from '@/services/faqService';
import { useUnifiedSearch } from '@/contexts/UnifiedSearchContext';
import { SearchProvider } from "@/contexts/SearchContext";

interface FAQProps {
  showHeader?: boolean;
}

const FAQ: React.FC<FAQProps> = ({ showHeader = true }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm: unifiedSearchTerm, setSearchTerm: setUnifiedSearchTerm, searchInRules, searchResults } = useUnifiedSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqSections, setFaqSections] = useState<FAQSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the search query from the unified search context
  useEffect(() => {
    if (unifiedSearchTerm) {
      setSearchQuery(unifiedSearchTerm);
    }
  }, [unifiedSearchTerm]);
  
  // Update unified search when local search changes
  useEffect(() => {
    setUnifiedSearchTerm(searchQuery);
  }, [searchQuery, setUnifiedSearchTerm]);

  useEffect(() => {
    const loadFAQSections = async () => {
      setLoading(true);
      try {
        const sections = await fetchFAQSections(language);
        
        // Log the sections for debugging
        console.log(`FAQ: Loaded ${sections.length} sections with language ${language}`);
        if (sections.length > 0) {
          console.log('First FAQ section:', {
            id: sections[0].id,
            section: sections[0].section,
            section_es: sections[0].section_es,
            section_fr: sections[0].section_fr
          });
        }
        
        setFaqSections(sections);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch FAQ sections:', err);
        setError('Failed to load FAQ data');
      } finally {
        setLoading(false);
      }
    };
    
    loadFAQSections();
  }, [language]);

  // Check if there's a search term in the location state
  useEffect(() => {
    const state = location.state as { searchTerm?: string } | null;
    if (state?.searchTerm) {
      setSearchQuery(state.searchTerm);
    }
  }, [location.state]);

  // Filter sections based on search query
  const filteredSections = searchQuery.trim() 
    ? faqSections.filter(section => {
        // Get the appropriate language content for searching
        const sectionText = language === 'es' && section.section_es ? section.section_es : 
                           (language === 'fr' && section.section_fr ? section.section_fr : section.section);
        const contentText = language === 'es' && section.content_es ? section.content_es :
                           (language === 'fr' && section.content_fr ? section.content_fr : section.content);
                           
        // Search in both section title and content
        return sectionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
               contentText.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : faqSections;

  // If we're showing this component in a tab, we don't need the full page wrapper
  if (!showHeader) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <SearchProvider>
          {/* Search Component */}
          <FAQSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            resultsCount={filteredSections.length}
          />
          
          {searchQuery && (
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={searchInRules}
                className="text-xs border-warcrow-gold/40 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                {t("searchInRules")}
              </Button>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-warcrow-gold">{t('loading')}</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            <FAQList items={filteredSections} />
          )}
        </SearchProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={t('faqTitle')}>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/rules')}
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-accent/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <LanguageSwitcher />
        </div>
      </PageHeader>
      
      <Container className="py-8">
        <div className="max-w-3xl mx-auto">
          <SearchProvider>
            {/* Search Component */}
            <FAQSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              resultsCount={filteredSections.length}
            />
            
            {searchQuery && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchInRules}
                  className="text-xs border-warcrow-gold/40 text-warcrow-gold hover:bg-warcrow-gold/10"
                >
                  <BookOpen className="mr-1 h-3 w-3" />
                  {t("searchInRules")}
                </Button>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-pulse text-warcrow-gold">{t('loading')}</div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : (
              <FAQList items={filteredSections} />
            )}
          </SearchProvider>
        </div>
      </Container>
      <ScrollToTopButton />
    </div>
  );
};

export default FAQ;
