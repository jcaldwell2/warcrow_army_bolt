
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Save, Languages } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface NewsFormData {
  id: string;
  date: string;
  key: string;
  contentEn: string;
  contentEs: string;
  contentFr: string;
}

interface NewsFormProps {
  formData: NewsFormData;
  isNew?: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: keyof NewsFormData, value: string) => void;
  onTranslate: (language: 'es' | 'fr') => void;
  onGenerateIdKey?: () => void;
}

export const NewsForm = ({
  formData,
  isNew = false,
  onCancel,
  onSave,
  onChange,
  onTranslate,
  onGenerateIdKey
}: NewsFormProps) => {
  return (
    <div className="p-4 border border-warcrow-gold/20 rounded-lg">
      {isNew && (
        <h3 className="text-warcrow-gold mb-3 text-sm font-medium">Add New News</h3>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-warcrow-text mb-1">Date</label>
          <div className="relative">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="bg-black border-warcrow-gold/30 text-warcrow-text"
            />
            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-warcrow-gold/60" />
          </div>
        </div>

        {isNew && (
          <>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-warcrow-text">ID</label>
                {onGenerateIdKey && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onGenerateIdKey}
                    className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                  >
                    Auto-generate ID & Key
                  </Button>
                )}
              </div>
              <Input
                value={formData.id}
                onChange={(e) => onChange('id', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="news-yyyy-mm-dd"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">Key</label>
              <Input
                value={formData.key}
                onChange={(e) => onChange('key', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="Translation key"
              />
            </div>
          </>
        )}

        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-warcrow-accent">
            <TabsTrigger 
              value="english" 
              className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
            >
              English
            </TabsTrigger>
            <TabsTrigger 
              value="spanish" 
              className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
            >
              Spanish
            </TabsTrigger>
            <TabsTrigger 
              value="french" 
              className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
            >
              French
            </TabsTrigger>
          </TabsList>

          <TabsContent value="english">
            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">English Content</label>
              <Textarea
                value={formData.contentEn}
                onChange={(e) => onChange('contentEn', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text min-h-[150px]"
                placeholder="News content in English"
              />
            </div>
          </TabsContent>

          <TabsContent value="spanish">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-warcrow-text">Spanish Content</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTranslate('es')}
                  className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                >
                  <Languages className="h-3.5 w-3.5 mr-1" />
                  Auto-translate to Spanish
                </Button>
              </div>
              <Textarea
                value={formData.contentEs}
                onChange={(e) => onChange('contentEs', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text min-h-[150px]"
                placeholder="News content in Spanish"
              />
            </div>
          </TabsContent>

          <TabsContent value="french">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-warcrow-text">French Content</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTranslate('fr')}
                  className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                >
                  <Languages className="h-3.5 w-3.5 mr-1" />
                  Auto-translate to French
                </Button>
              </div>
              <Textarea
                value={formData.contentFr}
                onChange={(e) => onChange('contentFr', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text min-h-[150px]"
                placeholder="News content in French"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-warcrow-gold/30 text-warcrow-text"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Save className="h-4 w-4 mr-2" />
            Save News
          </Button>
        </div>
      </div>
    </div>
  );
};

