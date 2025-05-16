
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { units as allUnits } from '@/data/factions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from "@/utils/translation";

// Map to normalize older faction naming to canonical kebab-case versions
const factionNameMap: Record<string, string> = {
  'Hegemony of Embersig': 'hegemony-of-embersig',
  'Northern Tribes': 'northern-tribes',
  'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
  'Sÿenann': 'syenann',
  'Syenann': 'syenann',
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth'
};

const SymbolExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t } = useLanguage();
  const { translateKeyword } = useTranslateKeyword();

  // Normalize all units to ensure consistent faction values
  const normalizedUnits = useMemo(() => {
    return allUnits.map(unit => {
      // Normalize faction name if needed
      const normalizedFaction = factionNameMap[unit.faction] || unit.faction;
      
      return {
        ...unit,
        faction: normalizedFaction,
      };
    });
  }, []);
  
  // Deduplicate units based on name and faction
  const deduplicatedUnits = useMemo(() => {
    const seen = new Map();
    return normalizedUnits.filter(unit => {
      const key = `${unit.name}_${unit.faction}`;
      if (seen.has(key)) {
        return false;
      }
      seen.set(key, true);
      return true;
    });
  }, [normalizedUnits]);

  // Get unique factions - ensure we're using the normalized factions from the data
  const factions = useMemo(() => {
    const uniqueFactions = new Set(deduplicatedUnits.map(unit => unit.faction));
    return Array.from(uniqueFactions).sort();
  }, [deduplicatedUnits]);

  // Get unique unit types (character, troop, etc.)
  const unitTypes = useMemo(() => {
    const types = new Set<string>();
    
    deduplicatedUnits.forEach(unit => {
      // Determine unit type based on keywords or other properties
      if (unit.highCommand) {
        types.add('high-command');
      } else if (unit.keywords?.some(k => {
        const keywordName = typeof k === 'string' ? k : k.name;
        return keywordName === 'Character';
      })) {
        types.add('character');
      } else {
        types.add('troop');
      }
    });
    
    return Array.from(types).sort();
  }, [deduplicatedUnits]);

  // Filter and sort units
  const filteredUnits = useMemo(() => {
    return deduplicatedUnits.filter(unit => {
      // Name filter
      const nameMatch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Faction filter
      const factionMatch = factionFilter === 'all' || unit.faction === factionFilter;
      
      // Type filter
      let typeMatch = true;
      if (typeFilter !== 'all') {
        if (typeFilter === 'high-command') {
          typeMatch = unit.highCommand === true;
        } else if (typeFilter === 'character') {
          typeMatch = unit.keywords?.some(k => {
            const keywordName = typeof k === 'string' ? k : k.name;
            return keywordName === 'Character';
          }) && !unit.highCommand;
        } else if (typeFilter === 'troop') {
          typeMatch = !unit.highCommand && !unit.keywords?.some(k => {
            const keywordName = typeof k === 'string' ? k : k.name;
            return keywordName === 'Character';
          });
        }
      }
      
      return nameMatch && factionMatch && typeMatch;
    }).sort((a, b) => {
      // Sort by faction first, then by name
      if (a.faction !== b.faction) {
        return a.faction.localeCompare(b.faction);
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, factionFilter, typeFilter, deduplicatedUnits]);

  // Format unit type for display
  const getUnitType = (unit: any) => {
    if (unit.highCommand) {
      return 'High Command';
    } else if (unit.keywords?.some(k => {
      const keywordName = typeof k === 'string' ? k : k.name;
      return keywordName === 'Character';
    })) {
      return 'Character';
    } else {
      return 'Troop';
    }
  };

  // Format keywords for display
  const formatKeywords = (unit: any) => {
    if (!unit.keywords || unit.keywords.length === 0) return '-';
    
    return unit.keywords.map(k => {
      const keywordName = typeof k === 'string' ? k : k.name;
      return translateKeyword(keywordName, 'en');
    }).join(', ');
  };

  // Format faction name for display (convert kebab-case to Title Case)
  const formatFactionName = (faction: string) => {
    return faction.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">{t('unitSymbols')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder={t('searchUnits')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-warcrow-accent/50 border-warcrow-gold/30"
          />
          
          <Select value={factionFilter} onValueChange={setFactionFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-warcrow-accent/50 border-warcrow-gold/30">
              <SelectValue placeholder={t('allFactions')} />
            </SelectTrigger>
            <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
              <SelectItem value="all">{t('allFactions')}</SelectItem>
              {factions.map(faction => (
                <SelectItem key={faction} value={faction}>
                  {formatFactionName(faction)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-warcrow-accent/50 border-warcrow-gold/30">
              <SelectValue placeholder={t('allTypes')} />
            </SelectTrigger>
            <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              {unitTypes.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded border-warcrow-gold/30 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">{t('faction')}</TableHead>
                <TableHead className="text-warcrow-gold">{t('type')}</TableHead>
                <TableHead className="text-warcrow-gold">{t('name')}</TableHead>
                <TableHead className="text-warcrow-gold">{t('id')}</TableHead>
                <TableHead className="text-warcrow-gold">{t('keywords')}</TableHead>
                <TableHead className="text-warcrow-gold">{t('points')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-warcrow-muted">
                    {t('noUnitsMatch')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit, index) => (
                  <TableRow key={`${unit.id}-${index}`} className="hover:bg-warcrow-accent/5">
                    <TableCell className="text-warcrow-text">{formatFactionName(unit.faction)}</TableCell>
                    <TableCell className="text-warcrow-text">{getUnitType(unit)}</TableCell>
                    <TableCell className="text-warcrow-text font-medium">{unit.name}</TableCell>
                    <TableCell className="text-warcrow-text/80 text-xs">{unit.id}</TableCell>
                    <TableCell className="text-warcrow-text">{formatKeywords(unit)}</TableCell>
                    <TableCell className="text-warcrow-text">{unit.pointsCost}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-sm text-warcrow-muted">
          {filteredUnits.length > 0 && (
            <p>
              {t('showing')} {filteredUnits.length} {filteredUnits.length === 1 ? t('unit') : t('units')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolExplorer;
