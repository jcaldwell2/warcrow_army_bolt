
import { Unit } from "../../../../types/army";

export const northernTribesElites: Unit[] = [
  {
    id: "ormuk",
    name: "Ormuk",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Orc", description: "Orc race" },
      { name: "Bloodlust", description: "Has the Bloodlust ability" },
      { name: "Dispel (BLK)", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Immovable", description: "Has the Immovable ability" },
      { name: "Intimidating (1)", description: "Intimidates nearby enemies" },
    ],
    specialRules: ["Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/revenant_card.jpg"
  }
];
