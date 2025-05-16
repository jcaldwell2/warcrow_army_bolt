
/**
 * Generates a random game join code
 * @returns A 6-character alphanumeric code
 */
export const generateJoinCode = (): string => {
  // Use only uppercase letters and numbers
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed potentially confusing characters like 0, O, 1, I
  let code = '';
  
  // Generate a 6-character code
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
};

/**
 * Formats a game code with a space in the middle for better readability
 * @param code The raw game code
 * @returns A formatted game code (e.g., "ABC DEF")
 */
export const formatJoinCode = (code: string): string => {
  if (!code) return '';
  
  // Clean the code (remove spaces, uppercase)
  const cleanCode = code.replace(/\s/g, '').toUpperCase();
  
  if (cleanCode.length <= 3) return cleanCode;
  
  // Insert a space in the middle
  const midpoint = Math.floor(cleanCode.length / 2);
  return `${cleanCode.slice(0, midpoint)} ${cleanCode.slice(midpoint)}`;
};

/**
 * Validates if a game code has the correct format
 * @param code The game code to validate
 * @returns True if the code is valid
 */
export const validateJoinCode = (code: string): boolean => {
  if (!code) return false;
  
  // Clean the code (remove spaces)
  const cleanCode = code.replace(/\s/g, '');
  
  // Check if it's the right length and contains only allowed characters
  return cleanCode.length === 6 && /^[A-Z0-9]+$/.test(cleanCode);
};

/**
 * Invites a friend to join a game by sending a notification
 * @param friendId The ID of the friend to invite
 * @param gameId The ID of the game
 * @param senderName The name of the player sending the invitation
 * @returns Promise resolving to success boolean
 */
export const inviteFriendToGame = async (
  friendId: string, 
  gameId: string, 
  senderName: string
): Promise<boolean> => {
  try {
    // Create a game code for this invite
    const gameCode = generateJoinCode();
    
    // Store the game code in the database (this would be implemented in a real app)
    // For now we'll simulate this with localStorage
    const gameData = {
      code: gameCode,
      gameId,
      sender: senderName,
      timestamp: Date.now()
    };
    
    // In a real implementation, we would:
    // 1. Create a record in the game_join_codes table
    // 2. Add a notification for the friend
    // 3. Return success based on that operation
    
    // For now, just simulate success and store the invite locally
    localStorage.setItem(`game_invite_${friendId}_${gameCode}`, JSON.stringify(gameData));
    
    console.log(`Invited friend ${friendId} to game ${gameId} with code ${gameCode}`);
    return true;
  } catch (error) {
    console.error('Error inviting friend to game:', error);
    return false;
  }
};
