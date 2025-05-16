
import * as React from "react";
import { ChapterNavigation } from "@/components/rules/ChapterNavigation";
import { RulesSearch } from "@/components/rules/RulesSearch";
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchProvider } from "@/contexts/SearchContext";
import { useRules } from "@/hooks/useRules";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Section } from "@/hooks/useRules";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import FAQ from "@/pages/FAQ"; // Import the FAQ component
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";

const Rules = () => {
  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);
  const [expandedChapter, setExpandedChapter] = React.useState<string>();
  const { data: chapters = [], isLoading, refetch } = useRules();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("rules");

  // Force refetch when language changes
  React.useEffect(() => {
    console.log("Language changed in Rules page:", language);
    refetch();
  }, [language, refetch]);

  // Log chapters to help with debugging
  React.useEffect(() => {
    if (chapters.length > 0) {
      console.log("Rendered Rules page with chapters:", 
        chapters.slice(0, 3).map(c => ({ 
          id: c.id, 
          title: c.title,
          title_es: c.title_es,
          title_fr: c.title_fr
        }))
      );
    }
  }, [chapters]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "faq") {
      navigate("/faq", { replace: true });
    } else {
      navigate("/rules", { replace: true });
    }
  };

  // Set the active tab based on the current path
  React.useEffect(() => {
    if (location.pathname === "/faq") {
      setActiveTab("faq");
    } else {
      setActiveTab("rules");
    }
  }, [location.pathname]);

  if (isLoading) {
    return <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
      <div className="text-warcrow-gold text-xl">{t('loading')}</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={activeTab === "rules" ? t('rulesTitle') : t('faqTitle')}>
        <LanguageSwitcher />
      </PageHeader>
      <div className="container max-w-7xl mx-auto py-4 px-4">
        <UnifiedSearchProvider>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-black/70 border border-warcrow-gold/30">
              <TabsTrigger 
                value="rules"
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:shadow-none text-warcrow-text"
              >
                {t('rulesTitle')}
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:shadow-none text-warcrow-text"
              >
                {t('faqTitle')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rules" className="mt-0">
              <SearchProvider>
                <RulesSearch />
                <ChapterNavigation
                  chapters={chapters}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  expandedChapter={expandedChapter}
                  setExpandedChapter={setExpandedChapter}
                />
              </SearchProvider>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-0 w-full">
              <div className="w-full max-w-3xl mx-auto">
                <FAQ showHeader={false} />
              </div>
            </TabsContent>
          </Tabs>
        </UnifiedSearchProvider>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Rules;
