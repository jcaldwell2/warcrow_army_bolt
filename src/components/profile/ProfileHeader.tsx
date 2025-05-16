
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useProfileSession } from "@/hooks/useProfileSession";
import { NavDropdown } from "@/components/ui/NavDropdown";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useProfileSession();
  
  return (
    <header className="bg-black/50 border-b border-warcrow-gold/20 backdrop-blur-sm">
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-warcrow-gold">Profile</h1>
          </div>
          
          {isAuthenticated && (
            <NavDropdown />
          )}
        </div>
      </div>
    </header>
  );
};
