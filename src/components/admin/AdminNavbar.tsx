
import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Bell,
  FileText,
  Swords,
  Globe,
  Server,
  Database,
  Check,
  Image
} from "lucide-react";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar = ({ activeTab, setActiveTab }: AdminNavbarProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "units", label: "Units", icon: <Swords className="h-4 w-4" /> },
    { id: "unit-validation", label: "Validate Units", icon: <Check className="h-4 w-4" /> },
    { id: "unit-images", label: "Unit Images", icon: <Image className="h-4 w-4" /> },
    { id: "rules", label: "Rules", icon: <BookOpen className="h-4 w-4" /> },
    { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "news", label: "News", icon: <FileText className="h-4 w-4" /> },
    { id: "translation", label: "Translation", icon: <Globe className="h-4 w-4" /> },
    { id: "api", label: "API Status", icon: <Server className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8 admin-nav bg-black/95 p-4 rounded-lg border border-warcrow-gold/50 shadow-md">
      <div className="flex flex-wrap gap-2 justify-start">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            variant={activeTab === item.id ? "default" : "outline"}
            className={
              activeTab === item.id
                ? "bg-warcrow-gold hover:bg-warcrow-gold/90 text-black font-medium"
                : "border-warcrow-gold/50 bg-black hover:bg-warcrow-gold/20 text-warcrow-gold font-medium"
            }
            size="sm"
          >
            {item.icon}
            <span className="ml-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavbar;
