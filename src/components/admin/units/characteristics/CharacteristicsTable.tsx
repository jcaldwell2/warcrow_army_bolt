
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLanguage } from '@/contexts/LanguageContext';

interface CharacteristicsTableProps {
  characteristics: any;
}

const CharacteristicsTable: React.FC<CharacteristicsTableProps> = ({ characteristics }) => {
  const { t, language } = useLanguage();

  // For global table view without specific unit characteristics
  if (!characteristics) {
    return (
      <div className="text-warcrow-text text-sm">No characteristics selected.</div>
    );
  }

  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? '✅' : '❌';
    }
    return value;
  };

  // Filter out empty values
  const activeCharacteristics = Object.entries(characteristics)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b));

  if (activeCharacteristics.length === 0) {
    return (
      <div className="text-warcrow-text text-sm">No characteristics defined for this unit.</div>
    );
  }

  return (
    <Table className="border border-warcrow-gold/20">
      <TableHeader className="bg-black/30">
        <TableRow>
          <TableHead className="text-warcrow-gold font-medium">{t('characteristic')}</TableHead>
          <TableHead className="text-warcrow-gold font-medium">{t('value')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeCharacteristics.map(([name, value]) => (
          <TableRow key={name} className="border-warcrow-gold/10">
            <TableCell className="text-warcrow-text font-medium capitalize">{t(name)}</TableCell>
            <TableCell className="text-warcrow-text">{formatValue(value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CharacteristicsTable;
