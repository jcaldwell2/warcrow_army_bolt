
import React from 'react';
import { NavDropdown } from "@/components/ui/NavDropdown";

interface PageHeaderProps {
  title: string;
  logoUrl?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ 
  title, 
  logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z", 
  children 
}: PageHeaderProps) => {
  return (
    <div className="bg-black/95 border-b border-warcrow-gold/50 shadow-md p-2 md:p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mx-auto md:mx-0">
            <img 
              src={logoUrl}
              alt="Warcrow Logo" 
              className="h-12 md:h-16"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-warcrow-gold text-center md:text-left">{title}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
            {children}
            <NavDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};
