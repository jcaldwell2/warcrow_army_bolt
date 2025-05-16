
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Unit } from "@/types/army";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitCardImageProps {
  unit: Unit;
}

const UnitCardImage = ({ unit }: UnitCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [alternateErrorShown, setAlternateErrorShown] = useState(false);
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  // If no image URL is provided, don't render the image section
  if (!unit.imageUrl) {
    return null;
  }

  // Function to generate the appropriate URL based on language
  const getLanguageSpecificUrl = (baseUrl: string): string => {
    // Check if we've already adjusted the URL with language suffix
    if (baseUrl.endsWith(`_${language}.jpg`) || baseUrl.endsWith(`_${language}.png`)) {
      return baseUrl;
    }

    // Only apply language suffix if it's Spanish or French
    if (language === 'es' || language === 'fr') {
      const langSuffix = language === 'es' ? '_sp' : '_fr';
      
      // Handle the different file naming conventions
      if (baseUrl.endsWith('.jpg')) {
        return baseUrl.replace('.jpg', `${langSuffix}.jpg`);
      } else if (baseUrl.endsWith('.png')) {
        return baseUrl.replace('.png', `${langSuffix}.png`);
      } else if (baseUrl.endsWith('_card.jpg')) {
        return baseUrl.replace('_card.jpg', `_card${langSuffix}.jpg`);
      } else if (baseUrl.endsWith('_card.png')) {
        return baseUrl.replace('_card.png', `_card${langSuffix}.png`);
      }
    }
    
    return baseUrl;
  };

  // Start with the original URL from the unit
  let imageUrl = unit.imageUrl;
  
  console.log('Original image URL:', imageUrl);

  // Apply language-specific changes if not in error state
  if (!imageError) {
    imageUrl = getLanguageSpecificUrl(imageUrl);
    console.log('Language-specific URL:', imageUrl);
  } else if (!alternateErrorShown) {
    // If first attempt failed, try with a different extension
    if (imageUrl.endsWith('.jpg')) {
      imageUrl = imageUrl.replace('.jpg', '.png');
    } else if (imageUrl.endsWith('.png')) {
      imageUrl = imageUrl.replace('.png', '.jpg');
    } else if (imageUrl.endsWith('_sp.jpg') || imageUrl.endsWith('_fr.jpg')) {
      // If language-specific version failed, try the default English version
      imageUrl = imageUrl.replace('_sp.jpg', '.jpg').replace('_fr.jpg', '.jpg');
    } else if (imageUrl.endsWith('_sp.png') || imageUrl.endsWith('_fr.png')) {
      imageUrl = imageUrl.replace('_sp.png', '.png').replace('_fr.png', '.png');
    }
    console.log('Fallback URL:', imageUrl);
  }

  return (
    <div className="w-full mt-2">
      <AspectRatio 
        ratio={16 / 9} 
        className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
      >
        <img
          src={imageUrl}
          alt={unit.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            console.error('Image load error:', imageUrl);
            if (!imageError) {
              setImageError(true);
            } else if (!alternateErrorShown) {
              setAlternateErrorShown(true);
            }
            // Let the fallback style show if all attempts fail
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default UnitCardImage;
