
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import UnitDataManager from '@/components/admin/units/UnitDataManager';
import ApiStatus from '@/components/admin/ApiStatus';
import FAQTranslationManager from '@/components/admin/FAQTranslationManager';
import UserManagement from '@/components/admin/UserManagement';
import NewsManager from '@/components/admin/NewsManager';
import RulesVerifier from '@/components/admin/RulesVerifier';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import TranslationManagerPanel from '@/components/admin/TranslationManagerPanel';
import UnitValidationTool from '@/components/admin/units/UnitValidationTool';
import UnitImagesManager from '@/components/admin/units/UnitImagesManager';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEnsureDefaultFactions } from '@/hooks/useEnsureDefaultFactions';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, isAdmin: isAdminFromAuth } = useAuth();
  
  // Use our new hook to ensure default factions exist
  useEnsureDefaultFactions();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('wab_admin')
          .eq('id', session.user.id)
          .single();
          
        if (error || !data || !data.wab_admin) {
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-warcrow-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warcrow-gold"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      {/* Main navigation bar */}
      <div className="bg-black/70 border-b border-warcrow-gold/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('backToSite')}
            </Button>
            <h1 className="text-xl font-bold text-warcrow-gold">Admin Panel</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              <Home className="h-4 w-4 mr-2" />
              {t('home')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/builder')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              {t('builder')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsContent value="dashboard">
            <AdminTabContent title="Dashboard">
              <AdminDashboard />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="users">
            <AdminTabContent title="User Management">
              <UserManagement />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="units">
            <AdminTabContent title="Unit Data Management">
              <UnitDataManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="unit-validation">
            <AdminTabContent title="Unit Validation">
              <UnitValidationTool />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="unit-images">
            <AdminTabContent title="Unit Images">
              <UnitImagesManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="rules">
            <AdminTabContent title="Rules Management">
              <RulesVerifier />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="faq">
            <AdminTabContent title="FAQ Management">
              <FAQTranslationManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="news">
            <AdminTabContent title="News Management">
              <NewsManager />
            </AdminTabContent>
          </TabsContent>

          <TabsContent value="translation">
            <AdminTabContent title="Translation Management">
              <TranslationManagerPanel />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="api">
            <AdminTabContent title="API Status">
              <ApiStatus />
            </AdminTabContent>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
