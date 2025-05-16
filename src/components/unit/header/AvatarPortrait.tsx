
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
  fallback?: string;
}

const AvatarPortrait: React.FC<AvatarPortraitProps> = ({
  portraitUrl,
  name,
  fallback
}) => {
  const [imageError, setImageError] = useState(false);
  const { language } = useLanguage();
  
  // Generate portrait URL based on unit name - always using English names for consistency
  const generatePortraitUrl = () => {
    if (!portraitUrl) {
      // Clean up the name for URL generation - handle special characters and accents
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')         // Replace spaces with underscores
        .replace(/[^\w-]/g, '')       // Remove special characters (except underscores and hyphens)
        .replace(/ć/g, 'c')           // Replace ć with c
        .replace(/í/g, 'i')           // Replace í with i
        .replace(/á/g, 'a')           // Replace á with a
        .replace(/é/g, 'e');          // Replace é with e
      
      return `/art/portrait/${cleanName}_portrait.jpg`;
    }
    
    // If URL provided but not in portrait format, convert card URL to portrait URL
    if (portraitUrl.includes('/art/card/')) {
      // Replace the directory path
      let portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
      
      // Handle different filename extensions and patterns
      // Always use the English base name (without language suffix)
      if (portraitUrl.endsWith('_card.jpg')) {
        portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('_card.png')) {
        portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); 
      } else if (portraitUrl.endsWith('_card_sp.jpg') || portraitUrl.endsWith('_card_fr.jpg')) {
        // Remove language suffixes for portrait URLs to always use English version
        portraitImageUrl = portraitImageUrl
          .replace('_card_sp.jpg', '_portrait.jpg')
          .replace('_card_fr.jpg', '_portrait.jpg');
      }
      
      return portraitImageUrl;
    }
    
    // If it's already a portrait URL or doesn't match our patterns, return as is
    return portraitUrl;
  };

  // For debugging
  const portraitImageUrl = !imageError ? generatePortraitUrl() : undefined;

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitImageUrl} 
        alt={name} 
        className="object-cover"
        onError={(e) => {
          console.error(`Portrait image failed to load for ${name}:`, portraitImageUrl);
          setImageError(true);
        }}
      />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {fallback || name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
