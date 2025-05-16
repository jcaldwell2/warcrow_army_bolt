
import React from 'react';
import { ListChecks, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ChapterData, type SectionData, type TranslationStatusSummary } from './types';

interface TranslationsTabProps {
  isLoading: boolean;
  chapters: ChapterData[];
  sections: SectionData[];
  stats: TranslationStatusSummary;
}

export const TranslationsTab: React.FC<TranslationsTabProps> = ({
  isLoading,
  chapters,
  sections,
  stats,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-warcrow-gold/30 bg-black">
          <h3 className="text-warcrow-gold font-medium mb-2">Chapter Translations</h3>
          <p className="text-2xl font-bold text-warcrow-text">
            {stats.chaptersWithTitle}/{stats.totalChapters}
            <span className="text-sm ml-2 font-normal">
              ({stats.chapterCompletionRate}%)
            </span>
          </p>
        </Card>
        
        <Card className="p-4 border border-warcrow-gold/30 bg-black">
          <h3 className="text-warcrow-gold font-medium mb-2">Section Titles</h3>
          <p className="text-2xl font-bold text-warcrow-text">
            {stats.sectionsWithTitle}/{stats.totalSections}
            <span className="text-sm ml-2 font-normal">
              ({stats.sectionTitleCompletionRate}%)
            </span>
          </p>
        </Card>
        
        <Card className="p-4 border border-warcrow-gold/30 bg-black">
          <h3 className="text-warcrow-gold font-medium mb-2">Section Content</h3>
          <p className="text-2xl font-bold text-warcrow-text">
            {stats.sectionsWithContent}/{stats.totalSections}
            <span className="text-sm ml-2 font-normal">
              ({stats.sectionContentCompletionRate}%)
            </span>
          </p>
        </Card>
      </div>
      
      <ScrollArea className="h-[350px] rounded-md border border-warcrow-gold/20 p-4">
        <div className="space-y-4">
          <h3 className="text-warcrow-gold font-medium flex items-center">
            <ListChecks className="h-4 w-4 mr-2" />
            Translation Status Details
          </h3>
          
          <h4 className="text-warcrow-gold/80 text-sm mt-4 mb-2">Chapters</h4>
          <div className="space-y-2">
            {chapters.map(chapter => (
              <div key={chapter.id} className="flex items-center justify-between p-2 border border-warcrow-gold/20 rounded-md">
                <div>
                  <p className="font-medium">{chapter.title}</p>
                  <p className="text-sm text-warcrow-text/60">
                    {chapter.title_es || "No translation"}
                  </p>
                </div>
                {chapter.title_es ? (
                  <Badge className="bg-green-600">Translated</Badge>
                ) : (
                  <Badge className="bg-red-600">Missing</Badge>
                )}
              </div>
            ))}
          </div>
          
          <h4 className="text-warcrow-gold/80 text-sm mt-4 mb-2">Sections</h4>
          <div className="space-y-2">
            {sections.map(section => (
              <div key={section.id} className="flex items-center justify-between p-2 border border-warcrow-gold/20 rounded-md">
                <div className="flex-1">
                  <p className="font-medium">{section.title}</p>
                  <p className="text-sm text-warcrow-text/60">
                    {section.title_es || "No translation"} 
                    {section.content_es ? 
                      <span className="text-green-500 ml-2">• Content available</span> : 
                      <span className="text-red-500 ml-2">• No content</span>
                    }
                  </p>
                </div>
                {section.title_es && section.content_es ? (
                  <Badge className="bg-green-600">Complete</Badge>
                ) : section.title_es || section.content_es ? (
                  <Badge className="bg-amber-600">Partial</Badge>
                ) : (
                  <Badge className="bg-red-600">Missing</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
};
