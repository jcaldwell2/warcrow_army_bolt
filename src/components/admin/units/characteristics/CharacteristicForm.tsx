
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CharacteristicItem {
  id?: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

interface CharacteristicFormProps {
  editingCharacteristic: CharacteristicItem;
  setEditingCharacteristic: React.Dispatch<React.SetStateAction<CharacteristicItem | null>>;
  saveCharacteristic: () => Promise<void>;
}

const CharacteristicForm: React.FC<CharacteristicFormProps> = ({
  editingCharacteristic,
  setEditingCharacteristic,
  saveCharacteristic
}) => {
  
  const handleChange = (field: keyof CharacteristicItem, value: string) => {
    setEditingCharacteristic(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  return (
    <Card className="p-4 border-warcrow-gold bg-black/70">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (English)</label>
          <Input 
            value={editingCharacteristic.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-black border-warcrow-gold/50"
          />
        </div>

        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (Spanish)</label>
          <Input 
            value={editingCharacteristic.name_es || ''}
            onChange={(e) => handleChange('name_es', e.target.value)}
            className="bg-black border-warcrow-gold/50"
          />
        </div>

        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (French)</label>
          <Input 
            value={editingCharacteristic.name_fr || ''}
            onChange={(e) => handleChange('name_fr', e.target.value)}
            className="bg-black border-warcrow-gold/50"
          />
        </div>
        
        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Description (English)</label>
          <Textarea 
            value={editingCharacteristic.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="bg-black border-warcrow-gold/50 h-24"
          />
        </div>
        
        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Description (Spanish)</label>
          <Textarea 
            value={editingCharacteristic.description_es || ''}
            onChange={(e) => handleChange('description_es', e.target.value)}
            className="bg-black border-warcrow-gold/50 h-24"
          />
        </div>
        
        <div>
          <label className="text-sm text-warcrow-text/90 mb-1 block">Description (French)</label>
          <Textarea 
            value={editingCharacteristic.description_fr || ''}
            onChange={(e) => handleChange('description_fr', e.target.value)}
            className="bg-black border-warcrow-gold/50 h-24"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setEditingCharacteristic(null)}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
            onClick={saveCharacteristic}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CharacteristicForm;
