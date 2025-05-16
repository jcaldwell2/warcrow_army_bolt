
import React from 'react';
import { AlertTriangle, Check, Edit, Plus, RefreshCw, Trash, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChapterData } from './types';

interface ChaptersTabProps {
  isLoading: boolean;
  filteredChapters: ChapterData[];
  handleEditTranslation: (item: ChapterData, type: 'chapter' | 'section') => void;
  verificationLanguage: 'es' | 'fr';
  handleDeleteItem?: (item: ChapterData, type: 'chapter' | 'section') => void;
  showAddDialog?: (type: 'chapter' | 'section') => void;
}

export const ChaptersTab: React.FC<ChaptersTabProps> = ({
  isLoading,
  filteredChapters,
  handleEditTranslation,
  verificationLanguage,
  handleDeleteItem,
  showAddDialog
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
      <div className="mb-4 flex justify-between items-center">
        <p className="text-white text-sm">
          Found {filteredChapters.length} chapters
        </p>
        {showAddDialog && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => showAddDialog('chapter')}
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        )}
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="border-warcrow-gold/20">
              <TableHead className="text-warcrow-gold/80">Order</TableHead>
              <TableHead className="text-warcrow-gold/80">Chapter Title (EN)</TableHead>
              <TableHead className="text-warcrow-gold/80">
                {verificationLanguage === 'es' ? 'Spanish Title' : 'French Title'}
              </TableHead>
              <TableHead className="text-warcrow-gold/80">Sections</TableHead>
              <TableHead className="text-warcrow-gold/80">Status</TableHead>
              <TableHead className="text-warcrow-gold/80">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => {
                // Get the appropriate title based on verification language
                const translatedTitle = verificationLanguage === 'es' 
                  ? chapter.title_es 
                  : chapter.title_fr;
                
                const hasTranslation = translatedTitle !== null && translatedTitle !== undefined;
                
                return (
                  <TableRow key={chapter.id} className="border-warcrow-gold/20">
                    <TableCell className="font-medium text-white">{chapter.order_index}</TableCell>
                    <TableCell className="font-medium text-warcrow-gold">{chapter.title}</TableCell>
                    <TableCell className={`${hasTranslation ? 'text-white' : 'text-red-500 italic'}`}>
                      {hasTranslation ? translatedTitle : "Missing translation"}
                    </TableCell>
                    <TableCell>
                      {chapter.sectionCount > 0 ? (
                        <Badge className="bg-green-600">{chapter.sectionCount}</Badge>
                      ) : (
                        <Badge className="bg-amber-600">0</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {chapter.translationComplete ? (
                        <Badge className="bg-green-600 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-red-600 flex items-center gap-1">
                          <X className="h-3 w-3" /> Incomplete
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-warcrow-gold/30 text-warcrow-gold"
                          onClick={() => handleEditTranslation(chapter, 'chapter')}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>

                        {handleDeleteItem && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-500/30 text-red-500"
                            onClick={() => handleDeleteItem(chapter, 'chapter')}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                  <p className="text-white">No chapters found matching search criteria</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
