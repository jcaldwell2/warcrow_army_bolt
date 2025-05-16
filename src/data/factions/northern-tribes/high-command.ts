
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "wrathmane",
    name: "Wrathmane",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Elite", description: "Elite unit" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
    highCommand: true,
    imageUrl: "/art/card/wrathmane_card.jpg"
  },
  {
    id: "ahlwardt",
    name: "Ahlwardt, Ice Bear",
    faction: "northern-tribes",
    pointsCost: 60,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Varank", description: "Varank race" },
      { name: "Berserker Rage", description: "Has Berserker Rage" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Skin Changers)", description: "Can join Skin Changers units" },
    ],
    specialRules: ["Vulnerable"],
    highCommand: true,
    imageUrl: "/art/card/ahlwardt_ice_bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    faction: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Elite", description: "Elite unit" },
      { 
        name: "Join (Infantry, Orc | Infantry, Varank)", 
        description: "Can join Infantry Orc or Infantry Varank units" 
      },
    ],
    specialRules: ["Vulnerable", "Dispel (D)"],
    highCommand: true,
    imageUrl: "/art/card/alborc_card.jpg"
  }
];
