import { Unit } from "../../../types/army";

export const hegemonyTroops: Unit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    specialRules: ["Cancel a Symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    highCommand: false,
    imageUrl: "/art/card/aggressors_card.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],   
    highCommand: false,
    imageUrl: "/art/card/black_legion_bucklermen_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover (BLK)", description: "Provides cover" },
    ],
    specialRules: ["Frightened"],
    highCommand: false,
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover (BLK)", description: "Provides cover" },
      { name: "Immovable", description: "Cannot be moved" },
    ],
    specialRules: ["Shove (3)"],
    highCommand: false,
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dispel (BLU)", description: "Can dispel magic" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    highCommand: false,
    imageUrl: "/art/card/pioneers_card.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Cavalry", description: "Mounted Unit" },
      { name: "Human", description: "Human race" },
      { name: "Preferred Terrain (Rugged)", description: "Infantry unit type" },
    ],
    specialRules: ["Intimidating (2)"],
    highCommand: false,
    imageUrl: "/art/card/black_angels_card.jpg"
  }
];
