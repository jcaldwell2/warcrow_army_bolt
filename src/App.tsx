
import * as React from 'react';
import { ProvidersWrapper } from "@/components/providers/ProvidersWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <div className="dark">
      <ProvidersWrapper>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </ProvidersWrapper>
      
      <SonnerToaster 
        theme="dark" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#e0e0e0'
          }
        }}
      />
    </div>
  );
}

export default App;
