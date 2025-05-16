
import { useState, useEffect } from "react";
import { SavedList, SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudOff, Eye } from "lucide-react";
import ShareListButton from "@/components/army/ShareListButton";

interface ArmyListsSectionProps {
  onListSelect: (list: SavedList) => void;
}

export const ArmyListsSection = ({ onListSelect }: ArmyListsSectionProps) => {
  const [localLists, setLocalLists] = useState<SavedList[]>([]);
  const [cloudLists, setCloudLists] = useState<SavedList[]>([]);

  useEffect(() => {
    // Load local lists
    const localData = localStorage.getItem("armyLists");
    if (localData) {
      setLocalLists(JSON.parse(localData));
    }

    // Load cloud lists
    const loadCloudLists = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('army_lists')
        .select('*')
        .eq('user_id', session.user.id);

      if (!error && data) {
        // Convert the data to match SavedList type
        const convertedLists: SavedList[] = data.map(list => ({
          id: list.id,
          name: list.name,
          faction: list.faction,
          units: Array.isArray(list.units) ? list.units.map((unit: any) => ({
            id: unit.id,
            name: unit.name,
            pointsCost: unit.pointsCost,
            faction: unit.faction,
            keywords: unit.keywords || [],
            highCommand: unit.highCommand || false,
            availability: unit.availability || 1,
            imageUrl: unit.imageUrl,
            specialRules: unit.specialRules || [],
            command: unit.command,
            quantity: unit.quantity || 1
          } as SelectedUnit)) : [],
          created_at: list.created_at,
          user_id: list.user_id
        }));
        setCloudLists(convertedLists);
      }
    };

    loadCloudLists();
  }, []);

  const renderList = (list: SavedList, isCloud: boolean) => (
    <div key={list.id} className="flex items-center justify-between bg-warcrow-background/50 p-3 rounded-lg mb-2">
      <div className="flex items-center gap-2">
        {isCloud ? (
          <Cloud className="h-4 w-4 text-blue-500" />
        ) : (
          <CloudOff className="h-4 w-4 text-gray-500" />
        )}
        <span className="text-warcrow-text">{list.name}</span>
        <span className="text-warcrow-gold/60 text-sm">({list.faction})</span>
      </div>
      <div className="flex items-center gap-2">
        <ShareListButton list={list} />
        <Button
          onClick={() => onListSelect(list)}
          variant="outline"
          className="bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {cloudLists.length > 0 && (
        <Card className="bg-black/50 border-warcrow-gold/20">
          <CardHeader>
            <CardTitle className="text-warcrow-gold">Cloud Lists</CardTitle>
          </CardHeader>
          <CardContent>
            {cloudLists.map(list => renderList(list, true))}
          </CardContent>
        </Card>
      )}

      {localLists.length > 0 && (
        <Card className="bg-black/50 border-warcrow-gold/20">
          <CardHeader>
            <CardTitle className="text-warcrow-gold">Local Lists</CardTitle>
          </CardHeader>
          <CardContent>
            {localLists.map(list => renderList(list, false))}
          </CardContent>
        </Card>
      )}

      {cloudLists.length === 0 && localLists.length === 0 && (
        <div className="text-center text-warcrow-text/60">
          No army lists saved yet.
        </div>
      )}
    </div>
  );
};
