
import * as React from "react";
import ArmyBuilder from "@/components/army/ArmyBuilder";
import { supabase } from "@/integrations/supabase/client";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const Index = () => {
  const [session, setSession] = React.useState(null);
  const { isTester, isWabAdmin } = useAuth();
  const { t } = useLanguage();
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');
  
  // Check if user has permission to see the Play Mode
  const canAccessPlayMode = isTester || isWabAdmin || isPreview;

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center">{t('appTitle')}</h1>
            </div>
            <div className="flex items-center gap-4">
              {canAccessPlayMode && (
                <Link to="/play">
                  <Button 
                    className="bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 flex items-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>{t('playMode')}</span>
                  </Button>
                </Link>
              )}
              <LanguageSwitcher />
              <NavDropdown />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ArmyBuilder session={session} />
        </div>
      </div>
    </div>
  );
};

export default Index;
