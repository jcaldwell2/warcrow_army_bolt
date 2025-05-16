
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, ExternalLink, Copy, Clipboard, ClipboardCheck } from "lucide-react";
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const UnitImagesManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaction, setFilterFaction] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('portraits');
  const [imageResults, setImageResults] = useState<Record<string, {exists: boolean, url: string}>>({});
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [allUnits, setAllUnits] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [copiedPaths, setCopiedPaths] = useState<Record<string, boolean>>({});
  const { t, language } = useLanguage();
  
  const factions = [
    { id: 'all', name: 'All Factions' },
    { id: 'hegemony-of-embersig', name: 'Hegemony' },
    { id: 'northern-tribes', name: 'Northern Tribes' },
    { id: 'scions-of-yaldabaoth', name: 'Scions of Yaldabaoth' },
    { id: 'syenann', name: 'Syenann' },
  ];

  // Load units from Supabase
  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*');

      if (error) {
        console.error('Error fetching units:', error);
        toast.error('Failed to load units from database');
        return;
      }

      console.log(`Loaded ${data.length} units from database`);
      setAllUnits(data);
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    // Filter units based on search term and selected faction
    if (allUnits.length === 0) return;
    
    let filtered = [...allUnits];
    
    if (filterFaction !== 'all') {
      filtered = filtered.filter(unit => unit.faction === filterFaction);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUnits(filtered);
  }, [searchTerm, filterFaction, allUnits]);

  // Improved function to clean unit names for file naming
  const cleanUnitName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '')
      .replace(/ć/g, 'c')
      .replace(/í/g, 'i')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e');
  };

  // Reset copy status after 2 seconds
  const resetCopyStatus = (unitId: string) => {
    setTimeout(() => {
      setCopiedPaths(prev => ({
        ...prev,
        [unitId]: false
      }));
    }, 2000);
  };

  // Enhanced image checking that handles errors properly and bypasses cache
  const checkImageExists = async (url: string): Promise<boolean> => {
    try {
      // Add cache-busting parameter to bypass browser cache
      const cacheBustUrl = `${url}?cachebust=${new Date().getTime()}`;
      console.log(`Checking image at: ${cacheBustUrl}`);
      
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`✅ Image exists: ${url}`);
          resolve(true);
        };
        img.onerror = () => {
          console.log(`❌ Image missing: ${url}`);
          resolve(false);
        };
        img.src = cacheBustUrl;
        
        // Set a timeout to handle cases where image loading hangs
        setTimeout(() => resolve(false), 3000);
      });
    } catch (error) {
      console.error(`Error checking image at ${url}:`, error);
      return false;
    }
  };

  const reloadUnitData = async () => {
    toast.info('Refreshing unit data from database...');
    
    const { data, error } = await supabase
      .from('unit_data')
      .select('*');

    if (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to refresh unit data from database');
      return false;
    }

    console.log(`Reloaded ${data.length} units from database`);
    setAllUnits(data);
    toast.success('Unit data refreshed successfully');
    return true;
  };

  const verifyUnitImages = async () => {
    setLoadingImages(true);
    
    // First reload the unit data to ensure we have the latest information
    await reloadUnitData();
    
    const results: Record<string, {exists: boolean, url: string}> = {};
    let missingCount = 0;
    
    for (const unit of filteredUnits) {
      const unitId = unit.id;
      let imageUrl = '';
      
      // Special handling for units known to have issues
      const isSpecialCase = unit.name.includes('Lady Télia') || unit.name.includes('Drago');
      
      if (activeTab === 'portraits') {
        // Check portrait images
        imageUrl = `/art/portrait/${cleanUnitName(unit.name)}_portrait.jpg`;
      } else {
        // Check card images
        const baseUrl = unit.imageUrl || `/art/card/${cleanUnitName(unit.name)}_card.jpg`;
        imageUrl = baseUrl;
        
        // If checking cards and language is not English, check language-specific cards
        if (activeTab === 'cards-es' || activeTab === 'cards-fr') {
          const langSuffix = activeTab === 'cards-es' ? '_sp' : '_fr';
          if (imageUrl.endsWith('.jpg')) {
            imageUrl = imageUrl.replace('.jpg', `${langSuffix}.jpg`);
          } else if (imageUrl.endsWith('_card.jpg')) {
            imageUrl = imageUrl.replace('_card.jpg', `_card${langSuffix}.jpg`);
          }
        }
      }
      
      // Log debug info for problematic units
      if (isSpecialCase) {
        console.log(`Checking special case unit: ${unit.name}`);
        console.log(`Original name: ${unit.name}`);
        console.log(`Cleaned name: ${cleanUnitName(unit.name)}`);
        console.log(`Checking URL: ${imageUrl}`);
      }
      
      const exists = await checkImageExists(imageUrl);
      
      if (!exists) {
        missingCount++;
        console.warn(`Missing image for ${unit.name} at path: ${imageUrl}`);
      }
      
      results[unitId] = {
        url: imageUrl,
        exists: exists
      };
    }
    
    setImageResults(results);
    
    // Notify the user about the verification results
    if (missingCount > 0) {
      toast.warning(`Found ${missingCount} units with missing images out of ${filteredUnits.length} total`);
    } else if (filteredUnits.length > 0) {
      toast.success(`All ${filteredUnits.length} unit images verified successfully`);
    }
    
    setLoadingImages(false);
  };

  const copyToClipboard = (text: string, unitId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Update copy status for this specific unit
        setCopiedPaths(prev => ({
          ...prev,
          [unitId]: true
        }));
        
        toast.success("Path copied to clipboard");
        resetCopyStatus(unitId);
      })
      .catch(err => toast.error("Failed to copy: " + err));
  };

  const getImageStatus = (unit: any) => {
    if (!imageResults[unit.id]) {
      return null;
    }
    
    return imageResults[unit.id].exists ? (
      <div className="flex items-center text-green-500">
        <Check className="h-4 w-4 mr-1" /> 
        <span>Available</span>
      </div>
    ) : (
      <div className="flex items-center text-red-500">
        <X className="h-4 w-4 mr-1" /> 
        <span>Missing</span>
      </div>
    );
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'portraits': return 'Unit Portraits';
      case 'cards': return 'Card Images (English)';
      case 'cards-es': return 'Card Images (Spanish)';
      case 'cards-fr': return 'Card Images (French)';
      default: return 'Unit Images';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-warcrow-gold">Unit Image Validator</h2>
        <p className="text-warcrow-text/80">
          Verify if unit portraits and card images are properly linked and available.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 border-warcrow-gold/30"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterFaction} onValueChange={setFilterFaction}>
              <SelectTrigger className="bg-black/20 border-warcrow-gold/30">
                <SelectValue placeholder="Select Faction" />
              </SelectTrigger>
              <SelectContent>
                {factions.map(faction => (
                  <SelectItem key={faction.id} value={faction.id}>
                    {faction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={verifyUnitImages}
            disabled={loadingImages}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
          >
            {loadingImages ? 'Checking Images...' : 'Verify Images'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-black/50 border border-warcrow-gold/30">
            <TabsTrigger value="portraits">Portraits</TabsTrigger>
            <TabsTrigger value="cards">Cards (EN)</TabsTrigger>
            <TabsTrigger value="cards-es">Cards (ES)</TabsTrigger>
            <TabsTrigger value="cards-fr">Cards (FR)</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-4">
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardHeader>
                <CardTitle>{getTabTitle()}</CardTitle>
                <CardDescription>
                  {activeTab === 'portraits' 
                    ? 'Verify portrait images used in unit cards and lists.' 
                    : 'Verify card art images used in detailed unit views.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-warcrow-gold/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-black/60">
                        <TableHead>Unit Name (ID)</TableHead>
                        <TableHead>Faction</TableHead>
                        <TableHead className="min-w-[300px]">Image Path</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUnits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No units found. Adjust your search or faction filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUnits.map(unit => (
                          <TableRow key={unit.id} className="hover:bg-warcrow-gold/5">
                            <TableCell>
                              <div>{unit.name}</div>
                              <div className="text-xs text-warcrow-text/60 font-mono mt-1">{unit.id}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {unit.faction.replace(/-/g, ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[300px] group">
                              <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px] hover:text-warcrow-gold">
                                        {imageResults[unit.id]?.url || 'Not verified'}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-black/90 border-warcrow-gold/20 text-warcrow-text p-2 break-all max-w-[400px]">
                                      {imageResults[unit.id]?.url || 'Not verified'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {imageResults[unit.id]?.url && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-warcrow-gold/70 hover:text-warcrow-gold hover:bg-warcrow-gold/10"
                                    onClick={() => copyToClipboard(imageResults[unit.id].url, unit.id)}
                                    title="Copy path to clipboard"
                                  >
                                    {copiedPaths[unit.id] ? 
                                      <ClipboardCheck className="h-4 w-4" /> : 
                                      <Clipboard className="h-4 w-4" />}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getImageStatus(unit) || (
                                <span className="text-warcrow-text/50">Not checked</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                                onClick={() => {
                                  if (imageResults[unit.id]?.url) {
                                    window.open(imageResults[unit.id].url, '_blank');
                                  }
                                }}
                                disabled={!imageResults[unit.id]?.exists}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> 
            Image Naming Conventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-warcrow-gold">Portrait Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Portrait images should follow the naming convention: <code className="bg-black/30 px-1 rounded">/art/portrait/unit_name_portrait.jpg</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-warcrow-gold">Card Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Card images should follow the naming convention: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card.jpg</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-warcrow-gold">Localized Card Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Spanish: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card_sp.jpg</code><br />
                French: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card_fr.jpg</code>
              </p>
            </div>
            
            <div className="text-warcrow-text/80 bg-black/30 p-3 rounded mt-2">
              <strong>Note:</strong> Unit names in file paths should be lowercase with spaces replaced by underscores,
              and special characters removed (e.g., "Prime Warrior" becomes "prime_warrior").
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitImagesManager;
