
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clipboard, MessageSquare, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TextHighlighter } from "./TextHighlighter";
import { useSearch } from "@/contexts/SearchContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Chapter, Section } from "@/hooks/useRules";

interface ChapterNavigationProps {
  chapters: Chapter[];
  selectedSection: Section | null;
  setSelectedSection: (section: Section) => void;
  expandedChapter: string | undefined;
  setExpandedChapter: (chapterId: string | undefined) => void;
}

export const ChapterNavigation = ({
  chapters,
  selectedSection,
  setSelectedSection,
  expandedChapter,
  setExpandedChapter,
}: ChapterNavigationProps) => {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const { searchTerm, caseSensitive, setSearchResults } = useSearch();
  const { t, language } = useLanguage();

  // Log the chapter titles to debug translation issues
  React.useEffect(() => {
    console.log("ChapterNavigation rendered with language:", language);
    console.log("Chapter titles:", chapters.map(c => ({ id: c.id, title: c.title })));
  }, [chapters, language]);

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.sections.length > 0) {
      setSelectedSection(chapter.sections[0]);
      setExpandedChapter(chapter.id);
    }
  };

  const handleCopyText = async (section: Section) => {
    const textToCopy = `${section.title}\n\n${section.content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: t("copiedToClipboard"),
        description: t("sectionTextCopied"),
      });
    } catch (err) {
      toast({
        title: t("failedToCopy"),
        description: t("couldNotCopyText"),
        variant: "destructive",
      });
    }
  };

  const handleDiscordShare = (section: Section) => {
    const text = `${section.title}\n\n${section.content}`;
    const discordUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(text)}`;
    
    window.open(discordUrl, '_blank');
    toast({
      title: t("openingDiscord"),
      description: t("discordOpeningInNewWindow"),
    });
  };

  const isSubsection = (chapterTitle: string, sectionTitle: string) => {
    return chapterTitle === t("prepareTheGame") && !sectionTitle.match(/^\d+\./);
  };

  const filteredChapters = React.useMemo(() => {
    if (!searchTerm) return chapters;

    const filtered = chapters
      .map((chapter) => ({
        ...chapter,
        sections: chapter.sections.filter(
          (section) =>
            (caseSensitive
              ? section.title.includes(searchTerm)
              : section.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (caseSensitive
              ? section.content.includes(searchTerm)
              : section.content.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
      }))
      .filter(
        (chapter) =>
          chapter.sections.length > 0 ||
          (caseSensitive
            ? chapter.title.includes(searchTerm)
            : chapter.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    // Calculate total search results
    const totalResults = filtered.reduce((count, chapter) => {
      return count + chapter.sections.length;
    }, 0);
    
    // Update the search results count in context
    setSearchResults(totalResults);
    
    return filtered;
  }, [chapters, searchTerm, caseSensitive, setSearchResults]);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6 overflow-y-auto" style={{
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      <div className="min-h-full w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          value={expandedChapter}
          onValueChange={setExpandedChapter}
        >
          {filteredChapters.map((chapter) => (
            <AccordionItem 
              key={chapter.id} 
              value={chapter.id}
              className="border-b-0 px-2"
            >
              <AccordionTrigger
                className="text-warcrow-gold hover:text-warcrow-gold/80 hover:no-underline py-3 text-lg font-semibold text-left whitespace-normal break-words pr-8 select-none touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChapterClick(chapter);
                }}
              >
                <TextHighlighter text={chapter.title} />
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pl-4">
                  {chapter.sections.map((section) => (
                    <div key={section.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left py-2 px-3 rounded-md transition-colors whitespace-normal h-auto min-h-[2.5rem] select-none touch-manipulation ${
                          isSubsection(chapter.title, section.title) 
                            ? "pl-8 text-sm" 
                            : ""
                        } ${
                          selectedSection?.id === section.id
                            ? "text-warcrow-gold bg-black/40 font-medium"
                            : "text-warcrow-text hover:text-warcrow-gold hover:bg-black/20"
                        }`}
                        onClick={() => {
                          setSelectedSection(section);
                          setExpandedSection(expandedSection === section.id ? null : section.id);
                        }}
                      >
                        {isSubsection(chapter.title, section.title) && (
                          <ChevronRight className="h-3 w-3 mr-1 inline-block opacity-60" />
                        )}
                        <span className="break-words">
                          <TextHighlighter text={section.title} />
                        </span>
                      </Button>
                      {expandedSection === section.id && (
                        <div className="mt-4 mb-6 px-4 py-3 bg-black/20 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-warcrow-gold">
                              <TextHighlighter text={section.title} />
                            </h3>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopyText(section)}
                                className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
                                title={t("copySectionText")}
                              >
                                <Clipboard className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDiscordShare(section)}
                                className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
                                title={t("shareToDiscord")}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-warcrow-text text-base leading-relaxed whitespace-pre-wrap">
                            <TextHighlighter text={section.content} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};
