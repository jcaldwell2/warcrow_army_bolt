import { Unit } from "../../../types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/battle-scarred_card.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },      
    ],
    specialRules: ["Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/orc_hunters_card.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Fearless", description: "Has the Fearless ability" },
    ],
    specialRules: ["Scout"],
    highCommand: false,
    imageUrl: "/art/card/skin_changers_card.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
    ],
    specialRules: ["Slowed"],
    highCommand: false,
    imageUrl: "/art/card/ice_archers_card.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    specialRules: ["Displace (3)", "Rugged", "Trap"],
    highCommand: false,
    imageUrl: "/art/card/tundra_marauders_card.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Cavalry", description: "Cavalry unit type" },
      { name: "Orc", description: "Northern Tribes Race" },  
      { name: "Bloodlust", description: "Has Bloodlust" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
      { name: "Raging", description: "Has Raging" }
    ],
    specialRules: ["Vulnerable", "Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/warg_riders_card.jpg"
  }
];
