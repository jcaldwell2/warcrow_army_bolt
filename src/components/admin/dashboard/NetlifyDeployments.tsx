
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Clock, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DeploymentStatus {
  id: string;
  site_name: string;
  created_at: string;
  state: string;
  deploy_url: string;
  commit_message?: string;
  branch?: string;
  error_message?: string;
  author?: string;
  deploy_time?: string;
}

const NetlifyDeployments: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastNotifiedDeploymentId, setLastNotifiedDeploymentId] = useState<string | null>(null);

  const fetchDeployments = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Call our Supabase Edge Function to fetch deployments
      const { data, error } = await supabase.functions.invoke('get-netlify-deployments');
      
      if (error) {
        console.error('Error fetching deployments:', error);
        throw new Error(error.message || 'Failed to fetch deployment data');
      }
      
      if (!data || !data.deployments) {
        throw new Error('No deployment data returned');
      }
      
      setDeployments(data.deployments);
      
      // Only show notifications for the latest deployment if we haven't shown it before
      // and it's either a failure or a success
      if (data.deployments && data.deployments.length > 0) {
        const latestDeployment = data.deployments[0];
        
        // Only notify if this is a different deployment than we've already notified about
        if (latestDeployment.id !== lastNotifiedDeploymentId) {
          // Notification logic for the latest deployment only
          if (latestDeployment.state === 'error') {
            toast.error(`Deployment failed: ${latestDeployment.error_message || 'Unknown error'}`, {
              description: `Branch: ${latestDeployment.branch}`,
            });
            setLastNotifiedDeploymentId(latestDeployment.id);
          } 
          else if (latestDeployment.state === 'ready') {
            toast.success(`Deployment successful: ${latestDeployment.branch}`, {
              description: `Deployed in ${latestDeployment.deploy_time || 'unknown time'}`,
            });
            setLastNotifiedDeploymentId(latestDeployment.id);
          }
          // Don't show notifications for "building" state
        }
      }

    } catch (err) {
      console.error('Error fetching deployments:', err);
      setError('Failed to fetch deployment data. Please check your Netlify API key and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
    // Refresh every 2 minutes
    const intervalId = setInterval(fetchDeployments, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchDeployments();
    toast.success("Refreshing deployment data");
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'ready':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'building':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'ready':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'building':
        return <Badge className="bg-yellow-500">Building</Badge>;
      default:
        return <Badge className="bg-gray-500">{state}</Badge>;
    }
  };

  const getDeploymentTitle = (deployment: DeploymentStatus) => {
    if (deployment.state === 'building') {
      return `${deployment.site_name}: Production: ${deployment.branch} building`;
    }
    return `${deployment.site_name}: Production: ${deployment.branch} completed`;
  };

  // Get limited deployments to show (latest 5)
  const limitedDeployments = deployments.slice(0, 5);

  if (loading && !refreshing) {
    return (
      <Card className="bg-black/50 border border-warcrow-gold/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
            disabled={true}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-warcrow-gold/20 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-warcrow-gold/20 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-warcrow-gold/20 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/50 border border-warcrow-gold/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border border-warcrow-gold/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-warcrow-gold mb-2">Latest 5 Builds</p>
          {deployments.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No deployments found</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {deployments.slice(0, 5).map(deployment => (
                  <div 
                    key={deployment.id}
                    className="border border-warcrow-gold/20 rounded-md p-3 hover:bg-warcrow-gold/5 transition-colors"
                  >
                    <div className="flex items-center mb-1">
                      {deployment.state === 'ready' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : deployment.state === 'error' ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : deployment.state === 'building' ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="ml-2 font-medium text-warcrow-gold">
                        {deployment.site_name}: Production: {deployment.branch} {deployment.state === 'building' ? 'building' : 'completed'}
                      </span>
                    </div>
                    
                    <div className="pl-6 text-sm text-gray-300 mb-1">
                      {deployment.commit_message && (
                        <p className="truncate max-w-full">{deployment.author ? `By ${deployment.author}: ` : ''}{deployment.commit_message}</p>
                      )}
                    </div>
                    
                    <div className="pl-6 flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(deployment.created_at)}</span>
                      {deployment.deploy_time && (
                        <span>Deployed in {deployment.deploy_time}</span>
                      )}
                    </div>

                    {deployment.error_message && (
                      <div className="pl-6 mt-2 p-2 bg-red-900/20 border border-red-900/30 rounded text-xs text-red-400">
                        <p className="font-semibold mb-1">Error:</p>
                        <p className="whitespace-pre-wrap break-words">{deployment.error_message}</p>
                      </div>
                    )}

                    <div className="pl-6 mt-2 text-xs">
                      <a 
                        href={deployment.deploy_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Build details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetlifyDeployments;
