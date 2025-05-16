
import { Unit } from "@/types/army";

export const scionsOfYaldabaothCharacters: Unit[] = [
  {
    id: "master-keorl",
    name: "Master Keorl",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Command (1)", "Repeat a Die"],
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  {
    id: "progenitor-sculptor",
    name: "Progenitor Sculptor",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Place (6)", "Repeat a Die"],
    imageUrl: "/art/card/progenitor_sculptor_card.jpg"
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }, 
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Command (1)", "Repeat a Die"],
    command: 1,
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    pointsCost: 65,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Command (1)", "Repeat a Die"],
    command: 1,
    imageUrl: "/art/card/darkmaster_card.jpg"
  }
];
