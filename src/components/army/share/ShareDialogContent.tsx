
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Printer, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SelectedUnit } from "@/types/army";
import { generateListText, filterUnitsForCourtesy } from "@/utils/listFormatUtils";
import { PrintListContent } from "./PrintListContent";

interface ShareDialogContentProps {
  shareableLink: string;
  selectedUnits: SelectedUnit[];
  listName: string | null;
  faction: string;
}

export const ShareDialogContent = ({ shareableLink, selectedUnits, listName, faction }: ShareDialogContentProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyExport = async () => {
    try {
      const exportText = generateListText(selectedUnits, listName, faction);
      await navigator.clipboard.writeText(exportText);
      toast.success("Army list has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy text to clipboard");
    }
  };

  const printList = (courtesyList = false) => {
    const filteredUnits = courtesyList ? filterUnitsForCourtesy(selectedUnits) : selectedUnits;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Failed to open print window. Check your popup blocker.");
      return;
    }

    printWindow.document.write(PrintListContent({ 
      units: filteredUnits, 
      listName, 
      faction, 
      isCourtesyList: courtesyList 
    }));

    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    });
  };

  return (
    <ScrollArea className="h-[80vh] md:h-[60vh] pr-4">
      <div className="space-y-3">
        <p className="text-warcrow-text text-sm">
          Share this link with others to view "{listName}" list:
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
          
          <div className="border-t border-warcrow-gold/20 pt-3 mt-2">
            <h4 className="text-warcrow-gold font-medium text-sm mb-2">Export as Text</h4>
            <pre className="whitespace-pre-wrap bg-warcrow-accent p-3 rounded-lg text-warcrow-text font-mono text-xs max-h-[150px] overflow-y-auto">
              {generateListText(selectedUnits, listName, faction)}
            </pre>
            <Button
              onClick={handleCopyExport}
              size="sm"
              className="mt-2 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
