
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit } from '@/types/game';
import { toast } from 'sonner';
import { fadeIn } from '@/lib/animations';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Annotation {
  id: string;
  x: number;
  y: number;
  label: string;
  unitId?: string;
}

interface UnitAnnotatorProps {
  photoUrl: string;
  units: Unit[];
  initialAnnotations?: Annotation[];
  onSave: (annotations: Annotation[]) => void;
}

const UnitAnnotator: React.FC<UnitAnnotatorProps> = ({
  photoUrl,
  units,
  initialAnnotations = [],
  onSave,
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false);
  const [groupedUnits, setGroupedUnits] = useState<Record<string, Unit[]>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset any active states when initialAnnotations change
  useEffect(() => {
    setAnnotations(initialAnnotations);
    setIsAddingAnnotation(false);
    setSelectedAnnotation(null);
    setUnitSelectionOpen(false);
  }, [initialAnnotations]);

  // Group units by player when units change
  useEffect(() => {
    const grouped: Record<string, Unit[]> = {};
    units.forEach(unit => {
      if (!grouped[unit.player]) {
        grouped[unit.player] = [];
      }
      grouped[unit.player].push(unit);
    });
    setGroupedUnits(grouped);
  }, [units]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingAnnotation || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      x,
      y,
      label: `Unit ${annotations.length + 1}`,
    };
    
    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
    setUnitSelectionOpen(true);
    setIsAddingAnnotation(false);
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setUnitSelectionOpen(true);
  };

  const handleUnitSelect = (unitId: string) => {
    if (!selectedAnnotation) return;
    
    // Find the unit info
    const unit = units.find(unit => unit.id === unitId);
    if (!unit) return;
    
    const label = unit.name;
    
    setAnnotations(annotations.map(a => 
      a.id === selectedAnnotation.id ? { ...a, unitId, label } : a
    ));
    
    setUnitSelectionOpen(false);
    setSelectedAnnotation(null);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    setAnnotations(annotations.filter(a => a.id !== annotationId));
    if (selectedAnnotation?.id === annotationId) {
      setSelectedAnnotation(null);
      setUnitSelectionOpen(false);
    }
  };

  const handleSaveAnnotations = () => {
    onSave(annotations);
    toast.success("Annotations saved successfully!");
  };

  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Annotate Units</h3>
          <p className="text-sm text-muted-foreground">Mark the positions of units in the photo</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isAddingAnnotation ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveAnnotations}
            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
          >
            <Save className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="relative bg-black rounded-xl overflow-hidden cursor-crosshair"
        onClick={handleImageClick}
      >
        <img 
          src={photoUrl} 
          alt="Game state" 
          className="w-full object-contain max-h-[60vh]"
        />
        
        {/* Annotation markers */}
        {annotations.map((annotation) => (
          <motion.div
            key={annotation.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="annotation-point"
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              handleAnnotationClick(annotation);
            }}
          >
            {annotation.label.charAt(0)}
          </motion.div>
        ))}
        
        {/* Helper text */}
        {isAddingAnnotation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 px-4 py-2 rounded-full text-white text-sm">
              Tap on the image to place a marker
            </div>
          </div>
        )}
      </div>
      
      {/* List of annotations with delete option */}
      {annotations.length > 0 && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Placed Markers</h4>
          <ul className="space-y-1">
            {annotations.map((annotation) => (
              <li key={annotation.id} className="flex justify-between items-center py-1 px-2 hover:bg-secondary rounded-md">
                <span className="text-sm">{annotation.label}</span>
                <button
                  onClick={() => handleDeleteAnnotation(annotation.id)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                >
                  <Trash className="w-3 h-3 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Unit selection dialog */}
      <AnimatePresence>
        {unitSelectionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-background rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-auto"
            >
              <h3 className="font-semibold mb-4">Select Unit</h3>
              
              {Object.entries(groupedUnits).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedUnits).map(([playerId, playerUnits]) => (
                    <div key={playerId} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {playerUnits[0]?.player || "Unknown Player"}
                      </h4>
                      <div className="space-y-1">
                        {playerUnits.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => handleUnitSelect(unit.id)}
                            className="w-full text-left py-2 px-3 bg-secondary/50 hover:bg-secondary rounded-lg text-sm"
                          >
                            {unit.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No units available</p>
              )}
              
              <button
                onClick={() => {
                  setUnitSelectionOpen(false);
                  setSelectedAnnotation(null);
                }}
                className="mt-4 w-full py-2 border border-muted rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          .annotation-point {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.8);
            color: black;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transform: translate(-50%, -50%);
            cursor: pointer;
            box-shadow: 0 0 0 2px black;
          }
        `}
      </style>
    </div>
  );
};

export default UnitAnnotator;
