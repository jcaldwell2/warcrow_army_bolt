
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  isTester: boolean;
  userId: string | null;
  isLoading: boolean;
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isAdmin: false,
  isTester: false,
  userId: null,
  isLoading: true,
  isGuest: false,
  setIsGuest: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTester, setIsTester] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Check for preview mode
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // For preview environment, provide dummy authenticated state
        if (isPreview) {
          console.log("Preview mode detected in AuthProvider, using demo auth state");
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setUserId("preview-user-id");
            setIsGuest(false);
          }
          setIsLoading(false);
          return;
        }

        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed in AuthProvider:", event);
            const authState = !!session;
            
            if (mounted) {
              setIsAuthenticated(authState);
              setUserId(session?.user?.id || null);
              
              if (session?.user?.id) {
                // Get user role information
                const { data, error } = await supabase
                  .from('profiles')
                  .select('wab_admin, tester')
                  .eq('id', session.user.id)
                  .single();
                  
                if (!error && data && mounted) {
                  setIsAdmin(!!data.wab_admin);
                  setIsTester(!!data.tester);
                }
              } else {
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                }
              }
            }
          }
        );
        
        // Get initial session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (mounted) {
          setIsAuthenticated(!!session);
          setUserId(session?.user?.id || null);
          
          if (session?.user?.id) {
            // Get user role information
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('wab_admin, tester')
                .eq('id', session.user.id)
                .single();
                
              if (!error && data && mounted) {
                setIsAdmin(!!data.wab_admin);
                setIsTester(!!data.tester);
              }
            } catch (err) {
              console.error("Error checking user roles in AuthProvider:", err);
            }
          }
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in AuthProvider:", error);
        if (mounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [isPreview]);

  const value = {
    isAuthenticated,
    isAdmin,
    isTester,
    userId,
    isLoading,
    isGuest,
    setIsGuest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
