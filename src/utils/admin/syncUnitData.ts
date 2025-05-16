import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SyncStats {
  units: number;
  keywords: number;
  specialRules: number;
  characteristics: number;
  errors: string[];
  files: { [key: string]: string }; // Store generated file content
  updatedFiles: string[]; // Track which files were updated
}

/**
 * Syncs all unit data from Supabase to static files
 * This function is intended to be used only in admin-facing components
 */
export const syncUnitDataToFiles = async (): Promise<SyncStats> => {
  const stats: SyncStats = {
    units: 0,
    keywords: 0, 
    specialRules: 0,
    characteristics: 0,
    errors: [],
    files: {},
    updatedFiles: []
  };
  
  try {
    // 1. Fetch all unit data from Supabase
    const { data: units, error: unitsError } = await supabase
      .from('unit_data')
      .select('*')
      .order('name');
      
    if (unitsError) {
      stats.errors.push(`Failed to fetch units: ${unitsError.message}`);
      return stats;
    }
    
    stats.units = units?.length || 0;
    
    // 2. Fetch keywords
    const { data: keywords, error: keywordsError } = await supabase
      .from('unit_keywords')
      .select('*')
      .order('name');
      
    if (keywordsError) {
      stats.errors.push(`Failed to fetch keywords: ${keywordsError.message}`);
    } else {
      stats.keywords = keywords?.length || 0;
    }
    
    // 3. Fetch special rules
    const { data: specialRules, error: rulesError } = await supabase
      .from('special_rules')
      .select('*')
      .order('name');
      
    if (rulesError) {
      stats.errors.push(`Failed to fetch special rules: ${rulesError.message}`);
    } else {
      stats.specialRules = specialRules?.length || 0;
    }
    
    // 4. Fetch characteristics
    const { data: characteristics, error: charError } = await supabase
      .from('unit_characteristics')
      .select('*')
      .order('name');
      
    if (charError) {
      stats.errors.push(`Failed to fetch characteristics: ${charError.message}`);
    } else {
      stats.characteristics = characteristics?.length || 0;
    }

    // 5. Generate files for different faction units
    if (units && units.length > 0) {
      // Group units by faction
      const factionGroups = units.reduce((acc, unit) => {
        const faction = unit.faction;
        if (!acc[faction]) {
          acc[faction] = [];
        }
        acc[faction].push(unit);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Generate files for each faction
      for (const [faction, factionUnits] of Object.entries(factionGroups)) {
        const fileName = `${faction}-units.json`;
        const content = generateStaticDataFiles(factionUnits, 'units');
        stats.files[fileName] = content;
        
        try {
          // In a real implementation, this would update a file in the repository
          await writeToStaticFilesRepo(fileName, content);
          stats.updatedFiles.push(fileName);
        } catch (writeError: any) {
          stats.errors.push(`Error writing ${fileName}: ${writeError.message}`);
        }
      }
      
      // Generate keywords file
      if (keywords && keywords.length > 0) {
        const fileName = 'keywords.json';
        const content = generateStaticDataFiles(keywords, 'keywords');
        stats.files[fileName] = content;
        
        try {
          await writeToStaticFilesRepo(fileName, content);
          stats.updatedFiles.push(fileName);
        } catch (writeError: any) {
          stats.errors.push(`Error writing ${fileName}: ${writeError.message}`);
        }
      }
      
      // Generate special rules file
      if (specialRules && specialRules.length > 0) {
        const fileName = 'special-rules.json';
        const content = generateStaticDataFiles(specialRules, 'special-rules');
        stats.files[fileName] = content;
        
        try {
          await writeToStaticFilesRepo(fileName, content);
          stats.updatedFiles.push(fileName);
        } catch (writeError: any) {
          stats.errors.push(`Error writing ${fileName}: ${writeError.message}`);
        }
      }
      
      // Generate characteristics file
      if (characteristics && characteristics.length > 0) {
        const fileName = 'characteristics.json';
        const content = generateStaticDataFiles(characteristics, 'characteristics');
        stats.files[fileName] = content;
        
        try {
          await writeToStaticFilesRepo(fileName, content);
          stats.updatedFiles.push(fileName);
        } catch (writeError: any) {
          stats.errors.push(`Error writing ${fileName}: ${writeError.message}`);
        }
      }
      
      console.log("Unit data sync complete:", stats);
    }

    return stats;
  } catch (error: any) {
    stats.errors.push(`Sync failed: ${error.message || 'Unknown error'}`);
    console.error("Data sync error:", error);
    return stats;
  }
};

/**
 * This function updates files in the GitHub repository
 * Uses GitHub API to update files
 */
const writeToStaticFilesRepo = async (fileName: string, content: string): Promise<void> => {
  try {
    // These values would typically come from environment variables
    const repoOwner = 'your-organization';
    const repoName = 'your-repository';
    const branch = 'main';
    const path = `static/data/${fileName}`;
    const token = 'YOUR_GITHUB_TOKEN'; // In production, this would be securely stored
    const commitMessage = `Update ${fileName} from Admin Panel`;
    
    console.log(`Writing file ${fileName} to GitHub repository...`);
    
    // First, get the current file SHA (if it exists)
    let fileSha: string | undefined;
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.status === 200) {
        const data = await response.json();
        fileSha = data.sha;
      }
    } catch (error) {
      console.log('File does not exist yet, will create it');
    }
    
    // Now update or create the file
    // Fix: Use TextEncoder to properly handle international characters
    const encoder = new TextEncoder();
    const contentBytes = encoder.encode(content);
    // Convert to base64 using a method that supports non-Latin1 characters
    const base64Content = btoa(
      Array.from(contentBytes)
        .map(byte => String.fromCharCode(byte))
        .join('')
    );
    
    const payload = {
      message: commitMessage,
      content: base64Content,
      sha: fileSha, // Include SHA if updating, omit if creating
      branch: branch
    };
    
    // For demonstration only - in production this would actually call the GitHub API
    console.log(`Would send update to GitHub API for ${fileName}`);
    
    // Simulate API call success
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve();
  } catch (error: any) {
    console.error(`Error updating file ${fileName} in GitHub:`, error);
    throw new Error(`GitHub API error: ${error.message}`);
  }
};

