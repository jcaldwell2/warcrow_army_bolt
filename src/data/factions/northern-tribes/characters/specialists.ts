
import { Unit } from "../../../../types/army";

export const northernTribesSpecialists: Unit[] = [
  {
    id: "iriavik-restless-pup",
    name: "Iriavik Restless Pup",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Nemorous", description: "Has the Nemorous keyword" },
      { name: "Varank", description: "Varank race" },
      { name: "Ambusher", description: "Has the Ambusher ability" },
      { name: "Dispel (BLK)", description: "Can dispel magic" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
    ],
    specialRules: ["Slowed", "Place (3)", "Immune to State", "Frightened"],
    highCommand: false,
    imageUrl: "/art/card/iriavik_restless_pup_card.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    specialRules: ["Disarmed", "Slowed", "Vulnerable", "Displace (X)", "Place (X)"],
    highCommand: false,
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "selika",
    name: "Selika",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Ambusher", description: "Has the Ambusher ability" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/selika_card.jpg"
  }
];
