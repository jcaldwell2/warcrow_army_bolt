import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { decodeUrlToList } from "@/utils/shareListUtils";
import { SavedList } from "@/types/army";
import { factions } from "@/data/factions";
import ExportDialog from "@/components/army/ExportDialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "sonner";

const SharedList = () => {
  const { listCode } = useParams<{ listCode: string }>();
  const [listData, setListData] = useState<SavedList | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!listCode) {
      setError("No list code provided");
      console.error("No list code in params:", listCode);
      return;
    }
    
    try {
      const decodedList = decodeUrlToList(listCode);
      if (!decodedList) {
        setError("Invalid list data");
        console.error("Failed to decode list data for code:", listCode);
        return;
      }
      
      setListData(decodedList);
    } catch (err) {
      console.error("Error decoding list:", err);
      setError("Failed to load army list data");
    }
  }, [listCode]);

  const getFactionName = (factionId: string): string => {
    const faction = factions.find(f => f.id === factionId);
    return faction?.name || "Unknown Faction";
  };

  const renderUnit = (unit: any, index: number) => {
    const pointsCost = unit.pointsCost * (unit.quantity || 1);
    const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
    const highCommand = unit.highCommand ? " [High Command]" : "";
    
    return (
      <div 
        key={`${unit.id}-${index}`}
        className="flex justify-between p-3 bg-black/30 rounded-md mb-2 border border-warcrow-gold/20"
      >
        <div>
          <span className="text-warcrow-gold">{unit.name}</span>
          <span className="text-warcrow-text/70">{highCommand}{commandPoints}</span>
          <span className="ml-2 text-warcrow-text/70">×{unit.quantity || 1}</span>
        </div>
        <div className="text-warcrow-gold">{pointsCost} pts</div>
      </div>
    );
  };

  const printList = (courtesyList = false) => {
    if (!listData) return;

    const filteredUnits = courtesyList 
      ? listData.units.filter(unit => {
          const hasHiddenKeyword = Array.isArray(unit.keywords) && unit.keywords.some(keyword => {
            if (typeof keyword === 'string') {
              return keyword.toLowerCase() === 'scout' || keyword.toLowerCase() === 'ambusher';
            } else if (keyword && typeof keyword === 'object' && 'name' in keyword) {
              const keywordObj = keyword as { name: string };
              return keywordObj.name.toLowerCase() === 'scout' || keywordObj.name.toLowerCase() === 'ambusher';
            }
            return false;
          });
          return !hasHiddenKeyword;
        })
      : listData.units;

    const totalPoints = listData.units.reduce((sum, unit) => 
      sum + (unit.pointsCost * (unit.quantity || 1)), 0);
    
    const totalCommand = listData.units.reduce((sum, unit) => 
      sum + ((unit.command || 0) * (unit.quantity || 1)), 0);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Failed to open print window. Check your popup blocker.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${courtesyList ? "Courtesy List" : "Full List"} - ${listData.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 {
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #333;
            }
            .unit {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              border-bottom: 1px solid #eee;
            }
            .unit-name {
              font-weight: bold;
            }
            .meta {
              color: #666;
              font-style: italic;
            }
            .command {
              color: #8a6d3b;
              margin-left: 5px;
            }
            .totals {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 2px solid #333;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.8em;
              color: #666;
            }
            ${courtesyList ? '.notice { color: #8a6d3b; margin-top: 10px; font-style: italic; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${listData.name}</h1>
            <p>Faction: ${getFactionName(listData.faction)}</p>
            <p class="meta">Created: ${new Date(listData.created_at).toLocaleDateString()}</p>
            ${courtesyList ? '<p class="notice">Courtesy List - Scout and Ambusher units hidden</p>' : ''}
          </div>

          <h2>Units</h2>
          <div class="units">
            ${filteredUnits.map(unit => `
              <div class="unit">
                <div>
                  <span class="unit-name">${unit.name}</span>
                  ${unit.highCommand ? ' [High Command]' : ''}
                  ${unit.command ? `<span class="command">(${unit.command} CP)</span>` : ''}
                  ${unit.quantity > 1 ? ` ×${unit.quantity}` : ''}
                </div>
                <div>${unit.pointsCost * (unit.quantity || 1)} pts</div>
              </div>
            `).join('')}
          </div>

          <div class="totals">
            <div>Command Points: ${totalCommand} CP</div>
            <div>Total Points: ${totalPoints} pts</div>
          </div>

          <div class="footer">
            <p>Printed from Warcrow Army Builder</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="max-w-md p-6 bg-black/50 rounded-lg border border-warcrow-gold/20 text-center">
          <h1 className="text-xl text-warcrow-gold mb-4">Error Loading List</h1>
          <p>{error}</p>
          <p className="mt-4 text-sm text-warcrow-text/70">
            The list might be invalid or the link may have expired.
          </p>
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="max-w-md p-6 bg-black/50 rounded-lg border border-warcrow-gold/20 text-center">
          <h1 className="text-xl text-warcrow-gold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const totalPoints = listData.units.reduce(
    (total, unit) => total + unit.pointsCost * (unit.quantity || 1), 
    0
  );
  
  const totalCommand = listData.units.reduce(
    (total, unit) => total + ((unit.command || 0) * (unit.quantity || 1)),
    0
  );

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text p-4">
      <div className="max-w-3xl mx-auto bg-black/50 rounded-lg shadow-lg border border-warcrow-gold/20 p-6">
        <div className="mb-6 border-b border-warcrow-gold/20 pb-4">
          <h1 className="text-2xl font-bold text-warcrow-gold">{listData.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
            <div>
              <p className="text-warcrow-text/70">Faction: {getFactionName(listData.faction)}</p>
              <p className="text-sm text-warcrow-text/70">Created: {new Date(listData.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => printList(false)} 
                variant="outline"
                size="sm"
                className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                <Printer className="h-4 w-4 mr-1" />
                Full List
              </Button>
              <Button
                onClick={() => printList(true)}
                variant="outline"
                size="sm"
                className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                <Printer className="h-4 w-4 mr-1" />
                Courtesy List
              </Button>
              <ExportDialog selectedUnits={listData.units} listName={listData.name} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-3">Units</h2>
            <div className="space-y-2">
              {listData.units.map((unit, index) => renderUnit(unit, index))}
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-md border border-warcrow-gold/20">
            <div className="flex justify-between text-warcrow-gold">
              <span>Total Command Points:</span>
              <span>{totalCommand} CP</span>
            </div>
            <div className="flex justify-between text-warcrow-gold font-bold mt-1">
              <span>Total Points:</span>
              <span>{totalPoints} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedList;