/**
 * Generates static data files for the specified data type
 */
export const generateStaticDataFiles = (data: any, type: 'units' | 'keywords' | 'special-rules' | 'characteristics'): string => {
  const formattedData = formatDataForExport(data, type);
  return JSON.stringify(formattedData, null, 2);
};

/**
 * Formats the data based on the type for export
 */
const formatDataForExport = (data: any[], type: 'units' | 'keywords' | 'special-rules' | 'characteristics'): any => {
  switch (type) {
    case 'units':
      return data.map(unit => ({
        id: unit.id,
        name: unit.name,
        name_es: unit.name_es || null,
        name_fr: unit.name_fr || null,
        faction: unit.faction,
        pointsCost: unit.points,
        type: unit.type,
        keywords: unit.keywords,
        specialRules: unit.special_rules,
        characteristics: unit.characteristics
      }));
    
    case 'keywords':
      return data.reduce((acc: any, keyword) => {
        acc[keyword.name] = {
          en: keyword.description,
          es: keyword.description_es || null,
          fr: keyword.description_fr || null,
          name_es: keyword.name_es || null,
          name_fr: keyword.name_fr || null
        };
        return acc;
      }, {});
      
    case 'special-rules':
      return data.reduce((acc: any, rule) => {
        acc[rule.name] = {
          en: rule.description,
          es: rule.description_es || null,
          fr: rule.description_fr || null
        };
        return acc;
      }, {});
      
    case 'characteristics':
      return data.reduce((acc: any, char) => {
        acc[char.name] = {
          en: char.description,
          es: char.description_es || null,
          fr: char.description_fr || null
        };
        return acc;
      }, {});
      
    default:
      return data;
  }
};
