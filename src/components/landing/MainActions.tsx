
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Play, User, Shield } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { useLanguage } from "@/contexts/LanguageContext";

export const MainActions = () => {
  const navigate = useNavigate();
  const [isTester, setIsTester] = useState(false);
  const { isWabAdmin } = useAuth();
  const { t } = useLanguage();
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  useEffect(() => {
    const checkUserRole = async () => {
      // If in preview mode, set as tester
      if (isPreview) {
        setIsTester(true);
        return;
      }

      // Otherwise check if user has tester role
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch user's roles from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data && data.tester) {
          setIsTester(true);
        }
      }
    };

    checkUserRole();
  }, [isPreview]);

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/builder')}
          className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors px-8 py-2 text-lg"
        >
          {t('startBuilding')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
        <Button
          onClick={() => navigate('/rules')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          {t('rulesReference')}
        </Button>
        <Button
          onClick={() => navigate('/missions')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          {t('missions')}
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          <User className="mr-2 h-4 w-4" />
          {t('profile')}
        </Button>
        {(isTester || isWabAdmin || isPreview) && (
          <>
            <Button
              onClick={() => navigate('/unit-stats')}
              variant="outline"
              className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              {t('unitStats')}
            </Button>
            <Button
              onClick={() => navigate('/play')}
              variant="outline"
              className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <Play className="mr-2 h-4 w-4" />
              {t('playMode')}
            </Button>
          </>
        )}
        <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            <Shield className="mr-2 h-4 w-4" />
            {t('admin')}
          </Button>
        </AdminOnly>
      </div>
    </>
  );
};
