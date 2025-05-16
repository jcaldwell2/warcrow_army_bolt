
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsArchiveDialog from "./NewsArchiveDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import changelogContent from '../../../CHANGELOG.md?raw';
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { newsItems, initializeNewsItems, NewsItem } from "@/data/newsArchive";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
  latestFailedBuild?: any; // Changed from buildFailures to latestFailedBuild
}

export const Header = ({ latestVersion, userCount, isLoadingUserCount, latestFailedBuild }: HeaderProps) => {
  const { t } = useLanguage();
  const { isWabAdmin } = useAuth();
  const todaysDate = format(new Date(), 'MM/dd/yy');
  const [latestNewsItem, setLatestNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shownBuildFailureId, setShownBuildFailureId] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Only show build failure alert if it's from the latest build
  // And we haven't already shown this specific failure
  const shouldShowBuildFailure = isWabAdmin && 
    latestFailedBuild && 
    latestFailedBuild.id && 
    latestFailedBuild.id !== shownBuildFailureId && 
    // Check if the build was in the last 24 hours
    latestFailedBuild.created_at && 
    (new Date().getTime() - new Date(latestFailedBuild.created_at).getTime() < 24 * 60 * 60 * 1000);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setLoadingError(null);
      try {
        console.log("Header: Loading news items...");
        const items = await initializeNewsItems();
        console.log("Header: News items loaded:", items?.length || 0);
        if (items && items.length > 0) {
          setLatestNewsItem(items[0]); // Get the most recent news item
        } else {
          setLoadingError("No news items found");
        }
      } catch (error) {
        console.error("Header: Error loading news items:", error);
        setLoadingError("Failed to load news");
        toast.error("Failed to load news items");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
  }, []);
  
  // Update the shown build failure ID when a new one comes in
  useEffect(() => {
    if (shouldShowBuildFailure && latestFailedBuild?.id) {
      setShownBuildFailureId(latestFailedBuild.id);
    }
  }, [latestFailedBuild, shouldShowBuildFailure]);

  // Function to handle viewing a deployment
  const handleViewDeployment = (deployUrl: string) => {
    if (deployUrl) {
      window.open(deployUrl, '_blank');
    }
  };
  
  const handleRefreshNews = async () => {
    setIsLoading(true);
    setLoadingError(null);
    try {
      const items = await initializeNewsItems();
      if (items && items.length > 0) {
        setLatestNewsItem(items[0]);
        toast.success("News refreshed");
      } else {
        setLoadingError("No news items found");
        toast.info("No news items found");
      }
    } catch (error) {
      console.error("Error refreshing news:", error);
      setLoadingError("Failed to refresh news");
      toast.error("Failed to refresh news");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to format news content with highlighted date
  const formatNewsContent = (content: string): React.ReactNode => {
    if (!content) return '';

    // Look for date patterns like "News 5/3/25:" or similar date formats with the word "News" before
    const dateRegex = /(News\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)|(Noticias\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)/;
    
    if (dateRegex.test(content)) {
      const parts = content.split(dateRegex);
      return (
        <>
          {parts.map((part, i) => {
            // If this part matches the date pattern, highlight it
            if (dateRegex.test(part)) {
              return (
                <span key={i} className="text-warcrow-gold font-bold bg-warcrow-accent/70 px-2 py-0.5 rounded">
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </>
      );
    }
    
    // If no date found, just return the content
    return content;
  };
  
  return (
    <div className="text-center space-y-6 md:space-y-8">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt={t('logoAlt')} 
        className="w-64 md:w-[32rem] mx-auto"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
        {t('welcomeMessage')}
      </h1>
      <div className="text-warcrow-gold/80 text-xs md:text-sm">{t('version')} {latestVersion}</div>
      <p className="text-lg md:text-xl text-warcrow-text">
        {t('appDescription')}
      </p>
      <p className="text-md md:text-lg text-warcrow-gold/80">
        {isLoadingUserCount ? (
          t('loadingUserCount')
        ) : (
          t('userCountMessage').replace('{count}', String(userCount))
        )}
      </p>
      
      {/* Admin-only Build Failure Alert */}
      {shouldShowBuildFailure && (
        <Alert variant="destructive" className="bg-red-900/80 border-red-600 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-200">
            Latest Build Failed
          </AlertTitle>
          <AlertDescription className="text-red-300 mt-1">
            <div className="mb-2">
              <p className="mb-1">{latestFailedBuild.site_name} ({latestFailedBuild.branch})</p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-300 hover:text-blue-200"
                onClick={() => handleViewDeployment(latestFailedBuild.deploy_url)}
              >
                View deployment details
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-warcrow-gold font-semibold text-sm md:text-base">News {todaysDate}</p>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshNews}
              disabled={isLoading}
              className="text-xs text-warcrow-gold/70 hover:text-warcrow-gold"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refresh"}
            </Button>
            <NewsArchiveDialog triggerClassName="text-xs text-warcrow-gold/70 hover:text-warcrow-gold" />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold/70" />
            <span className="ml-2 text-warcrow-text/70 text-sm">Loading latest news...</span>
          </div>
        ) : loadingError ? (
          <div className="text-center py-3">
            <p className="text-warcrow-text/70 text-sm mb-2">{loadingError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshNews}
              className="text-warcrow-gold border-warcrow-gold/40"
            >
              Try Again
            </Button>
          </div>
        ) : latestNewsItem ? (
          <p className="text-warcrow-text text-sm md:text-base">
            {formatNewsContent(t(latestNewsItem.key))}
          </p>
        ) : (
          <p className="text-warcrow-text/70 text-sm">No recent news available.</p>
        )}
        
        {/* Changelog button and dialog - moved from Landing.tsx */}
        <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-warcrow-gold hover:text-warcrow-gold/80 text-sm"
              >
                {t('viewChangelog')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-warcrow-gold">
                  {t('changelog')}
                </DialogTitle>
              </DialogHeader>
              <div className="whitespace-pre-wrap font-mono text-sm">
                {changelogContent}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
