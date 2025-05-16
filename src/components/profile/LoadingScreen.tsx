
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => (
  <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
  </div>
);
