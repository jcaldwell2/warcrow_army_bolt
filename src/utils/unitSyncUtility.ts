
import { supabase } from '@/integrations/supabase/client';
import { ApiUnit, Unit } from '@/types/army';
import { Json } from '@/integrations/supabase/types';
import { mapApiUnitToUnit } from '@/components/stats/unit-explorer/useUnitData';

/**
 * Type helper to convert Supabase Json type to expected Record format
 */
type DbUnitData = Omit<ApiUnit, 'characteristics'> & {
  characteristics: Json;
};

/**
 * Convert a database unit to API unit format
 */
function convertDbUnitToApiUnit(dbUnit: any): ApiUnit {
  return {
    ...dbUnit,
    characteristics: dbUnit.characteristics as Record<string, any>,
    special_rules: dbUnit.special_rules || [],
    keywords: dbUnit.keywords || [],
    points: dbUnit.points || 0,
    faction_display: dbUnit.faction,
    type: dbUnit.type || 'unit' // Ensure type property always exists
  };
}

/**
 * Utility for comparing local unit data with Supabase data
 * This is useful for developers/admins to ensure local data is in sync with the database
 */
export async function findMissingUnits(factionId: string): Promise<{
  onlyInDatabase: ApiUnit[];
  onlyInLocalData: Unit[];
  inBoth: Array<{db: ApiUnit, local: Unit}>;
}> {
  try {
    // Get units from database
    const { data: dbUnitsRaw, error } = await supabase
      .from('unit_data')
      .select('*')
      .eq('faction', factionId);
    
    if (error) throw error;
    
    // Convert database units to API format
    const dbUnits: ApiUnit[] = (dbUnitsRaw || []).map(convertDbUnitToApiUnit);

    // Get local units
    let localUnits: Unit[] = [];
    
    try {
      switch(factionId) {
        case 'northern-tribes':
          const { northernTribesUnits } = await import('@/data/factions/northern-tribes');
          localUnits = northernTribesUnits;
          break;
        case 'hegemony-of-embersig':
          const { hegemonyOfEmbersigUnits } = await import('@/data/factions/hegemony-of-embersig');
          localUnits = hegemonyOfEmbersigUnits;
          break;
        case 'scions-of-yaldabaoth':
          const { scionsOfYaldabaothUnits } = await import('@/data/factions/scions-of-yaldabaoth');
          localUnits = scionsOfYaldabaothUnits;
          break;
        case 'syenann':
          const { syenannUnits } = await import('@/data/factions/syenann');
          localUnits = syenannUnits;
          break;
        default:
          const { units } = await import('@/data/factions');
          localUnits = units.filter(u => u.faction === factionId);
      }
    } catch (error) {
      console.error(`Error loading local units for ${factionId}:`, error);
      const { units } = await import('@/data/factions');
      localUnits = units.filter(u => u.faction === factionId);
    }

    // Find units that are only in the database
    const onlyInDatabase = dbUnits.filter(dbUnit => 
      !localUnits.some(localUnit => localUnit.id === dbUnit.id)
    );

    // Find units that are only in local data
    const onlyInLocalData = localUnits.filter(localUnit => 
      !dbUnits.some(dbUnit => dbUnit.id === localUnit.id)
    );

    // Find units that are in both
    const inBoth = dbUnits
      .filter(dbUnit => localUnits.some(localUnit => localUnit.id === dbUnit.id))
      .map(dbUnit => ({
        db: dbUnit,
        local: localUnits.find(localUnit => localUnit.id === dbUnit.id)!
      }));

    return {
      onlyInDatabase,
      onlyInLocalData,
      inBoth
    };
  } catch (error) {
    console.error('Error comparing units:', error);
    throw error;
  }
}

/**
 * Generate code for missing units that can be added to the local data files
 */
