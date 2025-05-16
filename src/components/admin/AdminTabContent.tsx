
import React, { ReactNode } from 'react';

interface AdminTabContentProps {
  title: string;
  children: ReactNode;
}

const AdminTabContent = ({ title, children }: AdminTabContentProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-warcrow-gold">{title}</h2>
      <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminTabContent;
