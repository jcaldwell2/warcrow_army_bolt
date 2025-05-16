
import { Unit } from "../../../types/army";

export const hegemonyHighCommand: Unit[] = [
  {
    id: "dragoslav-bjelogric",
    name: "Dragoslav Bjelogric",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Bloodlust (Varank)", description: "Has Bloodlust against Varank" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Bucklermen | Bulwark)", description: "Can join Bucklermen or Bulwark units" },
    ],
    specialRules: ["Vulnerable", "Elite", "Bloodlust (Varank)", "Repeat a Die"],
    highCommand: true,
    imageUrl: "/art/card/dragoslav_card.jpg"
  },
  {
    id: "hetman",
    name: "Hetman",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: true,
    imageUrl: "/art/card/hetman_card.jpg"
  },
  {
    id: "amelia-hellbroth",
    name: "Amelia Hellbroth",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    specialRules: ["Vulnerable", "Disarmed"],
    highCommand: true,
    imageUrl: "/art/card/amelia_hellbroth_card.jpg"
  }
];
