
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TextHighlighter } from '../rules/TextHighlighter';

interface FAQItemProps {
  section: string;
  content: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ section, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Create a text-only version of the content for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  // Get plain text version for preview
  const plainTextContent = stripHtml(content);
  
  // Limit preview to around 100 characters
  const contentPreview = plainTextContent.length > 100 
    ? plainTextContent.substring(0, 100) + '...'
    : plainTextContent;

  return (
    <div className="border-b border-warcrow-gold/20 pb-4 mb-6 animate-fade-in">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <h2 className="text-xl font-semibold text-warcrow-gold mb-2">{section}</h2>
        <button className="text-warcrow-gold/70 hover:text-warcrow-gold transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded ? (
        <div className="text-warcrow-text mt-2">
          <TextHighlighter text={content} />
        </div>
      ) : (
        <div className="text-warcrow-text/70 line-clamp-2 text-sm">
          {contentPreview}
        </div>
      )}
    </div>
  );
};
