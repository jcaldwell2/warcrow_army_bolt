
import { 
  MessageSquare, 
  Twitter, 
  Instagram, 
  Youtube, 
  Twitch 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialMediaLinksProps {
  social_discord?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  social_youtube?: string | null;
  social_twitch?: string | null;
}

export const SocialMediaLinks = ({
  social_discord,
  social_twitter,
  social_instagram,
  social_youtube,
  social_twitch
}: SocialMediaLinksProps) => {
  // Function to format social handles and URLs
  const formatTwitterUrl = (handle: string) => {
    const cleanHandle = handle.replace(/^@/, '');
    return `https://twitter.com/${cleanHandle}`;
  };

  const formatYoutubeUrl = (handle: string) => {
    if (handle.includes('youtube.com') || handle.includes('youtu.be')) return handle;
    if (handle.startsWith('@')) return `https://youtube.com/${handle}`;
    return `https://youtube.com/channel/${handle}`;
  };

  const formatTwitchUrl = (handle: string) => {
    const cleanHandle = handle.replace(/^@/, '');
    return `https://twitch.tv/${cleanHandle}`;
  };

  const formatInstagramUrl = (handle: string) => {
    const cleanHandle = handle.replace(/^@/, '');
    return `https://instagram.com/${cleanHandle}`;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 mt-2">
        {social_discord && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(social_discord);
                  // Show toast
                  const toast = document.createTextNode("Discord handle copied to clipboard!");
                  document.body.appendChild(toast);
                  setTimeout(() => document.body.removeChild(toast), 3000);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Discord: {social_discord}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {social_twitter && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
                onClick={() => window.open(formatTwitterUrl(social_twitter), '_blank')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Twitter: {social_twitter}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {social_instagram && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
                onClick={() => window.open(formatInstagramUrl(social_instagram), '_blank')}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Instagram: {social_instagram}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {social_youtube && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
                onClick={() => window.open(formatYoutubeUrl(social_youtube), '_blank')}
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>YouTube: {social_youtube}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {social_twitch && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
                onClick={() => window.open(formatTwitchUrl(social_twitch), '_blank')}
              >
                <Twitch className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Twitch: {social_twitch}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
