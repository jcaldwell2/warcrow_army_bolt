
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslateKeyword } from '@/utils/translation';
import { formatFactionName, getUnitType, formatKeywords } from './utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileSession } from '@/hooks/useProfileSession';

interface UnitTableProps {
  filteredUnits: any[];
  t: (key: string) => string;
  isLoading?: boolean;
}

export const UnitTable: React.FC<UnitTableProps> = ({
  filteredUnits,
  t,
  isLoading = false
}) => {
  const { translateKeyword } = useTranslateKeyword();
  const [updatingUnits, setUpdatingUnits] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();
  const { isAuthenticated } = useProfileSession();
  
  // Create a wrapper function that only takes the keyword parameter
  // This matches the expected function signature in formatKeywords
  const translateKeywordWrapper = (keyword: string) => {
    return translateKeyword(keyword, 'en');
  };
  
  // Helper to show translation indicators
  const getTranslationStatus = (unit: any) => {
    const hasSpanish = unit.name_es && unit.name_es.trim() !== '';
    const hasFrench = unit.name_fr && unit.name_fr.trim() !== '';
    
    return (
      <div className="flex gap-1">
        {hasSpanish && <Badge className="bg-green-600/70 hover:bg-green-700 text-xs py-0 px-1">ES</Badge>}
        {!hasSpanish && <Badge className="bg-red-600/70 hover:bg-red-700 text-xs py-0 px-1">ES</Badge>}
        
        {hasFrench && <Badge className="bg-green-600/70 hover:bg-green-700 text-xs py-0 px-1">FR</Badge>}
        {!hasFrench && <Badge className="bg-red-600/70 hover:bg-red-700 text-xs py-0 px-1">FR</Badge>}
      </div>
    );
  };

  // Handle visibility toggle
  const handleVisibilityToggle = async (unit: any, isVisible: boolean) => {
    setUpdatingUnits(prev => ({ ...prev, [unit.id]: true }));
    
    try {
      // Get current characteristics or create new object if it doesn't exist
      const characteristics = unit.characteristics || {};
      
      // Update the visibility in characteristics
      const updatedCharacteristics = {
        ...characteristics,
        showInBuilder: isVisible
      };
      
      // Update the unit data in Supabase
      const { error } = await supabase
        .from('unit_data')
        .update({
          characteristics: updatedCharacteristics
        })
        .eq('id', unit.id);
      
      if (error) throw error;
      
      // Show success toast
      toast.success(isVisible 
        ? t('unitNowVisibleInBuilder') || 'Unit is now visible in army builder' 
        : t('unitNowHiddenFromBuilder') || 'Unit is now hidden from army builder'
      );
    } catch (error: any) {
      console.error('Error updating unit visibility:', error);
      toast.error(t('errorUpdatingUnit') || 'Error updating unit');
    } finally {
      setUpdatingUnits(prev => ({ ...prev, [unit.id]: false }));
    }
  };
  
  // Navigate to unit edit page
  const handleEditUnit = (unitId: string) => {
    navigate(`/admin/units/edit/${unitId}`);
  };
  
  return (
    <div className="border rounded border-warcrow-gold/30 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
            <TableHead className="text-warcrow-gold">{t('visibility')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('faction')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('type')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('name')}</TableHead>
            <TableHead className="text-warcrow-gold">Trans</TableHead>
            <TableHead className="text-warcrow-gold">CMD</TableHead>
            <TableHead className="text-warcrow-gold">AVB</TableHead>
            <TableHead className="text-warcrow-gold">{t('keywords')}</TableHead>
            <TableHead className="text-warcrow-gold">HC</TableHead>
            <TableHead className="text-warcrow-gold">Pts</TableHead>
            <TableHead className="text-warcrow-gold">{t('specialRules')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-6 text-warcrow-muted">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  {t('loading')}...
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUnits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-6 text-warcrow-muted">
                {t('noUnitsMatch')}
              </TableCell>
            </TableRow>
          ) : (
            filteredUnits.map((unit, index) => (
              <TableRow key={`${unit.id}-${index}`} className="hover:bg-warcrow-accent/5">
                <TableCell className="text-warcrow-text">
                  <Switch
                    checked={unit.characteristics?.showInBuilder !== false}
                    onCheckedChange={(checked) => handleVisibilityToggle(unit, checked)}
                    disabled={updatingUnits[unit.id]}
                    className="data-[state=checked]:bg-warcrow-gold"
                  />
                </TableCell>
                <TableCell className="text-warcrow-text">{formatFactionName(unit.faction)}</TableCell>
                <TableCell className="text-warcrow-text">{getUnitType(unit)}</TableCell>
                <TableCell className="text-warcrow-text font-medium">{unit.name}</TableCell>
                <TableCell className="text-warcrow-text">{getTranslationStatus(unit)}</TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.command || unit.command || '0'}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.availability || unit.availability || '0'}
                </TableCell>
                <TableCell className="text-warcrow-text">{formatKeywords(unit, translateKeywordWrapper)}</TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.highCommand || unit.highCommand ? 'Yes' : 'No'}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.points || unit.points || unit.pointsCost || 0}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.special_rules?.length || 0}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-warcrow-gold hover:text-warcrow-gold/70"
                    onClick={() => handleEditUnit(unit.id)}
                    title={t('editUnit')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
