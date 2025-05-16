
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Languages } from "lucide-react";
import { format } from "date-fns";
import { NewsForm, NewsFormData } from './NewsForm';
import { NewsItem } from './NewsItem';

interface NewsListProps {
  isLoading: boolean;
  newsData: NewsFormData[];
  editingIndex: number | null;
  onEditClick: (index: number) => void;
  onCancelEdit: () => void;
  onDeleteNews: (index: number) => void;
  onSaveNews: (index: number) => void;
  onInputChange: (index: number, field: keyof NewsFormData, value: string) => void;
  onTranslate: (index: number, language: 'es' | 'fr') => void;
}

export const NewsList: React.FC<NewsListProps> = ({
  isLoading,
  newsData,
  editingIndex,
  onEditClick,
  onCancelEdit,
  onDeleteNews,
  onSaveNews,
  onInputChange,
  onTranslate
}) => {
  if (isLoading) {
    return <div className="py-4 text-center text-warcrow-text/70">Loading news data...</div>;
  }
  
  if (newsData.length === 0) {
    return <div className="py-4 text-center text-warcrow-text/70">No news items found</div>;
  }
  
  return (
    <div className="mt-4 space-y-4">
      {newsData.map((news, index) => (
        <div 
          key={news.id} 
          className="border border-warcrow-gold/30 rounded-lg p-4 bg-black/30"
        >
          {editingIndex === index ? (
            <NewsForm
              formData={news}
              onCancel={onCancelEdit}
              onSave={() => onSaveNews(index)}
              onChange={(field, value) => onInputChange(index, field, value)}
              onTranslate={(language) => onTranslate(index, language)}
            />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-warcrow-gold">{format(new Date(news.date), 'PP')}</h3>
                  <div className="text-xs text-warcrow-text/60 mt-1">
                    ID: {news.id} | Key: {news.key}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditClick(index)}
                    className="h-8 text-warcrow-gold/80 hover:text-warcrow-gold hover:bg-warcrow-accent/10"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNews(index)}
                    className="h-8 text-red-400/80 hover:text-red-400 hover:bg-red-900/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTranslate(index, 'es')}
                      className="h-8 px-2 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/10"
                      title="Translate to Spanish"
                    >
                      <Languages className="h-3.5 w-3.5 mr-1" />
                      ES
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTranslate(index, 'fr')}
                      className="h-8 px-2 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/10"
                      title="Translate to French"
                    >
                      <Languages className="h-3.5 w-3.5 mr-1" />
                      FR
                    </Button>
                  </div>
                </div>
              </div>
              
              <NewsItem 
                english={news.contentEn}
                spanish={news.contentEs}
                french={news.contentFr}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
