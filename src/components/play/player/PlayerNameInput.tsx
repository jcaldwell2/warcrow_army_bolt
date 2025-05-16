
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PlayerNameInputProps {
  playerName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  index: number;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({
  playerName,
  onChange,
  index
}) => {
  return (
    <div>
      <Label htmlFor={`player-name-${index}`}>Player Name</Label>
      <Input
        id={`player-name-${index}`}
        value={playerName}
        onChange={onChange}
        placeholder="Enter player name..."
        className="mt-1"
      />
    </div>
  );
};

export default PlayerNameInput;
