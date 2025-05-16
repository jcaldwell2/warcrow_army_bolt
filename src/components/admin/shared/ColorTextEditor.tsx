import React, { useRef, useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bold, Italic, Underline, Highlighter, PaintBucket } from 'lucide-react';

interface ColorTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

interface ColorOption {
  name: string;
  color: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Default', color: 'inherit' },
  { name: 'Gold', color: '#ffd700' },
  { name: 'Red', color: '#ea384c' },
  { name: 'Green', color: '#10b981' },
  { name: 'Blue', color: '#0ea5e9' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Gray', color: '#9f9ea1' },
];

export const ColorTextEditor: React.FC<ColorTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  rows = 8,
  className = '',
  id,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('inherit');
  const [selectionInfo, setSelectionInfo] = useState<{ text: string, start: number, end: number } | null>(null);
  const [activeFormatting, setActiveFormatting] = useState<string[]>([]);

  // Keep track of the selection when user clicks or selects text
  useEffect(() => {
    const handleSelectionChange = () => {
      if (textareaRef.current && 
          document.activeElement === textareaRef.current &&
          textareaRef.current.selectionStart !== textareaRef.current.selectionEnd) {
        saveSelectionInfo();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const getSelectedText = (): { text: string, start: number, end: number } => {
    if (!textareaRef.current) return { text: '', start: 0, end: 0 };
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = value.substring(start, end);
    
    return { text, start, end };
  };

  const saveSelectionInfo = () => {
    const selection = getSelectedText();
    if (selection.text) {
      setSelectionInfo(selection);
    }
  };

  const applyFormatting = (format: string) => {
    if (!textareaRef.current) return;
    
    // Use the stored selection if available, otherwise get current selection
    const { text, start, end } = selectionInfo || getSelectedText();
    if (!text) return;
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${text}</strong>`;
        setActiveFormatting(prev => [...prev, 'bold']);
        break;
      case 'italic':
        formattedText = `<em>${text}</em>`;
        setActiveFormatting(prev => [...prev, 'italic']);
        break;
      case 'underline':
        formattedText = `<u>${text}</u>`;
        setActiveFormatting(prev => [...prev, 'underline']);
        break;
      case 'highlight':
        formattedText = `<mark>${text}</mark>`;
        setActiveFormatting(prev => [...prev, 'highlight']);
        break;
      case 'color':
        if (selectedColor === 'inherit') {
          formattedText = text; // Remove color formatting
        } else {
          formattedText = `<span style="color:${selectedColor}">${text}</span>`;
          setActiveFormatting(prev => [...prev, 'color']);
        }
        break;
      default:
        formattedText = text;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Reset focus to the textarea after applying formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + formattedText.length, start + formattedText.length);
        setSelectionInfo(null); // Clear stored selection after applying
      }
    }, 0);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    // If we have stored selection info, apply the color immediately
    if (selectionInfo && selectionInfo.text) {
      setTimeout(() => {
        applyFormatting('color');
      }, 0);
    } else {
      // If no text is selected, focus the textarea to encourage selection
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const isFormatActive = (format: string): boolean => {
    return activeFormatting.includes(format);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1 p-1 bg-black/30 rounded border border-warcrow-gold/20">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${isFormatActive('bold') ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-text'}`}
          onClick={() => {
            saveSelectionInfo();
            applyFormatting('bold');
          }}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${isFormatActive('italic') ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-text'}`}
          onClick={() => {
            saveSelectionInfo();
            applyFormatting('italic');
          }}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${isFormatActive('underline') ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-text'}`}
          onClick={() => {
            saveSelectionInfo();
            applyFormatting('underline');
          }}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${isFormatActive('highlight') ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-text'}`}
          onClick={() => {
            saveSelectionInfo();
            applyFormatting('highlight');
          }}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${isFormatActive('color') ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-text'}`}
              title="Text Color"
              onClick={saveSelectionInfo}
            >
              <PaintBucket className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-black border border-warcrow-gold/30">
            <ScrollArea className="h-[200px]">
              <div className="p-2 grid grid-cols-3 gap-1">
                {colorOptions.map((option) => (
                  <Button
                    key={option.name}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start gap-2 px-2 py-1 h-auto"
                    onClick={() => handleColorSelect(option.color)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: option.color === 'inherit' ? 'transparent' : option.color }}
                    />
                    <span 
                      className="text-xs" 
                      style={{ color: option.color === 'inherit' ? 'white' : option.color }}
                    >
                      {option.name}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full border border-warcrow-gold/30 bg-black text-white focus:border-warcrow-gold rounded-md p-2 ${className}`}
        style={{
          caretColor: 'white', // Make cursor visible
        }}
        onMouseUp={saveSelectionInfo}
        onKeyUp={saveSelectionInfo}
        onClick={saveSelectionInfo}
      />
    </div>
  );
};
