import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { File, Check, X, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { Unit } from '@/types/game';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

interface ListUploaderProps {
  playerId: string;
  onListUpload: (playerId: string, listContent: string, parsedUnits?: Unit[], listMetadata?: ListMetadata) => void;
  hasUploadedList: boolean;
}

const ListUploader: React.FC<ListUploaderProps> = ({ 
  playerId, 
  onListUpload,
  hasUploadedList
}) => {
  const [listText, setListText] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState(!hasUploadedList);
  const [isOpen, setIsOpen] = useState(false);

  const parseList = (content: string): { units: Unit[], metadata: ListMetadata } => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const units: Unit[] = [];
    const metadata: ListMetadata = {};
    
    if (lines.length > 0) {
      metadata.title = lines[0];
    }
    
    if (lines.length > 1) {
      metadata.faction = lines[1];
    }
    
    let foundCp = false;
    let foundPoints = false;
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      
      const cpRegex = /(?:command\s*points?|cp)[\s:]*(\d+)/i;
      const cpMatch = line.match(cpRegex);
      
      if (!foundCp && (cpMatch || 
          line.toLowerCase().includes('command point') || 
          line.toLowerCase().includes(' cp ') ||
          line.match(/\bcp:?\s*\d+\b/i))) {
        
        if (cpMatch && cpMatch[1]) {
          metadata.commandPoints = cpMatch[1] + " CP";
        } else {
          let cpText = line;
          cpText = cpText.replace(/^.*?(\d+\s*(?:command\s*points?|cp))/i, '$1');
          cpText = cpText.replace(/(\d+\s*(?:command\s*points?|cp)).*$/i, '$1');
          cpText = cpText.replace(/(\d+)\s*(?:command\s*points?|cp)/i, '$1 CP');
          
          metadata.commandPoints = cpText;
        }
        
        foundCp = true;
        continue;
      }
      
      if (!foundPoints && 
          ((line.toLowerCase().includes('total') && line.toLowerCase().includes('point')) || 
           (line.toLowerCase().includes('pts') && line.toLowerCase().includes('total')) ||
           line.match(/\d+\s*(?:pts|points)\s*$/i))) {
        metadata.totalPoints = line;
        foundPoints = true;
        continue;
      }
      
      if (line.length < 3 || line.toUpperCase() === line && line.length < 8 || 
          line.includes('POINTS:') || line.includes('TOTAL:') ||
          line.includes('====') || line.includes('----') ||
          line.match(/^[+\-*•=]+$/) || line.match(/^\d+\.$/) ||
          line.toLowerCase() === 'units' || line.toLowerCase() === 'unit' ||
          line.match(/^(infantry|cavalry|artillery|monsters|heroes|characters)$/i)) {
        continue;
      }
      
      let unitName = line;
      
      unitName = unitName.replace(/\s+\d+\s*(?:pts|points|pt)/i, '');
      
      unitName = unitName.replace(/\s*\(.*?\)\s*/g, ' ');
      
      unitName = unitName.replace(/^\s*(?:\d+[.)]\s*|[•\-+*]\s*|\[\s*\d+\s*\]\s*)/g, '');
      
      unitName = unitName.replace(/[.:,;]+$/, '').trim();
      
      if (unitName && unitName.length >= 3) {
        if (unitName.length > 50) {
          unitName = unitName.substring(0, 47) + '...';
        }
        
        units.push({
          id: `unit-${playerId}-${i}`,
          name: unitName,
          player: playerId
        });
      }
    }
    
    return { units, metadata };
  };

  const handleManualSubmit = () => {
    if (listText.trim().length === 0) {
      toast.error('Please enter your list details');
      return;
    }
    
    const { units, metadata } = parseList(listText);
    
    onListUpload(playerId, listText, units, metadata);
    setIsManualInput(false);
    setIsOpen(false);
    toast.success(`List saved successfully! Found ${units.length} units.`);
  };

  if (hasUploadedList && !isManualInput) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">List Uploaded</h3>
            <p className="text-xs text-green-600">Your army list has been saved</p>
          </div>
        </div>
        <button 
          onClick={() => setIsManualInput(true)}
          className="text-sm text-green-700 hover:text-green-800 underline flex items-center gap-1"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </motion.div>
    );
  }

  if (isManualInput) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center bg-warcrow-background border-warcrow-accent text-warcrow-text"
            >
              <span>{hasUploadedList ? "Edit Army List" : "Enter Army List"}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-full max-w-[400px] p-4 space-y-4 bg-warcrow-background border-warcrow-accent text-warcrow-text"
            align="start"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-warcrow-gold">Enter Army List</h3>
              {hasUploadedList && (
                <button
                  onClick={() => {
                    setIsManualInput(false);
                    setIsOpen(false);
                  }}
                  className="w-6 h-6 rounded-full bg-warcrow-accent flex items-center justify-center text-warcrow-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Textarea
              value={listText}
              onChange={(e) => setListText(e.target.value)}
              className="w-full h-40 p-3 border rounded-md text-sm font-mono bg-warcrow-background border-warcrow-accent text-warcrow-text"
              placeholder="Paste or type your army list here..."
            />
            <div className="flex justify-end">
              <Button
                onClick={handleManualSubmit}
                variant="default"
                className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              >
                Save List
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center bg-warcrow-background border-warcrow-accent text-warcrow-text"
          >
            <span>Enter Army List</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-full max-w-[400px] p-4 space-y-4 bg-warcrow-background border-warcrow-accent text-warcrow-text"
          align="start"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-warcrow-gold">Enter Army List</h3>
          </div>
          <Textarea
            value={listText}
            onChange={(e) => setListText(e.target.value)}
            className="w-full h-40 p-3 border rounded-md text-sm font-mono bg-warcrow-background border-warcrow-accent text-warcrow-text"
            placeholder="Paste or type your army list here..."
          />
          <div className="flex justify-end">
            <Button
              onClick={handleManualSubmit}
              variant="default"
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
            >
              Save List
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default ListUploader;
