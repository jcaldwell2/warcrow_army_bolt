
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Coffee, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  getPatreonCampaignInfo,
  formatPatreonAmount,
  getPatreonCampaignUrl,
  PatreonTier
} from "@/utils/patreonUtils";
import { aboutTranslations } from '@/i18n/about';

export function PatreonSupportSection() {
  const [tiers, setTiers] = useState<PatreonTier[]>([]);
  const [campaignUrl, setCampaignUrl] = useState<string>(getPatreonCampaignUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPatreonInfo = async () => {
      try {
        setIsLoading(true);
        const campaignInfo = await getPatreonCampaignInfo();
        
        if (campaignInfo) {
          // Check if tiers exist and are published before filtering
          const campaignTiers = campaignInfo.tiers || [];
          setTiers(campaignTiers.filter(tier => tier.published));
          setCampaignUrl(campaignInfo.url);
        } else {
          setError("Unable to load support options");
        }
      } catch (err) {
        console.error("Error fetching Patreon data:", err);
        setError("An error occurred while loading support options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatreonInfo();
  }, []);

  const getTierIcon = (index: number) => {
    switch (index) {
      case 0: return <Coffee className="h-6 w-6 text-amber-500" />;
      case 1: return <Heart className="h-6 w-6 text-rose-500" />;
      case 2: return <Shield className="h-6 w-6 text-blue-500" />;
      default: return <Coffee className="h-6 w-6 text-amber-500" />;
    }
  };

  const handlePatreonRedirect = () => {
    window.open(campaignUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold">
          {aboutTranslations.supportTitle[language]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-warcrow-gold/30 bg-black/60">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 bg-gray-700" />
                <Skeleton className="h-5 w-1/2 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || tiers.length === 0) {
    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold">
          {aboutTranslations.supportTitle[language]}
        </h2>
        <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-6 text-center">
          <Coffee className="h-8 w-8 mx-auto mb-4 text-warcrow-gold/80" />
          <p className="mb-4">
            {aboutTranslations.supportText[language]}
          </p>
          <Button 
            variant="outline" 
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
            onClick={() => window.open(getPatreonCampaignUrl(), '_blank')}
          >
            <Coffee className="mr-2 h-4 w-4" />
            {aboutTranslations.buyCoffee[language]}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-warcrow-gold">
        {aboutTranslations.supportTitle[language]}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <Card key={tier.id} className="border border-warcrow-gold/30 bg-black/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                {getTierIcon(index)}
                <CardTitle className="text-warcrow-gold">{tier.title}</CardTitle>
              </div>
              <CardDescription className="text-warcrow-text/80">
                {formatPatreonAmount(tier.amountCents)} {aboutTranslations.perMonth[language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warcrow-text">{tier.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
                onClick={handlePatreonRedirect}
              >
                {aboutTranslations.becomePatron[language]}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-4">
        <Button 
          variant="outline"
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
          onClick={handlePatreonRedirect}
        >
          {aboutTranslations.viewAllOptions[language]}
        </Button>
      </div>
    </div>
  );
}

export default PatreonSupportSection;
