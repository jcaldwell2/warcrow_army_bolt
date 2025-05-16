
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateShareableLink } from "@/utils/shareListUtils";
import { SavedList } from "@/types/army";
import { toast } from "sonner";
import { Share2, Check, Copy, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShareListButtonProps {
  list: SavedList;
}

const ShareListButton = ({ list }: ShareListButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareableLink = generateShareableLink(list);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };

  const printList = (courtesyList = false) => {
    // Filter out scout/ambusher units if printing courtesy list
    const filteredUnits = courtesyList 
      ? list.units.filter(unit => {
          // Check if the unit has either "Scout" or "Ambusher" keywords
          const hasHiddenKeyword = Array.isArray(unit.keywords) && unit.keywords.some(keyword => {
            // Handle both string keywords and keyword objects
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
      : list.units;

    // Calculate totals for ALL units, regardless of filtering
    const totalPoints = list.units.reduce((sum, unit) => 
      sum + (unit.pointsCost * (unit.quantity || 1)), 0);
    
    const totalCommand = list.units.reduce((sum, unit) => 
      sum + ((unit.command || 0) * (unit.quantity || 1)), 0);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Failed to open print window. Check your popup blocker.");
      return;
    }

    // Get faction name
    const getFactionName = () => {
      // If faction is directly a string, return it
      if (typeof list.faction === 'string') {
        return list.faction;
      }
      // Otherwise, return Unknown Faction
      return "Unknown Faction";
    };

    // Add print content
    printWindow.document.write(`
      <html>
        <head>
          <title>${courtesyList ? "Courtesy List" : "Full List"} - ${list.name}</title>
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
            <h1>${list.name}</h1>
            <p>Faction: ${getFactionName()}</p>
            <p class="meta">Created: ${new Date(list.created_at).toLocaleDateString()}</p>
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

    // Trigger print and close window after printing
    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      // Close window after print
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/50 w-[95%] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold text-lg">Share Army List</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[80vh] md:h-[60vh] pr-4">
          <div className="space-y-3">
            <p className="text-warcrow-text text-sm">
              Share this link with others to let them view your "{list.name}" list:
            </p>
            
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={shareableLink} 
                readOnly
                className="w-full p-1.5 text-sm bg-black/50 border border-warcrow-gold/30 rounded text-warcrow-gold"
              />
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-xs text-warcrow-text/70">
              Anyone with this link can view your army list without needing to log in. 
              <span className="text-warcrow-gold"> The link is now compressed for easier sharing.</span>
            </div>

            <div className="border-t border-warcrow-gold/20 pt-3 mt-3">
              <h3 className="text-warcrow-gold font-medium text-sm mb-2">Print Options</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => printList(false)} 
                  variant="outline"
                  size="sm"
                  className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print Full List
                </Button>
                <Button
                  onClick={() => printList(true)}
                  variant="outline"
                  size="sm"
                  className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print Courtesy List
                </Button>
              </div>
              <p className="text-xs text-warcrow-text/70 mt-2">
                Courtesy List hides units with Scout or Ambusher keywords for tournament play.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListButton;
