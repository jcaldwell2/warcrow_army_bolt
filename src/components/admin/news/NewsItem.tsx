
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NewsItemProps {
  english: string;
  spanish: string;
  french: string;
}

export const NewsItem: React.FC<NewsItemProps> = ({ english, spanish, french }) => {
  const [activeTab, setActiveTab] = useState<'en' | 'es' | 'fr'>('en');
  
  const formatContent = (content: string) => {
    if (!content) return <span className="italic text-warcrow-text/50">No content</span>;
    
    // Add line breaks
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className="mt-2">
      <Tabs 
        value={activeTab} 
        onValueChange={(val) => setActiveTab(val as 'en' | 'es' | 'fr')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 max-w-[300px] bg-warcrow-accent">
          <TabsTrigger 
            value="en" 
            className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
          >
            English
          </TabsTrigger>
          <TabsTrigger 
            value="es" 
            className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
          >
            Spanish
          </TabsTrigger>
          <TabsTrigger 
            value="fr" 
            className="text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
          >
            French
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="en" className="pt-2 text-warcrow-text text-sm">
          {formatContent(english)}
        </TabsContent>
        
        <TabsContent value="es" className="pt-2 text-warcrow-text text-sm">
          {formatContent(spanish)}
        </TabsContent>
        
        <TabsContent value="fr" className="pt-2 text-warcrow-text text-sm">
          {formatContent(french)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

