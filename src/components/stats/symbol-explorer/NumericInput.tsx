
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface NumericInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = Infinity
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={decrement}
        disabled={value <= min}
        className="h-8 w-8 border-warcrow-gold/30 text-warcrow-text"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="bg-black/60 border-warcrow-gold/30 text-warcrow-text w-20 text-center"
      />
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={increment}
        disabled={value >= max}
        className="h-8 w-8 border-warcrow-gold/30 text-warcrow-text"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
