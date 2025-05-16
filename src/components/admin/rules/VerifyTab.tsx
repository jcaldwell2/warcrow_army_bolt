
import React from 'react';
import { AlertTriangle, CheckCircle, Edit, RefreshCw, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ChapterData, type SectionData } from './types';

interface VerifyTabProps {
  isLoading: boolean;
  missingTranslations: SectionData[];
  chapters: ChapterData[];
  handleEditTranslation: (item: SectionData, type: 'chapter' | 'section') => void;
}

export const VerifyTab: React.FC<VerifyTabProps> = ({
  isLoading,
  missingTranslations,
  chapters,
  handleEditTranslation,
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
      <div className="mb-4">
        <Card className="p-4 border border-warcrow-gold/30 bg-black">
          <h3 className="text-warcrow-gold font-medium mb-2">Missing Translations</h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-warcrow-text">
              {missingTranslations.length} sections need translation
            </p>
            {missingTranslations.length === 0 && (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
          </div>
        </Card>
      </div>

      <ScrollArea className="h-[350px] rounded-md">
        {missingTranslations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-warcrow-gold/20">
                <TableHead className="text-warcrow-gold/80">Chapter</TableHead>
                <TableHead className="text-warcrow-gold/80">Section</TableHead>
                <TableHead className="text-warcrow-gold/80">Missing</TableHead>
                <TableHead className="text-warcrow-gold/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missingTranslations.map(section => {
                const chapter = chapters.find(c => c.id === section.chapter_id);
                const missingTitle = !section.title_es || section.title_es.trim() === '';
                const missingContent = !section.content_es || section.content_es.trim() === '';
                
                return (
                  <TableRow key={section.id} className="border-warcrow-gold/20">
                    <TableCell>{chapter?.title || "Unknown"}</TableCell>
                    <TableCell className="font-medium text-warcrow-gold">{section.title}</TableCell>
                    <TableCell>
                      {missingTitle && missingContent ? (
                        <Badge variant="destructive">Title & Content</Badge>
                      ) : missingTitle ? (
                        <Badge variant="destructive">Title</Badge>
                      ) : (
                        <Badge variant="destructive">Content</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-warcrow-gold/30 text-warcrow-gold"
                        onClick={() => handleEditTranslation(section, 'section')}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Translate
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-warcrow-gold text-xl font-medium">All sections translated!</p>
            <p className="text-warcrow-text/60">Spanish translations are complete for all rules content.</p>
          </div>
        )}
      </ScrollArea>
    </>
  );
};