export function generateUnitCode(unit: ApiUnit): string {
  // Convert the API unit to a local unit format
  const localUnit = mapApiUnitToUnit(unit);
  
  // Generate the code representation
  const code = `  {
    id: "${localUnit.id}",
    name: "${localUnit.name}",
    pointsCost: ${localUnit.pointsCost},
    faction: "${localUnit.faction}",
    keywords: [
${localUnit.keywords.map(k => `      { name: "${k.name}", description: "" }`).join(',\n')}
    ],
    highCommand: ${localUnit.highCommand || false},
    availability: ${localUnit.availability || 1},
${localUnit.command ? `    command: ${localUnit.command},\n` : ''}${localUnit.specialRules && localUnit.specialRules.length > 0 ? `    specialRules: [${localUnit.specialRules.map(r => `"${r}"`).join(', ')}],\n` : ''}    imageUrl: "/art/card/${localUnit.id}_card.jpg"
  }`;
  
  return code;
}

/**
 * Creates full TypeScript file content for a faction's units based on database data
 */
export async function generateFactionFileContent(factionId: string): Promise<{
  troopsFile: string;
  charactersFile: string;
  highCommandFile: string;
  mainFile: string;
}> {
  try {
    const { data: dbUnitsRaw, error } = await supabase
      .from('unit_data')
      .select('*')
      .eq('faction', factionId);
      
    if (error) throw error;
    
    // Convert database units to API format
    const dbUnits: ApiUnit[] = (dbUnitsRaw || []).map(convertDbUnitToApiUnit);
    
    // Convert API units to local format
    const localUnits = dbUnits.map(mapApiUnitToUnit);
    
    // Group units by type
    const troops = localUnits.filter(u => !u.highCommand && (!u.command || u.command < 2));
    const characters = localUnits.filter(u => !u.highCommand && u.command === 1);
    const highCommand = localUnits.filter(u => u.highCommand || u.command === 2);
    
    // Helper function to create ApiUnit with required fields
    const createApiUnitForGeneration = (unit: Unit): ApiUnit => {
      return {
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        type: 'unit', // Add the required 'type' field
        points: unit.pointsCost,
        keywords: unit.keywords.map(k => k.name),
        special_rules: unit.specialRules || [],
        characteristics: {
          availability: unit.availability, 
          command: unit.command, 
          highCommand: unit.highCommand
        } as Record<string, any>,
        faction_display: unit.faction
      };
    };
    
    // Generate code for each group
    const troopsCode = troops.map(unit => 
      generateUnitCode(createApiUnitForGeneration(unit))
    ).join(',\n\n');
    
    const charactersCode = characters.map(unit => 
      generateUnitCode(createApiUnitForGeneration(unit))
    ).join(',\n\n');
    
    const highCommandCode = highCommand.map(unit => 
      generateUnitCode(createApiUnitForGeneration(unit))
    ).join(',\n\n');
    
    return {
      troopsFile: `import { Unit } from "@/types/army";\n\nexport const ${factionId.replace(/-/g, '')}Troops: Unit[] = [\n${troopsCode}\n];\n`,
      charactersFile: `import { Unit } from "@/types/army";\n\nexport const ${factionId.replace(/-/g, '')}Characters: Unit[] = [\n${charactersCode}\n];\n`,
      highCommandFile: `import { Unit } from "@/types/army";\n\nexport const ${factionId.replace(/-/g, '')}HighCommand: Unit[] = [\n${highCommandCode}\n];\n`,
      mainFile: `import { Unit } from "../../types/army";\nimport { ${factionId.replace(/-/g, '')}Troops } from "./${factionId}/troops";\nimport { ${factionId.replace(/-/g, '')}Characters } from "./${factionId}/characters";\nimport { ${factionId.replace(/-/g, '')}HighCommand } from "./${factionId}/high-command";\n\nexport const ${factionId.replace(/-/g, '')}Units: Unit[] = [\n  ...${factionId.replace(/-/g, '')}Troops,\n  ...${factionId.replace(/-/g, '')}Characters,\n  ...${factionId.replace(/-/g, '')}HighCommand\n];\n`
    };
  } catch (error) {
    console.error(`Error generating file content for ${factionId}:`, error);
    throw error;
  }
}
