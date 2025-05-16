
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Profile } from '@/types/profile';
import { Info } from 'lucide-react';

interface ProfileCompletionIndicatorProps {
  profile: Profile | null;
}

export const ProfileCompletionIndicator = ({ profile }: ProfileCompletionIndicatorProps) => {
  const { completionPercentage, missingFields } = useMemo(() => {
    if (!profile) {
      return { completionPercentage: 0, missingFields: [] };
    }

    const requiredFields: (keyof Profile)[] = [
      'username',
      'bio',
      'location',
      'favorite_faction',
      'avatar_url'
    ];
    
    const optionalFields: (keyof Profile)[] = [
      'social_discord',
      'social_twitter',
      'social_instagram',
      'social_youtube',
      'social_twitch',
      'wab_id'
    ];
    
    const allFields = [...requiredFields, ...optionalFields];
    const completedFields = allFields.filter(field => Boolean(profile[field]));
    
    const percentage = Math.round((completedFields.length / allFields.length) * 100);
    
    const missing = requiredFields.filter(field => !profile[field]);
    
    return {
      completionPercentage: percentage,
      missingFields: missing
    };
  }, [profile]);
  
  if (!profile) return null;
  
  return (
    <div className="p-3 bg-black/50 rounded-md border border-warcrow-gold/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-warcrow-gold/80">Profile Completion</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-warcrow-text/50 hover:text-warcrow-gold">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black/90 border-warcrow-gold/30 text-warcrow-text">
              <p>Complete your profile to improve visibility and connect with other players</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Progress value={completionPercentage} className="h-2 bg-black/60" 
        indicatorClassName={`${completionPercentage < 50 ? 'bg-red-500' : completionPercentage < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} />
      
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-warcrow-text/70">{completionPercentage}% complete</span>
        {missingFields.length > 0 && (
          <span className="text-warcrow-gold/70">
            Missing: {missingFields.map(field => field.replace('_', ' ')).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
};
