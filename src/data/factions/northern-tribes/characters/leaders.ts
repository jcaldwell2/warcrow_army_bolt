
import { Unit } from "../../../../types/army";

export const northernTribesLeaders: Unit[] = [
  {
    id: "njord-the-merciless",
    name: "Njord, The Merciless",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Berserker Rage", description: "Has Berserker Rage" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    specialRules: ["Frightened", "Raging", "Fearless"],
    highCommand: false,
    imageUrl: "/art/card/njord_the_merciless_card.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Berserker Rage", description: "Has Berserker Rage" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    specialRules: ["Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "contender",
    name: "Contender",
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
    specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
    highCommand: false,
    imageUrl: "/art/card/contender_card.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Intimidating (X)", "Flee", "Slowed"],
    highCommand: false,
    imageUrl: "/art/card/evoker_card.jpg"
  },
  {
    id: "eskold-the-executioner",
    name: "Eskold the Executioner",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Join (Infantry, Varank| Cavalry Warg)", description: "Can join Infantry Varank or Calvary Warg units" },
      { name: "Elite", description: "Elite unit" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/eskold_the_executioner_card.jpg"
  }
];
