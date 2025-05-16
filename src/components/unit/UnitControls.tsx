
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface UnitControlsProps {
  quantity: number;
  availability: number;
  pointsCost: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitControls = ({ quantity, availability, pointsCost, onAdd, onRemove }: UnitControlsProps) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          disabled={quantity === 0}
          className="h-7 w-7 bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background disabled:opacity-50 disabled:hover:bg-warcrow-background disabled:hover:text-warcrow-gold"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-warcrow-text min-w-[2rem] text-center text-sm">
          {quantity}/{availability}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onAdd}
          disabled={quantity >= availability}
          className="h-7 w-7 bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background disabled:opacity-50 disabled:hover:bg-warcrow-background disabled:hover:text-warcrow-gold"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default UnitControls;
