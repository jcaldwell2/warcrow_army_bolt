
import { useState, useEffect } from "react";
import { FriendActivityFeed } from "@/components/profile/FriendActivityFeed";
import { useProfileSession } from "@/hooks/useProfileSession";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { profileFadeIn } from "@/components/profile/animations";
import { PageHeader } from "@/components/common/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const Activity = () => {
  const { userId, isAuthenticated, usePreviewData } = useProfileSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useLanguage();
  
  // If not authenticated and not in preview mode, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !usePreviewData) {
      navigate("/login");
    }
  }, [isAuthenticated, usePreviewData, navigate]);
  
  if (!userId) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
        <div className="text-warcrow-gold text-xl mb-4">{t('loading')}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={t('activityFeed')}>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button 
            className="bg-black/70 border border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 transition-colors rounded-md px-4 py-2 text-sm"
            onClick={() => navigate("/profile")}
          >
            {t('backToProfile')}
          </button>
        </div>
      </PageHeader>
      
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-black/30 border border-warcrow-gold/20 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              {t('allActivity')}
            </TabsTrigger>
            <TabsTrigger value="lists" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              {t('listUpdates')}
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              {t('friendUpdates')}
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            variants={profileFadeIn}
            initial="hidden"
            animate="visible"
          >
            <TabsContent value="all" className="mt-0">
              <FriendActivityFeed userId={userId} />
            </TabsContent>
            
            <TabsContent value="lists" className="mt-0">
              <div className="bg-black/50 border border-warcrow-gold/20 rounded-lg p-6">
                <p className="text-center text-warcrow-text/70 italic">
                  {t('comingSoon')}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="friends" className="mt-0">
              <div className="bg-black/50 border border-warcrow-gold/20 rounded-lg p-6">
                <p className="text-center text-warcrow-text/70 italic">
                  {t('comingSoon')}
                </p>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
};

export default Activity;
