
import { Unit } from "../../../../types/army";

export const northernTribesSupports: Unit[] = [
  {
    id: "wisemane",
    name: "Wisemane",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
    ],
    specialRules: ["Vulnerable", "Fix a Die"],
    highCommand: false,
    imageUrl: "/art/card/wisemane_card.jpg"
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Ambusher", description: "Has the Ambusher ability" },
      { name: "Dispel (BLK, BLK)", description: "Can dispel magic" },
      { name: "Join (Hunters)", description: "Can join Hunter units" },
    ],
    specialRules: ["Scout", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/darkmaster_card.jpg"
  },
  {
    id: "tattooist",
    name: "Tattooist",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
      { name: "Elite", description: "Elite unit" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/tattooist_card.jpg"
  },
  {
    id: "coal",
    name: "Coal",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Companion", description: "Companion unit type" },
      { name: "Join (Iriavik)", description: "Can join Iriavik" },
    ],
    specialRules: ["Slowed", "Fix a Die"],
    highCommand: false,
    imageUrl: "/art/card/coal_card.jpg"
  }
];
