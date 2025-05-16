
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateShareableLink } from "@/utils/shareListUtils";
import { SavedList, SelectedUnit } from "@/types/army";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShareDialogContent } from "./share/ShareDialogContent";

interface ShareExportButtonProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
  faction: string;
}

const ShareExportButton = ({ selectedUnits, listName, faction }: ShareExportButtonProps) => {
  const [open, setOpen] = useState(false);
  
  const tempList: SavedList = {
    id: `temp-${Date.now()}`,
    name: listName || "Untitled List",
    faction: faction,
    units: selectedUnits,
    created_at: new Date().toISOString()
  };
  
  const shareableLink = generateShareableLink(tempList);

  if (selectedUnits.length === 0 || !listName) {
    return null;
  }

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
        <ShareDialogContent 
          shareableLink={shareableLink}
          selectedUnits={selectedUnits}
          listName={listName}
          faction={faction}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShareExportButton;
