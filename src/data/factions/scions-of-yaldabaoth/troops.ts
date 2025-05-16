
import { Unit } from "@/types/army";

export const scionsOfYaldabaothTroops: Unit[] = [
  {
    id: "flamecobs",
    name: "Flamecobs",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/flamecobs_card.jpg"
  },
  {
    id: "osseous",
    name: "Osseous",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Bloodlust", "Shove (5)", "Displace (8)"],
    imageUrl: "/art/card/osseous_card.jpg"
  },
  {
    id: "stompers",
    name: "Stompers",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Favorable Terrain (Rugged)", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Slowed"],
    imageUrl: "/art/card/stompers_card.jpg"
  },
  {
    id: "bugbowls",
    name: "Bugbowls",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Cover (BLU)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Shove (2)", "Slowed", "Displace (8)"],
    imageUrl: "/art/card/bugbowls_card.jpg"
  },
  {
    id: "gobblers",
    name: "Gobblers",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Fearless", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed", "Diplsace (8)"],
    imageUrl: "/art/card/gobblers_card.jpg"
  },
  {
    id: "crucible",
    name: "Crucible",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (1)", description: "" },
      { name: "Large", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Place (10)"],
    imageUrl: "/art/card/crucible_card.jpg"
  },
  {
    id: "intact",
    name: "Intact",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Bloodlust", "Repeat a Die"],
    imageUrl: "/art/card/intact_card.jpg"
  },
  {
    id: "anointed",
    name: "Anointed",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Fearless", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/anointed_card.jpg"
  },
  {
    id: "marked",
    name: "Marked",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Repeat a Die"],
    imageUrl: "/art/card/marked_card.jpg"
  },
  {
    id: "marked-marksmen",
    name: "Marked Marksmen",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Shove (3)", "Displace (3)", "Repeat a Die"],
    imageUrl: "/art/card/marked_marksmen_card.jpg"
  },
  {
    id: "husks",
    name: "Husks",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Golem", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Slowed"],
    imageUrl: "/art/card/husks_card.jpg"
  },
  {
    id: "echoes",
    name: "Echoes",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Elite", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Impassable", "Immovable"],
    command: 1,
    imageUrl: "/art/card/echoes_card.jpg"
  },
  {
    id: "mornmab",
    name: "Mornmab",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Golem", description: "" },
      { name: "Large", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Shove (3)", "Displace (3)"],
    imageUrl: "/art/card/mornmab_card.jpg"
  },
  {
    id: "kipleacht",
    name: "Kipleacht",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Golem", description: "" },
      { name: "Large", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed", "Frightened", "Place", "Displace", "Repeat a Die"],
    imageUrl: "/art/card/kipleacht_card.jpg"
  },
  // Add any missing units from Supabase that weren't in the original file
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
    id: "tattooist",
    name: "Tattooist",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Repeat a Die"],
    imageUrl: "/art/card/tattooist_card.jpg"
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Entangle", "Displace (5)"],
    imageUrl: "/art/card/puppeteer_card.jpg"
  },
  {
    id: "overseer",
    name: "Overseer",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Command (1)", "Repeat a Die"],
    command: 1,
    imageUrl: "/art/card/overseer_card.jpg"
  }
];
