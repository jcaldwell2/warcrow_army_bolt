
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, Code, Shield, Users, Package, FileText, Languages, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [deepLUsage, setDeepLUsage] = useState<{ character_count: number; character_limit: number } | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  useEffect(() => {
    // Fetch DeepL usage on component mount
    fetchDeepLUsage();
  }, []);

  const fetchDeepLUsage = async () => {
    setIsLoadingUsage(true);
    try {
      const { data, error } = await supabase.functions.invoke("deepl-usage-stats", {});
      
      if (error) {
        console.error("Error fetching DeepL usage stats:", error);
        return;
      }
      
      setDeepLUsage(data as { character_count: number; character_limit: number });
    } catch (error) {
      console.error("Failed to fetch DeepL usage:", error);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Email Management</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Send emails and manage email templates for users
            </p>
          </div>
          <Button 
            onClick={() => navigate('/mail')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Mail className="mr-2 h-4 w-4" />
            Go to Mail
          </Button>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Admin Alerts</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Send alert notifications to administrators
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/alerts')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Manage Alerts
          </Button>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">User Management</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Manage user permissions and admin status
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin', { state: { initialTab: 'users' } })}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Developer Tools</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Advanced options for system configuration
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/dev-options')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Code className="mr-2 h-4 w-4" />
            Developer Options
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* System Management Link */}
        <Card className="bg-black/50 border border-warcrow-gold/30 h-full">
          <div className="p-6 flex flex-col items-center justify-between h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">System Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Monitor deployments, API status, and manage application data
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/deployment')}
              className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
            >
              <Rocket className="mr-2 h-4 w-4" />
              System Management
            </Button>
          </div>
        </Card>

        {/* Changelog Editor Link */}
        <Card className="bg-black/50 border border-warcrow-gold/30 h-full">
          <div className="p-6 flex flex-col items-center justify-between h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Changelog Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Edit the project changelog to document version updates and features
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/changelog')}
              className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
            >
              <FileText className="mr-2 h-4 w-4" />
              Edit Changelog
            </Button>
          </div>
        </Card>
        
        {/* Translation Management Link */}
        <Card className="bg-black/50 border border-warcrow-gold/30 h-full">
          <div className="p-6 flex flex-col items-center justify-between h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Translation Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Manage translations for rules, units, and user interface
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin', { state: { initialTab: 'rules' } })}
              className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
            >
              <Languages className="mr-2 h-4 w-4" />
              Manage Translations
            </Button>
          </div>
        </Card>
      </div>

      {/* DeepL Translation Usage Stats Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-black/50 border border-warcrow-gold/30">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-warcrow-gold">DeepL Translation Usage</h2>
              <Button
                onClick={fetchDeepLUsage}
                variant="outline"
                size="sm"
                disabled={isLoadingUsage}
                className="border-warcrow-gold/30 text-warcrow-gold"
              >
                {isLoadingUsage ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin border-2 border-warcrow-gold border-t-transparent rounded-full" />
                    Updating...
                  </span>
                ) : "Refresh"}
              </Button>
            </div>
            
            {deepLUsage ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-warcrow-text/80">Characters Used:</span>
                  <span className="font-medium text-warcrow-gold">
                    {formatNumber(deepLUsage.character_count)} / {formatNumber(deepLUsage.character_limit)}
                  </span>
                </div>
                
                <Progress 
                  value={(deepLUsage.character_count / deepLUsage.character_limit) * 100}
                  className="h-2 bg-warcrow-gold/20"
                />
                
                <div className="flex justify-between text-sm">
                  <span className="text-warcrow-text/70">
                    {((deepLUsage.character_count / deepLUsage.character_limit) * 100).toFixed(1)}% Used
                  </span>
                  <span className="text-warcrow-text/70">
                    {formatNumber(deepLUsage.character_limit - deepLUsage.character_count)} Characters Remaining
                  </span>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={() => navigate('/admin', { state: { initialTab: 'rules' } })}
                    className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    Manage Translations
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-warcrow-text/60">
                {isLoadingUsage ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="h-8 w-8 animate-spin border-4 border-warcrow-gold/30 border-t-warcrow-gold rounded-full" />
                    <p>Loading usage statistics...</p>
                  </div>
                ) : (
                  <p>Failed to load DeepL usage statistics. Click refresh to try again.</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
