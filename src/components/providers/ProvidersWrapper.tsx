
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider } from "@/context/GameContext";
import { BrowserRouter as Router } from 'react-router-dom';

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export const ProvidersWrapper: React.FC<ProvidersWrapperProps> = ({ children }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GameProvider>
            <Router>
              {children}
              <Toaster />
            </Router>
          </GameProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
};
