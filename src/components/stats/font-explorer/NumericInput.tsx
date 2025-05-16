
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface NumericInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    let newValue = parseInt(inputValue);
    if (isNaN(newValue)) {
      newValue = value;
    }
    
    // Ensure value is within bounds
    newValue = Math.max(min, Math.min(max, newValue));
    
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  return (
    <div className="flex items-center space-x-1 max-w-[120px]">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
        onClick={decrement}
      >
        <Minus className="h-3 w-3" />
        <span className="sr-only">Decrease</span>
      </Button>
      
      <Input
        id={id}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className="h-8 w-16 text-center bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
      />
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
        onClick={increment}
      >
        <Plus className="h-3 w-3" />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
};
