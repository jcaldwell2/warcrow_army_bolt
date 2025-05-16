
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Download, FileJson, File, Code, X, Github } from 'lucide-react';
import { toast } from 'sonner';
import { syncUnitDataToFiles, SyncStats } from '@/utils/admin/syncUnitData';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const DataSyncManager: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStats | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<{ name: string, content: string } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setProgress(10);
    
    try {
      // Simulate progress steps
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      // Execute the actual sync
      const results = await syncUnitDataToFiles();
      
      clearInterval(timer);
      setProgress(100);
      setSyncStatus(results);
      
      if (results.errors.length > 0) {
        toast.error(`Sync completed with ${results.errors.length} errors`);
      } else {
        toast.success('Unit data sync completed successfully!');
      }
    } catch (error: any) {
      toast.error(`Sync failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePreviewFile = (name: string) => {
    if (!syncStatus?.files) return;
    
    const content = syncStatus.files[name];
    if (content) {
      setPreviewFile({
        name,
        content
      });
    }
  };

  const getFileList = () => {
    if (!syncStatus?.files) return [];
    return Object.keys(syncStatus.files);
  };
  
  return (
    <Card className="p-4 space-y-4 bg-black border-warcrow-gold/30">
      <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
        <Database className="mr-2 h-5 w-5" />
        Database to Static Files Sync
      </h2>
      
      <div className="space-y-4">
        <p className="text-sm text-warcrow-text/80">
          This utility syncs unit data from the database to static JSON files in your GitHub repository.
          Use this after making updates to units, keywords, special rules, or characteristics.
        </p>
        
        {syncStatus && !isSyncing && (
          <div className="rounded p-3 bg-black/50 border border-warcrow-gold/20 text-sm">
            <h3 className="font-medium text-warcrow-gold mb-2">Sync Results</h3>
            <ul className="space-y-1 text-warcrow-text">
              <li><span className="opacity-70">Units:</span> {syncStatus.units}</li>
              <li><span className="opacity-70">Keywords:</span> {syncStatus.keywords}</li>
              <li><span className="opacity-70">Special Rules:</span> {syncStatus.specialRules}</li>
              <li><span className="opacity-70">Characteristics:</span> {syncStatus.characteristics}</li>
              {syncStatus.updatedFiles.length > 0 && (
                <li className="mt-2">
                  <span className="opacity-70">Files updated in GitHub:</span> {syncStatus.updatedFiles.length}
                  <ul className="ml-4 mt-1 list-disc">
                    {syncStatus.updatedFiles.slice(0, 5).map((file, idx) => (
                      <li key={idx} className="text-xs">{file}</li>
                    ))}
                    {syncStatus.updatedFiles.length > 5 && (
                      <li className="text-xs">...and {syncStatus.updatedFiles.length - 5} more</li>
                    )}
                  </ul>
                </li>
              )}
            </ul>
            
            {syncStatus.errors.length > 0 && (
              <div className="mt-2 text-red-400">
                <p className="font-medium">Errors:</p>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  {syncStatus.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Syncing data to GitHub...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
          >
            <Database className="h-4 w-4 mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync Unit Data'}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={!syncStatus || isSyncing || getFileList().length === 0}
                className="border-warcrow-gold/30 text-warcrow-text hover:bg-black/50"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Preview Generated Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-black border-warcrow-gold/30">
              <DialogHeader>
                <DialogTitle className="text-warcrow-gold flex items-center">
                  <File className="mr-2 h-5 w-5" />
                  Generated Data Files
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="col-span-1 border-r border-warcrow-gold/20 pr-3">
                  <h3 className="text-sm font-medium text-warcrow-gold mb-2">Files</h3>
                  <ul className="space-y-1">
                    {getFileList().map(fileName => (
                      <li key={fileName}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewFile(fileName)}
                          className={`w-full justify-start text-xs ${
                            previewFile?.name === fileName 
                              ? 'bg-warcrow-gold/20 text-warcrow-gold' 
                              : 'text-warcrow-text hover:bg-warcrow-gold/10'
                          }`}
                        >
                          <FileJson className="h-3.5 w-3.5 mr-2" />
                          {fileName}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="col-span-1 md:col-span-2 overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-warcrow-gold">
                      {previewFile ? previewFile.name : 'Select a file to preview'}
                    </h3>
                    {previewFile && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // In a real app, this would download the file
                            const blob = new Blob([previewFile.content], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = previewFile.name;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-xs text-warcrow-gold hover:bg-warcrow-gold/10"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {previewFile ? (
                    <div className="bg-black/70 border border-warcrow-gold/10 rounded overflow-auto max-h-[400px] p-3">
                      <pre className="text-xs text-warcrow-text/90 whitespace-pre-wrap">
                        {previewFile.content}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] border border-dashed border-warcrow-gold/20 rounded bg-black/20">
                      <p className="text-warcrow-text/50 text-sm">Select a file from the list to preview its contents</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  className="mt-4 border-warcrow-gold/30 text-warcrow-text"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            disabled={!syncStatus?.updatedFiles.length}
            onClick={() => window.open('https://github.com/your-org/your-repo', '_blank')}
            className="border-warcrow-gold/30 text-warcrow-text hover:bg-black/50"
          >
            <Github className="h-4 w-4 mr-2" />
            View in GitHub
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-black/70 border border-warcrow-gold/10 rounded text-xs text-warcrow-text/80">
          <h3 className="text-sm font-medium text-warcrow-gold mb-1">How it works:</h3>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Data is fetched from your Supabase database</li>
            <li>JSON files are generated for each faction, plus keywords, special rules, and characteristics</li>
            <li>Files are committed to the GitHub repository</li>
            <li>Static JSON files are available for the frontend application to consume</li>
          </ol>
          <p className="mt-2 text-warcrow-text/60">
            This approach improves performance by allowing the frontend to load static JSON files instead of making database queries.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DataSyncManager;
