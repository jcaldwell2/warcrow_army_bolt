
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Package, Rocket, History } from "lucide-react";
import NetlifyDeployments from '@/components/admin/dashboard/NetlifyDeployments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiStatus from '@/components/admin/ApiStatus';
import PopulateDataButton from '@/components/admin/units/PopulateDataButton';

const DeploymentManagement = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("deployments");

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-warcrow-gold">System Management</h1>
            </div>
          </div>
          
          <Tabs 
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deployments" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                <span>Deployment Status</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>API Status</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Data Management</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deployments" className="space-y-6">
              <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Manual Deployment</h2>
                <p className="text-sm text-gray-300 mb-6">
                  Trigger manual deployments or access the Netlify dashboard for advanced deployment options.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => window.open('https://app.netlify.com', '_blank')}
                    className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Netlify Dashboard
                  </Button>
                </div>
              </div>
              
              <NetlifyDeployments />
            </TabsContent>
            
            <TabsContent value="api">
              <ApiStatus />
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Database Population</h2>
                  <p className="text-sm text-gray-300 mb-6">
                    Populate Supabase database with existing data from the application.
                    This will upload units, keywords, special rules, and other game data.
                  </p>
                  <PopulateDataButton />
                </div>
                
                <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Backups & Restoration</h2>
                  <p className="text-sm text-gray-300 mb-6">
                    Manage database backups and restore data from previous versions.
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full md:w-auto border-warcrow-gold/30 text-warcrow-gold"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Supabase Dashboard
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminOnly>
  );
};

export default DeploymentManagement;
