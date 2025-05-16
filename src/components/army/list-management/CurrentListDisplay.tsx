interface CurrentListDisplayProps {
  currentListName: string | null;
}

const CurrentListDisplay = ({ currentListName }: CurrentListDisplayProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-warcrow-text whitespace-nowrap">Current List:</span>
      <span className="text-warcrow-gold font-semibold">
        {currentListName || "New List"}
      </span>
    </div>
  );
};

export default CurrentListDisplay;