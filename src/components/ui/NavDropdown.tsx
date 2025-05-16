
import React, { useState, useEffect } from 'react';
import { Menu, Bell, ActivityIcon, ShieldAlert, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsMenu } from "@/components/profile/NotificationsMenu";

export const NavDropdown = () => {
  const navigate = useNavigate();
  const [isTester, setIsTester] = useState(false);
  const [isWabAdmin, setIsWabAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUserRole = async () => {
      // Check for preview mode
      const isPreviewMode = window.location.hostname === 'lovableproject.com' || 
                      window.location.hostname.endsWith('.lovableproject.com');
      
      setIsPreview(isPreviewMode);
      
      if (isPreviewMode) {
        setIsTester(true);
        setIsWabAdmin(true);
        setIsAuthenticated(true);
        setUserId("preview-user-id");
        return;
      }
      
      // Check auth status and roles
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        setUserId(session.user.id);
        try {
          const { data } = await supabase
            .from('profiles')
            .select('tester, wab_admin')
            .eq('id', session.user.id)
            .single();
          
          setIsTester(!!data?.tester);
          setIsWabAdmin(!!data?.wab_admin);
        } catch (error) {
          console.error('Error checking user roles:', error);
          setIsTester(false);
          setIsWabAdmin(false);
        }
      }
    };
    
    checkUserRole();
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      {(isAuthenticated || isPreview) && (
        <NotificationsMenu userId={userId || "preview-user-id"} />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-black/90 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10 hover:text-warcrow-gold transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="ml-2">Navigation</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-black/90 border border-warcrow-gold/30 text-warcrow-text"
        >
          {(isAuthenticated || isPreview) && (
            <>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                onClick={() => navigate('/activity')}
              >
                <ActivityIcon className="h-4 w-4 mr-2" />
                Activity Feed
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-warcrow-gold/20" />
            </>
          )}
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/builder')}
          >
            Army Builder
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/missions')}
          >
            Missions
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/rules')}
          >
            Rules
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/faq')}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/profile')}
          >
            Profile
          </DropdownMenuItem>
          
          {isWabAdmin && (
            <>
              <DropdownMenuSeparator className="bg-warcrow-gold/20" />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-warcrow-gold font-medium">
                  <ShieldAlert className="h-4 w-4 inline-block mr-2" />
                  Admin Functions
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                  onClick={() => navigate('/mail')}
                >
                  Email Management
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/')}
          >
            Home
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
