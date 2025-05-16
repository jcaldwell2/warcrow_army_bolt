
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SelectedUnit } from "@/types/army";
import { factions } from "@/data/factions";

interface ExportDialogProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
}

const ExportDialog = ({ selectedUnits, listName }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Get faction name from the first unit (all units should be from same faction)
  const factionId = selectedUnits[0]?.faction;
  const factionName = factions.find(f => f.id === factionId)?.name || "Unknown Faction";

  // Sort units to put High Command first
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  const listText = `${listName || "Untitled List"}\nFaction: ${factionName}\n\n${sortedUnits
    .map((unit) => {
      const highCommandLabel = unit.highCommand ? " [High Command]" : "";
      const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
      return `${unit.name}${highCommandLabel}${commandPoints} x${unit.quantity} (${unit.pointsCost * unit.quantity} pts)`;
    })
    .join("\n")}`;

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  const totalCommand = selectedUnits.reduce(
    (total, unit) => total + ((unit.command || 0) * unit.quantity),
    0
  );

  const fullText = `${listText}\n\nTotal Command Points: ${totalCommand}\nTotal Points: ${totalPoints}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: "Copied to clipboard",
        description: "Army list has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to Text
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/50">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Export Army List</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-warcrow-accent p-4 rounded-lg text-warcrow-text font-mono text-sm max-h-[70vh] overflow-y-auto">
            {fullText}
          </pre>
          <Button
            onClick={handleCopy}
            className="mt-4 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
