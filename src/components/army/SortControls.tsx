import { SortOption } from "@/types/army";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  return (
    <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
      <h2 className="text-2xl font-bold text-warcrow-gold whitespace-nowrap">
        Available Units
      </h2>
      <Select
        value={sortBy}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger className="w-[180px] bg-warcrow-background border-warcrow-accent text-warcrow-text hover:border-warcrow-gold focus:border-warcrow-gold">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-background border-warcrow-accent">
          <SelectItem value="points-asc" className="text-warcrow-text hover:bg-warcrow-accent focus:bg-warcrow-accent focus:text-warcrow-gold">Points ↑</SelectItem>
          <SelectItem value="points-desc" className="text-warcrow-text hover:bg-warcrow-accent focus:bg-warcrow-accent focus:text-warcrow-gold">Points ↓</SelectItem>
          <SelectItem value="name-asc" className="text-warcrow-text hover:bg-warcrow-accent focus:bg-warcrow-accent focus:text-warcrow-gold">Name A-Z</SelectItem>
          <SelectItem value="name-desc" className="text-warcrow-text hover:bg-warcrow-accent focus:bg-warcrow-accent focus:text-warcrow-gold">Name Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortControls;
