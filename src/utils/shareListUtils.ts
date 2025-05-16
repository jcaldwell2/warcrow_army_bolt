
import { SavedList } from "@/types/army";
import { compress, decompress } from "./compressionUtils";

/**
 * Encodes a list into a URL-safe string with compression
 */
export const encodeListToUrl = (list: SavedList): string => {
  // Only include essential data for sharing
  const minimalList = {
    name: list.name,
    faction: list.faction,
    units: list.units.map(unit => ({
      id: unit.id,
      name: unit.name,
      pointsCost: unit.pointsCost,
      command: unit.command || 0,
      highCommand: unit.highCommand || false,
      quantity: unit.quantity || 1,
      keywords: unit.keywords || []
    })),
    created_at: list.created_at
  };
  
  // Convert list to a serialized string
  const listData = JSON.stringify(minimalList);
  
  // Compress and encode the data
  return compress(listData);
};

/**
 * Decodes a URL-safe string back into a list
 */
export const decodeUrlToList = (encodedUrl: string): SavedList | null => {
  try {
    console.log("Attempting to decode:", encodedUrl);
    
    if (!encodedUrl || encodedUrl.trim() === '') {
      console.error("Empty or invalid encoded URL provided");
      return null;
    }
    
    // Decompress the data
    const jsonString = decompress(encodedUrl);
    const listData = JSON.parse(jsonString);
    
    // Create a temporary ID if none exists
    const tempList: SavedList = {
      id: `temp-${Date.now()}`,
      name: listData.name,
      faction: listData.faction,
      units: listData.units.map(unit => ({
        ...unit,
        quantity: unit.quantity || 1,
        highCommand: !!unit.highCommand,
        command: unit.command || 0
      })),
      created_at: listData.created_at || new Date().toISOString()
    };
    
    return tempList;
  } catch (error) {
    console.error("Failed to decode list data:", error);
    return null;
  }
};

/**
 * Generates a full shareable URL for a list
 */
export const generateShareableLink = (list: SavedList): string => {
  const encodedList = encodeListToUrl(list);
  const baseUrl = window.location.origin;
  // Generate URL with the listCode parameter matching the route
  return `${baseUrl}/shared-list/${encodedList}`;
};
