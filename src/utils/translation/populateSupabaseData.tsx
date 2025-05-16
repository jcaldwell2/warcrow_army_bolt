
import { supabase } from "@/integrations/supabase/client";
import { factions, units } from "@/data/factions";
import { keywordDefinitions } from "@/data/keywordDefinitions";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";
import { toast } from "sonner";

/**
 * Populate the Supabase database with existing data from the application
 */
export const populateSupabaseData = async () => {
  // Track progress
  const totalSteps = 4;
  let currentStep = 0;
  let success = true;

  try {
    // Step 1: Upload keywords
    currentStep++;
    console.log(`Starting step ${currentStep}/${totalSteps}: Uploading keywords`);
    const keywordsResult = await populateKeywords();
    if (!keywordsResult) {
      console.error("Failed to upload keywords");
      success = false;
    } else {
      toast.success(`Step ${currentStep}/${totalSteps}: Keywords uploaded`);
    }

    // Step 2: Upload special rules
    currentStep++;
    console.log(`Starting step ${currentStep}/${totalSteps}: Uploading special rules`);
    const rulesResult = await populateSpecialRules();
    if (!rulesResult) {
      console.error("Failed to upload special rules");
      success = false;
    } else {
      toast.success(`Step ${currentStep}/${totalSteps}: Special rules uploaded`);
    }

    // Step 3: Upload characteristics
    currentStep++;
    console.log(`Starting step ${currentStep}/${totalSteps}: Uploading characteristics`);
    const characteristicsResult = await populateCharacteristics();
    if (!characteristicsResult) {
      console.error("Failed to upload characteristics");
      success = false;
    } else {
      toast.success(`Step ${currentStep}/${totalSteps}: Characteristics uploaded`);
    }

    // Step 4: Upload unit data
    currentStep++;
    console.log(`Starting step ${currentStep}/${totalSteps}: Uploading unit data`);
    const unitResult = await populateUnitData();
    if (!unitResult) {
      console.error("Failed to upload unit data");
      success = false;
    } else {
      toast.success(`Step ${currentStep}/${totalSteps}: Unit data uploaded`);
    }

    if (success) {
      toast.success("All data has been successfully uploaded to Supabase");
    } else {
      toast.warning("Some data failed to upload. Check console for details.");
    }
    return success;
  } catch (error: any) {
    console.error("Error populating Supabase data:", error);
    toast.error(`Error during step ${currentStep}/${totalSteps}: ${error.message}`);
    return false;
  }
};

/**
 * Upload existing keyword definitions to Supabase
 */
const populateKeywords = async () => {
  console.log(`Found ${Object.keys(keywordDefinitions).length} keywords to upload`);
  try {
    const keywords = Object.entries(keywordDefinitions).map(([name, description]) => ({
      name,
      description,
    }));

    // Process in batches to avoid overloading the API
    const batchSize = 20;
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      console.log(`Uploading keywords batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(keywords.length/batchSize)}`);
      const { error } = await supabase.from("unit_keywords").upsert(
        batch,
        { onConflict: "name" }
      );

      if (error) {
        console.error("Error uploading keywords batch:", error);
        throw error;
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return true;
  } catch (error) {
    console.error("Error in populateKeywords:", error);
    return false;
  }
};

/**
 * Upload existing special rule definitions to Supabase
 */
const populateSpecialRules = async () => {
  console.log(`Found ${Object.keys(specialRuleDefinitions).length} special rules to upload`);
  try {
    const specialRules = Object.entries(specialRuleDefinitions).map(([name, description]) => ({
      name,
      description,
    }));

    // Process in batches
    const batchSize = 20;
    for (let i = 0; i < specialRules.length; i += batchSize) {
      const batch = specialRules.slice(i, i + batchSize);
      console.log(`Uploading special rules batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(specialRules.length/batchSize)}`);
      const { error } = await supabase.from("special_rules").upsert(
        batch,
        { onConflict: "name" }
      );

      if (error) {
        console.error("Error uploading special rules batch:", error);
        throw error;
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return true;
  } catch (error) {
    console.error("Error in populateSpecialRules:", error);
    return false;
  }
};

/**
 * Upload existing characteristic definitions to Supabase
 */
const populateCharacteristics = async () => {
  console.log(`Found ${Object.keys(characteristicDefinitions).length} characteristics to upload`);
  try {
    const characteristics = Object.entries(characteristicDefinitions).map(([name, description]) => ({
      name,
      description,
    }));

    // Process in batches
    const batchSize = 20;
    for (let i = 0; i < characteristics.length; i += batchSize) {
      const batch = characteristics.slice(i, i + batchSize);
      console.log(`Uploading characteristics batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(characteristics.length/batchSize)}`);
      const { error } = await supabase.from("unit_characteristics").upsert(
        batch,
        { onConflict: "name" }
      );

      if (error) {
        console.error("Error uploading characteristics batch:", error);
        throw error;
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return true;
  } catch (error) {
    console.error("Error in populateCharacteristics:", error);
    return false;
  }
};

/**
 * Upload existing unit data to Supabase
 */
const populateUnitData = async () => {
  console.log(`Found ${units.length} units to upload`);
  try {
    // Convert units to the format expected by the unit_data table
    const unitData = units.map(unit => {
      // Extract keywords as strings
      const keywords = unit.keywords.map(kw => 
        typeof kw === 'string' ? kw : kw.name
      );

      // Don't include id field - let Supabase generate it automatically
      return {
        name: unit.name,
        description: "", // The Unit type doesn't have a description property
        faction: unit.faction,
        type: getUnitType(unit.keywords),
        points: unit.pointsCost,
        characteristics: { 
          availability: unit.availability,
          command: unit.command || null,
          highCommand: unit.highCommand || false
        },
        keywords,
        special_rules: unit.specialRules || [],
        options: []
      };
    });

    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < unitData.length; i += batchSize) {
      const batch = unitData.slice(i, i + batchSize);
      console.log(`Uploading unit data batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(unitData.length/batchSize)}`);
      const { error } = await supabase.from("unit_data").insert(
        batch
      );

      if (error) {
        console.error("Error uploading unit data batch:", error);
        throw error;
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return true;
  } catch (error) {
    console.error("Error in populateUnitData:", error);
    return false;
  }
};

/**
 * Determine the unit type based on keywords
 */
const getUnitType = (keywords: any[]): string => {
  const keywordNames = keywords.map(k => typeof k === 'string' ? k : k.name);
  
  if (keywordNames.includes("Character")) {
    // Check for "Named Character" type
    if (keywordNames.some(k => ["High Command", "Colossal Company"].includes(k))) {
      return "Named Character";
    }
    return "Character";
  } else if (keywordNames.some(k => ["Cavalry", "Mounted"].includes(k))) {
    return "Cavalry";
  } else if (keywordNames.includes("Infantry")) {
    return "Troop";
  } else if (keywordNames.includes("Beast")) {
    return "Beast";
  } else if (keywordNames.includes("Construct")) {
    return "Construct";
  } else if (keywordNames.includes("Companion")) {
    return "Companion";
  }
  
  return "Troop"; // Default type
};
