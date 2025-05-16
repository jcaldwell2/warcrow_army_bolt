
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, RefreshCw, Terminal, Database, Settings, BookKey } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FontSymbolExplorer from "@/components/stats/font-explorer";

const DeveloperOptions = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(false);
  const [testMode, setTestMode] = useState(false);

  React.useEffect(() => {
    // Redirect non-admin users who directly access this URL
    if (!isWabAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isWabAdmin, navigate]);

  const handleRefreshCache = async () => {
    setIsLoading(true);
    try {
      // Simulating a cache refresh operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("System cache refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh cache:", error);
      toast.error("Failed to refresh cache");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDebugMode = (checked: boolean) => {
    setDebugMode(checked);
    toast.success(`Debug mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const toggleVerboseLogging = (checked: boolean) => {
    setVerboseLogging(checked);
    toast.success(`Verbose logging ${checked ? 'enabled' : 'disabled'}`);
  };

  const toggleTestMode = (checked: boolean) => {
    setTestMode(checked);
    toast.success(`Test mode ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin')}
              className="mr-4 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-warcrow-gold">Developer Options</h1>
          </div>

          <Alert className="mb-6 border-warcrow-gold/30 bg-black/50">
            <Code className="h-5 w-5 text-warcrow-gold" />
            <AlertTitle className="text-warcrow-gold">Developer Tools</AlertTitle>
            <AlertDescription className="text-warcrow-text">
              Advanced system configuration options for administrators. Use with caution as these settings can affect system behavior.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="system" className="mb-6">
            <TabsList className="bg-black border border-warcrow-gold/30 mb-6">
              <TabsTrigger value="system" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
                <Settings className="h-4 w-4 mr-2" />
                System Tools
              </TabsTrigger>
              <TabsTrigger value="symbols" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
                <BookKey className="h-4 w-4 mr-2" />
                Font Symbols
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {/* System Cache Section */}
                <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
                  <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    System Cache
                  </h2>
                  <p className="text-sm text-gray-300 mb-4">
                    Refresh system caches to apply recent changes or fix performance issues.
                  </p>
                  <Button 
                    onClick={handleRefreshCache}
                    className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Refreshing...' : 'Refresh Cache'}
                  </Button>
                </Card>

                {/* Debug Options Section */}
                <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
                  <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
                    <Terminal className="h-5 w-5 mr-2" />
                    Debug Options
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="debug-mode" className="text-warcrow-text">Debug Mode</Label>
                        <p className="text-sm text-gray-400">
                          Enable detailed error messages and debugging information.
                        </p>
                      </div>
                      <Switch 
                        id="debug-mode"
                        checked={debugMode}
                        onCheckedChange={toggleDebugMode}
                      />
                    </div>
                    
                    <Separator className="bg-warcrow-gold/20" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="verbose-logging" className="text-warcrow-text">Verbose Logging</Label>
                        <p className="text-sm text-gray-400">
                          Enable extensive application logging for troubleshooting.
                        </p>
                      </div>
                      <Switch 
                        id="verbose-logging"
                        checked={verboseLogging}
                        onCheckedChange={toggleVerboseLogging}
                      />
                    </div>
                    
                    <Separator className="bg-warcrow-gold/20" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="test-mode" className="text-warcrow-text">Test Mode</Label>
                        <p className="text-sm text-gray-400">
                          Run the application in test mode to bypass production safeguards.
                        </p>
                      </div>
                      <Switch 
                        id="test-mode"
                        checked={testMode}
                        onCheckedChange={toggleTestMode}
                      />
                    </div>
                  </div>
                </Card>
                
                {/* Database Tools Section */}
                <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
                  <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Database Tools
                  </h2>
                  <p className="text-sm text-gray-300 mb-4">
                    Tools for database management and maintenance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button 
                      className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                    >
                      Check Database Health
                    </Button>
                    <Button 
                      className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                    >
                      Run Database Vacuum
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="symbols" className="mt-0">
              <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
                <FontSymbolExplorer />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminOnly>
  );
};

export default DeveloperOptions;
