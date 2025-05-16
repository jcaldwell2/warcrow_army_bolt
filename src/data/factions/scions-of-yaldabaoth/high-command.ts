
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "master-nepharim",
    name: "Master Nepharim",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    specialRules: ["Command (2)", "Repeat a Die"],
    command: 2,
    imageUrl: "/art/card/master_nepharim_card.jpg"
  },
  {
    id: "lady-tlia",
    name: "Lady Tlia",
    pointsCost: 60,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    specialRules: ["Command (2)", "Repeat a Die", "High Command"],
    command: 2,
    imageUrl: "/art/card/lady_tlia_card.jpg"
  }
];
