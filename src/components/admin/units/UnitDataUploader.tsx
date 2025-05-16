
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FilePlus, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UnitDataItem {
  id: string;
  name: string;
  description: string;
  faction: string;
  type: string;
  points: number;
  characteristics: Record<string, any>;
  keywords: string[];
  special_rules: string[];
  options: any[];
  name_es?: string;
  description_es?: string;
  name_fr?: string;
  description_fr?: string;
  created_at?: string;
  updated_at?: string;
}

const UnitDataUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [unitData, setUnitData] = useState<UnitDataItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(data)) {
          toast.error("Invalid file format. Expected an array of unit data.");
          setUploading(false);
          return;
        }
        
        setUnitData(data);
        
        // Upload data to Supabase in batches
        const batchSize = 10;
        let processedItems = 0;
        
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          
          // Process each item in the batch
          for (const unit of batch) {
            try {
              // Using any to bypass the type checking temporarily since we know the table exists
              const { error } = await (supabase as any)
                .from('unit_data')
                .upsert({
                  id: unit.id || crypto.randomUUID(),
                  name: unit.name,
                  description: unit.description || '',
                  faction: unit.faction || '',
                  type: unit.type || '',
                  points: unit.points || 0,
                  characteristics: unit.characteristics || {},
                  keywords: unit.keywords || [],
                  special_rules: unit.special_rules || [],
                  options: unit.options || [],
                  updated_at: new Date().toISOString()
                });
                
              if (error) throw error;
              
            } catch (itemError) {
              console.error("Error uploading unit:", unit.name, itemError);
            }
            
            processedItems++;
            const progress = Math.round((processedItems / data.length) * 100);
            setUploadProgress(progress);
          }
        }
        
        toast.success(`Successfully uploaded ${processedItems} units`);
      };
      
      reader.onerror = () => {
        toast.error("Error reading file");
        setUploading(false);
      };
      
      reader.readAsText(file);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 border border-warcrow-gold/30 shadow-sm bg-black">
      <h3 className="text-lg font-semibold text-warcrow-gold flex items-center">
        <FilePlus className="h-5 w-5 mr-2" />
        Upload Unit Data
      </h3>
      
      <div className="space-y-2">
        <Input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="text-sm border border-warcrow-gold/30 bg-black text-warcrow-text file:bg-warcrow-gold file:border-none file:text-black file:font-medium file:h-9 hover:file:bg-warcrow-gold/80"
        />
        {file && (
          <Badge variant="secondary" className="text-xs">
            Selected File: {file.name}
          </Badge>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
      >
        {uploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Data
          </>
        )}
      </Button>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-warcrow-text/80">
            <span>Upload Progress:</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 bg-warcrow-gold/20" />
        </div>
      )}

      {unitData.length > 0 && (
        <div className="flex items-center text-sm text-green-500">
          <Check className="h-4 w-4 mr-2" />
          <span>
            Successfully parsed {unitData.length} units from the file.
          </span>
        </div>
      )}

      {!uploading && unitData.length === 0 && file && (
        <div className="flex items-center text-sm text-red-500">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>
            Failed to parse unit data. Ensure the file is a valid JSON array.
          </span>
        </div>
      )}
    </Card>
  );
};

export default UnitDataUploader;
