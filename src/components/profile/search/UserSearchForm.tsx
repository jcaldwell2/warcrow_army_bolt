
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  isSearching: boolean;
}

export const UserSearchForm = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isSearching 
}: UserSearchFormProps) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={handleSearch} className="space-y-4 mt-2">
      <div className="flex gap-2">
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isSearching}
          className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
