
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewListButtonProps {
  onNewList: () => void;
}

const NewListButton = ({ onNewList }: NewListButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button
      onClick={onNewList}
      variant="outline"
      className="w-full bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
    >
      <FilePlus className="h-4 w-4 mr-2" />
      {t('newList')}
    </Button>
  );
};

export default NewListButton;
