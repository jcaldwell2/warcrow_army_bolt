
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { aboutTranslations } from '@/i18n/about';
import { ExternalLink, CalendarIcon, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';
import { getPatreonPosts, type PatreonPost, DEFAULT_CAMPAIGN_ID } from '@/utils/patreonUtils';
import { toast } from '@/hooks/use-toast';

export default function LatestPosts() {
  const [posts, setPosts] = useState<PatreonPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        console.log('🔄 Fetching posts from Patreon API...');
        const fetchedPosts = await getPatreonPosts(DEFAULT_CAMPAIGN_ID);
        
        // Check if we're getting mock data by looking at the IDs
        const mockDataDetected = fetchedPosts.some(post => 
          ['1', '2', '3'].includes(post.id));
        
        setIsMockData(mockDataDetected);
        console.log(`✅ Posts received (${mockDataDetected ? 'MOCK DATA' : 'REAL DATA'}):`);
        console.log(fetchedPosts);
        
        // Make sure posts are sorted by date (newest first)
        const sortedPosts = [...fetchedPosts].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.date).getTime();
          const dateB = new Date(b.publishedAt || b.date).getTime();
          return dateB - dateA; // Sort in descending order (newest first)
        });
        
        setPosts(sortedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        setApiError(error instanceof Error ? error.message : 'Unknown error');
        
        // Only show toast when we're not showing mock data
        toast({
          title: language === 'en' ? 'Error' : language === 'es' ? 'Error' : 'Erreur',
          description: language === 'en' ? 'Could not fetch latest posts'
            : language === 'es' ? 'No se pudieron obtener las últimas publicaciones'
            : 'Impossible de récupérer les dernières publications',
          variant: 'destructive',
        });
        
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{aboutTranslations.latestPostsTitle[language]}</CardTitle>
          <CardDescription>{aboutTranslations.latestPostsSubtitle[language]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleReadMoreClick = (url: string) => {
    // Fix the URL construction to prevent duplicate /posts/ segments
    let validUrl = url;
    
    // Check if URL is provided and is valid
    if (!url) {
      console.error('❌ Invalid Patreon post URL');
      return;
    }
    
    // If it's not a full URL (doesn't start with http), construct it correctly
    if (!url.startsWith('http')) {
      // Ensure we don't duplicate the /posts/ segment
      const postId = url.replace(/^\/posts\//, '');
      validUrl = `https://www.patreon.com/posts/${postId}`;
    }
      
    // Open the URL in a new tab
    window.open(validUrl, '_blank', 'noopener noreferrer');
    
    // Log for debugging purposes
    console.log(`🔗 Opening Patreon post: ${validUrl}`);
  };

  return (
    <Card className="w-full h-full border-warcrow-gold/30 bg-black/60">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">{aboutTranslations.latestPostsTitle[language]}</CardTitle>
        <CardDescription>{aboutTranslations.latestPostsSubtitle[language]}</CardDescription>
        
        {isMockData && (
          <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-600/30 rounded-md flex items-center text-xs text-yellow-300">
            <AlertCircle size={14} className="mr-2" /> 
            {language === 'en' 
              ? 'Using mock data - Patreon API not connected' 
              : language === 'es' 
              ? 'Usando datos de prueba - API de Patreon no conectada'
              : 'Utilisation de données simulées - API Patreon non connectée'}
          </div>
        )}
        
        {apiError && (
          <div className="mt-2 p-2 bg-red-900/30 border border-red-600/30 rounded-md flex items-center text-xs text-red-300">
            <AlertCircle size={14} className="mr-2" /> 
            {language === 'en' 
              ? `API Error: ${apiError}` 
              : language === 'es' 
              ? `Error de API: ${apiError}`
              : `Erreur d'API: ${apiError}`}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-b border-warcrow-gold/20 pb-3 last:border-b-0">
                <h3 className="text-lg font-semibold text-warcrow-gold mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-warcrow-text/80 mb-2">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center text-warcrow-text/60">
                    <CalendarIcon className="mr-1" size={12} />
                    {formatRelativeTime(new Date(post.publishedAt || post.date), language)}
                  </span>
                  <button 
                    onClick={() => handleReadMoreClick(post.url)}
                    className="text-xs flex items-center text-warcrow-gold hover:text-warcrow-gold/80"
                    aria-label={`Read more about ${post.title}`}
                  >
                    {aboutTranslations.readMore[language]}
                    <ExternalLink className="ml-1" size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-warcrow-text/80 py-4">
              {aboutTranslations.noPostsAvailable[language]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
