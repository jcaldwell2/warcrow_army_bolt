import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";
import { format } from "date-fns";
import { updateNewsItem, createNewsItem, deleteNewsItem, translateContent, fetchNewsItems } from "@/utils/newsUtils";
import { NewsForm, NewsFormData } from './news/NewsForm';
import { NewsList } from './news/NewsList';

export const NewsManager = () => {
  const { t } = useLanguage();
  const [newsData, setNewsData] = useState<NewsFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNews, setNewNews] = useState<NewsFormData>({
    id: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    key: "",
    contentEn: "",
    contentEs: "",
    contentFr: ""
  });

  // Load news data from Supabase
  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    setIsLoading(true);
    
    try {
      // Load news data from Supabase
      const items = await fetchNewsItems();
      
      // Convert to form data format
      const formattedData = items.map(item => {
        const translationKey = item.key;
        const contentEn = translations[translationKey]?.en || "";
        const contentEs = translations[translationKey]?.es || "";
        const contentFr = translations[translationKey]?.fr || "";
        
        return {
          id: item.id,
          date: item.date,
          key: translationKey,
          contentEn,
          contentEs,
          contentFr
        };
      });
      
      setNewsData(formattedData);
    } catch (error) {
      console.error("Error loading news data:", error);
      toast.error("Failed to load news data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleInputChange = (
    index: number,
    field: keyof NewsFormData,
    value: string
  ) => {
    const updatedNewsData = [...newsData];
    updatedNewsData[index] = {
      ...updatedNewsData[index],
      [field]: value,
    };
    setNewsData(updatedNewsData);
  };

  const handleNewNewsChange = (field: keyof NewsFormData, value: string) => {
    setNewNews({
      ...newNews,
      [field]: value,
    });
    
    // Auto-generate ID when date changes
    if (field === 'date') {
      const formattedDate = value.replace(/-/g, '');
      setNewNews(prev => ({
        ...prev,
        id: `news-${formattedDate}`,
      }));
    }
  };

  const handleSaveNews = async (index: number) => {
    const newsItem = newsData[index];
    
    // Send update to Supabase
    const success = await updateNewsItem({
      id: newsItem.id,
      date: newsItem.date,
      key: newsItem.key,
      content: {
        en: newsItem.contentEn,
        es: newsItem.contentEs,
        fr: newsItem.contentFr
      }
    });
    
    if (success) {
      toast.success(`News "${newsItem.id}" updated successfully`);
      setEditingIndex(null);
      // Reload news data to ensure display is up-to-date
      loadNewsData();
    } else {
      toast.error("Failed to update news");
    }
  };

  const handleAddNewNews = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
    
    // Auto-generate initial ID based on today's date
    const today = new Date();
    const formattedDate = format(today, 'yyyyMMdd');
    
    setNewNews({
      id: `news-${formattedDate}`,
      date: format(today, 'yyyy-MM-dd'),
      key: `news${Date.now()}`,
      contentEn: "",
      contentEs: "",
      contentFr: ""
    });
  };

  const handleGenerateIdKey = () => {
    const formattedDate = newNews.date.replace(/-/g, '');
    const timestamp = Date.now();
    
    setNewNews(prev => ({
      ...prev,
      id: `news-${formattedDate}`,
      key: `news${timestamp}`
    }));
    
    toast.success("ID and Key generated");
  };

  const handleSaveNewNews = async () => {
    // Validate new news
    if (!newNews.date || !newNews.contentEn) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Auto-generate key if empty
    if (!newNews.key) {
      setNewNews(prev => ({
        ...prev,
        key: `news${Date.now()}`
      }));
    }

    // Auto-generate ID if empty
    if (!newNews.id) {
      const formattedDate = newNews.date.replace(/-/g, '');
      setNewNews(prev => ({
        ...prev,
        id: `news-${formattedDate}`
      }));
    }

    // Send create request to Supabase
    const success = await createNewsItem({
      id: newNews.id,
      date: newNews.date,
      key: newNews.key,
      content: {
        en: newNews.contentEn,
        es: newNews.contentEs,
        fr: newNews.contentFr
      }
    });
    
    if (success) {
      toast.success(`New news "${newNews.id}" added successfully`);
      
      // Reset form
      setIsAddingNew(false);
      setNewNews({
        id: "",
        date: format(new Date(), 'yyyy-MM-dd'),
        key: "",
        contentEn: "",
        contentEs: "",
        contentFr: ""
      });
      
      // Reload news data to include the new item
      loadNewsData();
    } else {
      toast.error("Failed to create news");
    }
  };

  const handleDeleteNews = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      const newsToDelete = newsData[index];
      
      // Send delete request to Supabase
      const success = await deleteNewsItem(newsToDelete.id);
      
      if (success) {
        toast.success("News deleted successfully");
        // Reload news data after deletion
        loadNewsData();
      } else {
        toast.error("Failed to delete news");
      }
    }
  };

  const handleTranslateToLanguage = async (index: number | null, language: 'es' | 'fr') => {
    if (index === null && !isAddingNew) return;
    
    const sourceText = isAddingNew 
      ? newNews.contentEn 
      : (index !== null ? newsData[index].contentEn : '');
    
    if (!sourceText) {
      toast.warning("Please enter English content first");
      return;
    }
    
    toast.loading(`Translating to ${language === 'es' ? 'Spanish' : 'French'}...`);
    
    try {
      const translatedText = await translateContent(sourceText, language.toUpperCase());
      
      if (isAddingNew) {
        // Update new news form
        setNewNews({
          ...newNews,
          [language === 'es' ? 'contentEs' : 'contentFr']: translatedText
        });
      } else if (index !== null) {
        // Update existing news
        const updatedNewsData = [...newsData];
        updatedNewsData[index] = {
          ...updatedNewsData[index],
          [language === 'es' ? 'contentEs' : 'contentFr']: translatedText
        };
        setNewsData(updatedNewsData);
      }
      
      toast.success(`${language === 'es' ? 'Spanish' : 'French'} translation updated`);
    } catch (error) {
      console.error(`Translation error for ${language}:`, error);
      toast.error(`Failed to translate to ${language === 'es' ? 'Spanish' : 'French'}`);
    }
  };

  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-warcrow-gold">News Management</h2>
        <Button 
          variant="outline"
          onClick={handleAddNewNews}
          disabled={isAddingNew || isLoading}
          className="border-warcrow-gold/30 text-warcrow-gold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New News
        </Button>
      </div>

      {/* New News Form */}
      {isAddingNew && (
        <NewsForm
          formData={newNews}
          isNew={true}
          onCancel={() => setIsAddingNew(false)}
          onSave={handleSaveNewNews}
          onChange={handleNewNewsChange}
          onTranslate={(language) => handleTranslateToLanguage(null, language)}
          onGenerateIdKey={handleGenerateIdKey}
        />
      )}

      {/* News List */}
      <NewsList
        isLoading={isLoading}
        newsData={newsData}
        editingIndex={editingIndex}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancelEdit}
        onDeleteNews={handleDeleteNews}
        onSaveNews={handleSaveNews}
        onInputChange={handleInputChange}
        onTranslate={handleTranslateToLanguage}
      />
    </Card>
  );
};

export default NewsManager;
