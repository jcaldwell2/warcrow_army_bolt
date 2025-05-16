
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { PatreonPatron, getPatreonPatrons } from '@/utils/patreonUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aboutTranslations } from '@/i18n/about';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { StarIcon, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SupportersList() {
  const [supporters, setSupporters] = useState<PatreonPatron[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching supporters from Patreon API...');
        const patrons = await getPatreonPatrons();
        console.log('Patrons received:', patrons);
        
        // Sort patrons by pledge start date (earliest first)
        const sortedPatrons = [...patrons].sort((a, b) => {
          const dateA = a.pledgeStart ? new Date(a.pledgeStart).getTime() : 0;
          const dateB = b.pledgeStart ? new Date(b.pledgeStart).getTime() : 0;
          return dateA - dateB;
        });
        
        setSupporters(sortedPatrons);
        
        if (sortedPatrons.length === 0) {
          console.log('No patrons returned from API');
          // Don't set error here, we'll handle empty state separately
        } else {
          console.log(`${sortedPatrons.length} patrons successfully loaded`);
          toast({
            title: "Supporters loaded",
            description: `Successfully loaded ${sortedPatrons.length} supporter${sortedPatrons.length === 1 ? '' : 's'}.`,
            duration: 3000,
          });
        }
      } catch (err) {
        console.error('Error fetching supporters:', err);
        setError(aboutTranslations.errorLoadingSupporters[language]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupporters();
  }, [language]);

  // Get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get a random avatar URL from our collection
  const getRandomAvatarUrl = (seed: string): string => {
    // List of available avatars in the public/art/portrait directory
    const portraitList = [
      'aodharu_portrait.jpg',
      'alula_portrait.jpg',
      'aoidos_portrait.jpg',
      'battle_scarred_portrait.jpg',
      'coal_portrait.jpg',
      'contender_portrait.jpg',
      'druid_portrait.jpg',
      'darkmaster_portrait.jpg',
      'echoes_portrait.jpg',
      'frostfire_herald_portrait.jpg',
      'grand_captain_portrait.jpg',
      'hersir_portrait.jpg',
      'lady_telia_portrait.jpg',
      'needle_portrait.jpg',
      'nuada_portrait.jpg',
      'oona_portrait.jpg',
    ];
    
    // Use the seed (patron ID) to get a consistent but "random" avatar
    const index = Math.abs(seed.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0)) % portraitList.length;
    
    return `/art/portrait/${portraitList[index]}`;
  };

  // Check if supporter is a paid supporter (has amount cents > 0)
  const isPaidSupporter = (supporter: PatreonPatron): boolean => {
    return supporter.amountCents > 0 && supporter.status === "Paid";
  };

  // Return random color for supporter avatars
  const getAvatarColor = (id: string, isFirst: boolean = false): string => {
    // Gold color for first supporter
    if (isFirst) return 'bg-warcrow-gold text-black';
    
    const colors = [
      'bg-blue-600 text-white',
      'bg-green-600 text-white',
      'bg-purple-600 text-white',
      'bg-amber-600 text-white',
      'bg-rose-600 text-white',
    ];
    
    // Simple hash function for consistent colors
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-6">
          {aboutTranslations.supportersTitle[language]}
        </h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-warcrow-gold/30" />
          ))}
        </div>
      </div>
    );
  }

  if (error || supporters.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-3">
          {aboutTranslations.supportersTitle[language]}
        </h2>
        <p className="text-center text-warcrow-text/80 mb-6">
          {error || aboutTranslations.noSupportersYet[language]}
        </p>
        
        <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-6 max-w-2xl mx-auto text-center">
          <p className="text-warcrow-text mb-4">
            {aboutTranslations.beFirstSupporter[language]}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR', 
      { year: 'numeric', month: 'short' }
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-6">
        {aboutTranslations.supportersTitle[language]}
      </h2>
      
      <div className="space-y-3 max-w-3xl mx-auto">
        {supporters.map((supporter, index) => (
          <Card 
            key={supporter.id}
            className={`flex items-center p-4 ${index === 0 ? 'border-warcrow-gold bg-black/80' : 'bg-black/60 border-warcrow-gold/30'}`}
          >
            <div className="relative">
              <Avatar className={`h-12 w-12 mr-4 ${getAvatarColor(supporter.id, index === 0)}`}>
                <AvatarImage src={getRandomAvatarUrl(supporter.id)} alt={supporter.fullName} />
                <AvatarFallback className="text-sm font-semibold">
                  {getInitials(supporter.fullName)}
                </AvatarFallback>
              </Avatar>
              {isPaidSupporter(supporter) && (
                <div className="absolute -bottom-1 -right-1">
                  <CheckCircle className="h-4 w-4 text-green-500 bg-black rounded-full" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="font-semibold text-warcrow-text">
                  {supporter.fullName}
                </span>
                {index === 0 && (
                  <div className="ml-2 flex items-center text-warcrow-gold">
                    <StarIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">First Supporter</span>
                  </div>
                )}
                {isPaidSupporter(supporter) && (
                  <Badge variant="outline" className="ml-2 border-green-500 text-green-500 text-xs">
                    Paid Supporter
                  </Badge>
                )}
              </div>
              {supporter.pledgeStart && (
                <span className="text-xs text-warcrow-text/60">
                  {language === 'en' ? 'Supporting since ' : language === 'es' ? 'Apoyando desde ' : 'Soutien depuis '}
                  {formatDate(supporter.pledgeStart)}
                </span>
              )}
            </div>
            
            <div className="text-right">
              <span className="text-sm text-warcrow-gold">
                #{index + 1}
              </span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <p className="text-warcrow-text/80 text-sm">
          {aboutTranslations.thankYouSupporters[language]}
        </p>
      </div>
    </div>
  );
}
