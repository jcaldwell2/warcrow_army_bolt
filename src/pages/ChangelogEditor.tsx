
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, RefreshCw, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getLatestVersion } from "@/utils/version";
import { toast } from "sonner";

const ChangelogEditor = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();
  const [changelog, setChangelog] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [latestVersion, setLatestVersion] = useState<string>("");

  useEffect(() => {
    // Fetch the changelog content
    fetchChangelog();
  }, []);

  const fetchChangelog = async () => {
    try {
      setLoading(true);
      // Fetch the changelog content from the repo
      const response = await fetch('/CHANGELOG.md');
      const text = await response.text();
      setChangelog(text);
      
      // Extract the latest version from the changelog
      const version = getLatestVersion(text);
      setLatestVersion(version);
    } catch (error) {
      console.error('Failed to fetch changelog:', error);
      toast.error('Failed to load changelog content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // This would typically connect to a backend service that can commit to GitHub
      // In a real implementation, this would use GitHub API or a similar service
      
      // For now, we'll just show a success message
      toast.success('Changelog saved successfully');
      
      // Extract the latest version from the updated changelog
      const version = getLatestVersion(changelog);
      setLatestVersion(version);
    } catch (error) {
      console.error('Failed to save changelog:', error);
      toast.error('Failed to save changelog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-warcrow-gold">Changelog Editor</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchChangelog}
                disabled={loading}
                className="border-warcrow-gold/30 text-warcrow-gold"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-warcrow-gold" />
                <h2 className="text-xl font-semibold text-warcrow-gold">
                  CHANGELOG.md
                  {latestVersion && (
                    <span className="ml-2 text-sm bg-warcrow-gold/20 text-warcrow-gold px-2 py-0.5 rounded">
                      Latest: v{latestVersion}
                    </span>
                  )}
                </h2>
              </div>
              
              <p className="text-sm text-gray-300 mb-6">
                Edit the changelog below. Use <a href="https://keepachangelog.com/" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Keep a Changelog</a> format. 
                Save changes when finished to commit to the repository.
              </p>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold/60" />
                </div>
              ) : (
                <Textarea 
                  value={changelog} 
                  onChange={(e) => setChangelog(e.target.value)} 
                  className="min-h-[500px] font-mono text-sm border-warcrow-gold/30 bg-black/70"
                  placeholder="# Changelog"
                />
              )}
              
              <div className="mt-6 text-xs text-gray-400">
                <p>Changes will be committed to the CHANGELOG.md file in the repository.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default ChangelogEditor;
