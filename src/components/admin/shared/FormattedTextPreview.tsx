
import React from 'react';
import { TextHighlighter } from '@/components/rules/TextHighlighter';
import { SearchProvider } from '@/contexts/SearchContext';

interface FormattedTextPreviewProps {
  content: string;
  className?: string;
}

export const FormattedTextPreview: React.FC<FormattedTextPreviewProps> = ({ content, className = '' }) => {
  return (
    <div className={`border border-warcrow-gold/20 rounded-md p-3 bg-black/20 ${className}`}>
      <SearchProvider>
        <TextHighlighter text={content} />
      </SearchProvider>
    </div>
  );
};
