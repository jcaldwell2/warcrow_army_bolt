
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

interface SymbolControlsProps {
  onCopy: () => void;
  copied: boolean;
}

const SymbolControls: React.FC<SymbolControlsProps> = ({ onCopy, copied }) => {
  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={onCopy}
        className="px-3 py-1 bg-warcrow-gold text-warcrow-background text-xs font-medium rounded hover:bg-warcrow-gold/80 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const FontSymbolExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [symbolsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample symbols - in a real app, these would be loaded from a data source
  const allSymbols = [
    { id: '1', code: '⚔️', name: 'Sword', description: 'Represents combat or attack' },
    { id: '2', code: '🛡️', name: 'Shield', description: 'Represents defense' },
    { id: '3', code: '🏹', name: 'Bow', description: 'Represents ranged attack' },
    // More symbols would be defined here
  ];

  const filteredSymbols = allSymbols.filter(symbol =>
    symbol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symbol.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSymbols.length / symbolsPerPage);
  const indexOfLastSymbol = currentPage * symbolsPerPage;
  const indexOfFirstSymbol = indexOfLastSymbol - symbolsPerPage;
  const currentSymbols = filteredSymbols.slice(indexOfFirstSymbol, indexOfLastSymbol);

  const handleCopySymbol = (symbolCode: string) => {
    navigator.clipboard.writeText(symbolCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">{t('fontSymbolExplorer')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-warcrow-text">
          <p>{t('fontSymbolExplorerDescription')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {currentSymbols.map(symbol => (
            <div 
              key={symbol.id}
              className="p-3 border border-warcrow-gold/30 rounded-md bg-warcrow-accent/30 flex flex-col items-center"
            >
              <div className="text-4xl mb-2">{symbol.code}</div>
              <div className="text-sm font-medium text-warcrow-text">{symbol.name}</div>
              <div className="text-xs text-warcrow-muted text-center mt-1">{symbol.description}</div>
              <SymbolControls 
                onCopy={() => handleCopySymbol(symbol.code)} 
                copied={copied}
              />
            </div>
          ))}
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-warcrow-gold text-warcrow-background'
                    : 'bg-warcrow-accent/50 text-warcrow-text hover:bg-warcrow-accent'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FontSymbolExplorer;
